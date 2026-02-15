import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PENNYLANE_BASE = "https://app.pennylane.com/api/external/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PENNYLANE_API_KEY = Deno.env.get("PENNYLANE_API_KEY");
    if (!PENNYLANE_API_KEY) {
      throw new Error("PENNYLANE_API_KEY is not configured");
    }

    const body = await req.json();
    const {
      nom,
      prenom,
      email,
      telephone,
      adresse,
      dateMariage,
      lines, // array of { label: string, quantity: number, unit_price: number }
    } = body;

    // Build invoice lines for Pennylane
    const invoiceLines = lines
      .filter((l: any) => l.quantity > 0 && l.unit_price > 0)
      .map((l: any, i: number) => ({
        label: l.label,
        quantity: l.quantity,
        currency_amount: String(l.unit_price * l.quantity),
        unit: "piece",
        vat_rate: "FR_200", // 20% TVA
        section_rank: i,
      }));

    if (invoiceLines.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucune ligne de devis à créer" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create estimate (customer_invoice with draft + quote flags)
    // Using v1 API with create_customer flag
    const pennylaneBody = {
      create_customer: true,
      update_customer: true,
      customer: {
        name: `${prenom || ""} ${nom || ""}`.trim(),
        emails: email ? [email] : [],
        phone: telephone || undefined,
        address: adresse || undefined,
        customer_type: "individual",
      },
      date: new Date().toISOString().split("T")[0],
      deadline: dateMariage || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      draft: true,
      currency: "EUR",
      special_mention: dateMariage ? `Date du mariage : ${dateMariage}` : "",
      line_items: invoiceLines,
    };

    console.log("Creating Pennylane estimate:", JSON.stringify(pennylaneBody, null, 2));

    // Try creating as a quote first (v1 estimates endpoint)
    const response = await fetch(`${PENNYLANE_BASE}/customer_estimates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PENNYLANE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(pennylaneBody),
    });

    const responseText = await response.text();
    console.log("Pennylane response status:", response.status);
    console.log("Pennylane response:", responseText);

    if (!response.ok) {
      // Try v2 quotes endpoint as fallback
      const v2Body = {
        customer_name: `${prenom || ""} ${nom || ""}`.trim(),
        customer_email: email,
        date: new Date().toISOString().split("T")[0],
        deadline: dateMariage || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        draft: true,
        currency: "EUR",
        invoice_lines: invoiceLines.map((l: any) => ({
          ...l,
          currency_amount_before_tax: l.currency_amount,
        })),
      };

      const v2Response = await fetch("https://app.pennylane.com/api/external/v2/quotes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PENNYLANE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(v2Body),
      });

      const v2Text = await v2Response.text();
      console.log("Pennylane v2 response status:", v2Response.status);
      console.log("Pennylane v2 response:", v2Text);

      if (!v2Response.ok) {
        return new Response(
          JSON.stringify({
            error: "Erreur Pennylane",
            details: v2Text,
            v1_details: responseText,
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const v2Data = JSON.parse(v2Text);
      return new Response(JSON.stringify({ success: true, quote: v2Data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = JSON.parse(responseText);
    return new Response(JSON.stringify({ success: true, estimate: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Pennylane estimate:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

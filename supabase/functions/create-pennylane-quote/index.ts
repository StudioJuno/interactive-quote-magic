import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PENNYLANE_BASE = "https://app.pennylane.com/api/external";

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
      lines,
    } = body;

    const invoiceLines = lines
      .filter((l: any) => l.quantity > 0 && l.unit_price > 0)
      .map((l: any, i: number) => ({
        label: l.label,
        quantity: l.quantity,
        raw_currency_unit_price: String(l.unit_price),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: i,
      }));

    if (invoiceLines.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucune ligne de devis à créer" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = {
      Authorization: `Bearer ${PENNYLANE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Step 1: Create or find the customer via v2
    const customerName = `${prenom || ""} ${nom || ""}`.trim();
    const customerBody: any = {
      name: customerName,
      billing_address: {
        address: adresse || "Non renseignée",
        postal_code: "00000",
        city: "Non renseignée",
        country_alpha2: "FR",
      },
    };
    if (email) customerBody.emails = [email];
    if (telephone) customerBody.phone = telephone;

    console.log("Creating customer:", JSON.stringify(customerBody, null, 2));

    const customerResp = await fetch(`${PENNYLANE_BASE}/v2/company_customers`, {
      method: "POST",
      headers,
      body: JSON.stringify(customerBody),
    });

    const customerText = await customerResp.text();
    console.log("Customer response status:", customerResp.status, customerText);

    let customerId: number | null = null;

    if (customerResp.ok) {
      const customerData = JSON.parse(customerText);
      customerId = customerData.customer?.id || customerData.id;
    } else {
      // Customer might already exist, try to search
      const searchResp = await fetch(
        `${PENNYLANE_BASE}/v2/company_customers?filter=${encodeURIComponent(JSON.stringify([{ field: "name", operator: "eq", value: customerName }]))}`,
        { method: "GET", headers }
      );
      const searchText = await searchResp.text();
      console.log("Customer search response:", searchResp.status, searchText);

      if (searchResp.ok) {
        const searchData = JSON.parse(searchText);
        const customers = searchData.customers || searchData.data || [];
        if (customers.length > 0) {
          customerId = customers[0].id;
        }
      }
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "Impossible de créer ou trouver le client dans Pennylane", details: customerText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Customer ID:", customerId);

    // Step 2: Create quote via v2
    const quoteBody: any = {
      customer_id: customerId,
      date: new Date().toISOString().split("T")[0],
      deadline: dateMariage || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      currency: "EUR",
      invoice_lines: invoiceLines,
    };

    if (dateMariage) {
      quoteBody.special_mention = `Date du mariage : ${dateMariage}`;
    }

    console.log("Creating quote:", JSON.stringify(quoteBody, null, 2));

    const quoteResp = await fetch(`${PENNYLANE_BASE}/v2/quotes`, {
      method: "POST",
      headers,
      body: JSON.stringify(quoteBody),
    });

    const quoteText = await quoteResp.text();
    console.log("Quote response status:", quoteResp.status, quoteText);

    if (!quoteResp.ok) {
      // Fallback: try v1 with proper estimate wrapper
      const v1Body = {
        create_customer: true,
        update_customer: true,
        create_products: true,
        estimate: {
          customer: {
            name: customerName,
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
          line_items: lines
            .filter((l: any) => l.quantity > 0 && l.unit_price > 0)
            .map((l: any, i: number) => ({
              label: l.label,
              quantity: l.quantity,
              currency_amount: l.unit_price * l.quantity,
              unit: "piece",
              vat_rate: "FR_200",
              section_rank: i,
            })),
        },
      };

      console.log("Trying v1 estimate:", JSON.stringify(v1Body, null, 2));

      const v1Resp = await fetch(`${PENNYLANE_BASE}/v1/customer_estimates`, {
        method: "POST",
        headers,
        body: JSON.stringify(v1Body),
      });

      const v1Text = await v1Resp.text();
      console.log("V1 response status:", v1Resp.status, v1Text);

      if (!v1Resp.ok) {
        return new Response(
          JSON.stringify({ error: "Erreur Pennylane", v2_details: quoteText, v1_details: v1Text }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const v1Data = JSON.parse(v1Text);
      return new Response(JSON.stringify({ success: true, estimate: v1Data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const quoteData = JSON.parse(quoteText);
    return new Response(JSON.stringify({ success: true, quote: quoteData }), {
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

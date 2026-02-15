import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PENNYLANE_BASE = "https://app.pennylane.com/api/external";

function formatDateFr(dateStr: string): string {
  if (!dateStr) return "";
  const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const d = new Date(dateStr);
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PENNYLANE_API_KEY = Deno.env.get("PENNYLANE_API_KEY");
    if (!PENNYLANE_API_KEY) throw new Error("PENNYLANE_API_KEY is not configured");

    const body = await req.json();
    const {
      nom, prenom, email, telephone, adresse,
      offerType, dateHeure, nbHeuresCouverture, moments, lieu, departement, nbInvites,
      nbPhotographes, nbVideastes,
      optionDrone, optionInterviews,
      filmTeaser, filmSignature, filmReseaux, filmBetisier,
      albumPhoto, coffretUSB,
      delai, remarques, source, sourceAutre, prices,
    } = body;

    const headers = {
      Authorization: `Bearer ${PENNYLANE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // --- Determine section title ---
    let sectionTitle = "";
    if (offerType === "photos-film") sectionTitle = "Photos et Vidéo";
    else if (offerType === "photos") sectionTitle = "Photos";
    else if (offerType === "film") sectionTitle = "Vidéo";
    else sectionTitle = "Prestation";

    // --- Build event description lines ---
    const datePart = dateHeure ? dateHeure.split("T")[0] : "";
    const timePart = dateHeure && dateHeure.includes("T") ? dateHeure.split("T")[1]?.substring(0, 5) : "";
    const dateFormatted = datePart ? formatDateFr(datePart) : "";
    const eventLine1 = `${dateFormatted}${timePart ? ` à ${timePart.replace(":", "h")}` : ""} (${nbHeuresCouverture || 10} heures de couverture)`;

    const momentsList = (moments || []).join(", ");
    const locationParts = [lieu || "", momentsList, nbInvites ? `${nbInvites} invités` : ""].filter(Boolean);
    const eventLine2 = locationParts.join(" - ");

    // --- Build invoice lines ---
    const invoiceLines: any[] = [];
    const retouchesQty = (nbHeuresCouverture || 10) * 50;

    // Section 0: Main service
    if (offerType === "photos-film") {
      // Combined formule
      const formulaPrice = (nbPhotographes || 0) * (prices?.photographe || 1260) + (nbVideastes || 0) * (prices?.vidéaste || 1700);
      invoiceLines.push({
        label: `Formule ${nbHeuresCouverture || 10} heures`,
        quantity: 1,
        raw_currency_unit_price: String(formulaPrice),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 0,
        description: `${nbPhotographes || 0} photographe(s) + ${nbVideastes || 0} vidéaste(s)`,
      });
    } else if (offerType === "photos") {
      const qty = nbPhotographes || 1;
      invoiceLines.push({
        label: `${qty} photographe${qty > 1 ? "s" : ""}`,
        quantity: 1,
        raw_currency_unit_price: String(qty * (prices?.photographe || 1260)),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 0,
      });
    } else if (offerType === "film") {
      const qty = nbVideastes || 1;
      invoiceLines.push({
        label: `${qty} vidéaste${qty > 1 ? "s" : ""}`,
        quantity: 1,
        raw_currency_unit_price: String(qty * (prices?.vidéaste || 1700)),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 0,
      });
    }

    // Options in section 0
    if (optionDrone) {
      invoiceLines.push({
        label: "Prises de vues aériennes (drone)",
        quantity: 1,
        raw_currency_unit_price: String(prices?.drone || 150),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 0,
      });
    }
    if (optionInterviews) {
      invoiceLines.push({
        label: "Interviews",
        quantity: 1,
        raw_currency_unit_price: String(prices?.interviews || 100),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 0,
      });
    }

    // Section 1: Livrables
    if (offerType === "photos" || offerType === "photos-film") {
      invoiceLines.push({
        label: "Retouches photos incluses",
        quantity: retouchesQty,
        raw_currency_unit_price: "0",
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }
    if (offerType === "film" || offerType === "photos-film") {
      invoiceLines.push({
        label: "Un film long de plus de 15 minutes inclus",
        quantity: 1,
        raw_currency_unit_price: "0",
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }

    // Film extras in Livrables
    if (filmTeaser) {
      invoiceLines.push({
        label: "Format Trailer",
        quantity: 1,
        raw_currency_unit_price: String(prices?.teaser || 200),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }
    if (filmSignature) {
      invoiceLines.push({
        label: 'Film "signature"',
        quantity: 1,
        raw_currency_unit_price: String(prices?.signature || 250),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }
    if (filmReseaux) {
      invoiceLines.push({
        label: "Contenu réseaux sociaux express",
        quantity: 1,
        raw_currency_unit_price: String(prices?.reseaux || 200),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }
    if (filmBetisier) {
      invoiceLines.push({
        label: "Bêtisier",
        quantity: 1,
        raw_currency_unit_price: String(prices?.betisier || 80),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }

    // Supports in Livrables
    if (albumPhoto) {
      invoiceLines.push({
        label: "Album Photo 50 pages Premium",
        quantity: 1,
        raw_currency_unit_price: String(prices?.album || 200),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }
    if (coffretUSB) {
      invoiceLines.push({
        label: "Coffret USB",
        quantity: 1,
        raw_currency_unit_price: String(prices?.coffret || 80),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }

    // Express delivery in Livrables
    if (delai === "express") {
      invoiceLines.push({
        label: "Livraison express (< 10 jours)",
        quantity: 1,
        raw_currency_unit_price: String(prices?.express || 200),
        unit: "piece",
        vat_rate: "FR_200",
        section_rank: 1,
      });
    }

    if (invoiceLines.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucune ligne de devis à créer" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Create customer ---
    const customerName = `${nom || ""} ${prenom || ""}`.trim();
    const customerBody: any = {
      name: customerName,
      billing_address: {
        address: adresse || "Non renseignée",
        postal_code: departement ? `${departement}000` : "00000",
        city: lieu || "Non renseignée",
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
      const searchResp = await fetch(
        `${PENNYLANE_BASE}/v2/company_customers?filter=${encodeURIComponent(JSON.stringify([{ field: "name", operator: "eq", value: customerName }]))}`,
        { method: "GET", headers }
      );
      const searchText = await searchResp.text();
      console.log("Customer search response:", searchResp.status, searchText);
      if (searchResp.ok) {
        const searchData = JSON.parse(searchText);
        const customers = searchData.customers || searchData.data || [];
        if (customers.length > 0) customerId = customers[0].id;
      }
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "Impossible de créer ou trouver le client dans Pennylane", details: customerText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Customer ID:", customerId);

    // --- Build free text for details ---
    const freeTextParts: string[] = [];
    freeTextParts.push(`N'hésitez pas à nous contacter pour toute question ou modification.`);
    if (remarques) freeTextParts.push(`\nVos remarques:\n${remarques}`);
    freeTextParts.push(`\nValidité du devis: 30 jours`);
    freeTextParts.push(`Conditions de paiement: 30% à la commande, solde 10 jours avant le début de la prestation.`);
    const sourceText = source === "autre" ? sourceAutre : source;
    if (sourceText) freeTextParts.push(`Source: ${sourceText}`);

    // --- Build special mention ---
    const specialMention = datePart ? `Date du mariage : ${datePart}` : "";

    // --- Build pdf_invoice_subject with event details ---
    const subjectParts = [sectionTitle, eventLine1, eventLine2].filter(Boolean);
    const pdfSubject = subjectParts.join("\n");

    // --- Deadline: 30 days from today ---
    const deadline = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

    // --- Create quote ---
    const quoteBody: any = {
      customer_id: customerId,
      date: new Date().toISOString().split("T")[0],
      deadline,
      currency: "EUR",
      invoice_lines: invoiceLines,
      special_mention: specialMention,
      pdf_invoice_free_text: freeTextParts.join("\n"),
      pdf_invoice_subject: pdfSubject,
    };

    console.log("Creating quote:", JSON.stringify(quoteBody, null, 2));

    const quoteResp = await fetch(`${PENNYLANE_BASE}/v2/quotes`, {
      method: "POST",
      headers,
      body: JSON.stringify(quoteBody),
    });

    const quoteText = await quoteResp.text();
    console.log("Quote response status:", quoteResp.status, quoteText);

    if (!quoteResp.ok) {
      return new Response(
        JSON.stringify({ error: "Erreur Pennylane lors de la création du devis", details: quoteText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const quoteData = JSON.parse(quoteText);
    const quoteId = quoteData.id;

    // Note: Section titles (e.g., "Photos et Vidéo", "Livrables") are managed
    // via the Pennylane quote template. The section_rank on lines groups them correctly.

    return new Response(JSON.stringify({ success: true, quote: quoteData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Pennylane quote:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

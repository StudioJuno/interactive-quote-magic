import { useEffect, useState } from "react";
import { QuoteData, PRICES } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  data: QuoteData;
}

function buildQuoteLines(data: QuoteData) {
  const lines: { label: string; quantity: number; unit_price: number }[] = [];
  if (data.nbPhotographes > 0) lines.push({ label: "Photographe", quantity: data.nbPhotographes, unit_price: PRICES.photographe });
  if (data.nbVideastes > 0) lines.push({ label: "Vidéaste", quantity: data.nbVideastes, unit_price: PRICES.vidéaste });
  if (data.optionDrone) lines.push({ label: "Prises de vues aériennes (drone)", quantity: 1, unit_price: PRICES.drone });
  if (data.optionInterviews) lines.push({ label: "Interviews / témoignages invités", quantity: 1, unit_price: PRICES.interviews });
  if (data.filmTeaser) lines.push({ label: 'Film "teaser"', quantity: 1, unit_price: PRICES.teaser });
  if (data.filmSignature) lines.push({ label: 'Film "signature"', quantity: 1, unit_price: PRICES.signature });
  if (data.filmReseaux) lines.push({ label: "Contenu réseaux sociaux express", quantity: 1, unit_price: PRICES.reseaux });
  if (data.filmBetisier) lines.push({ label: "Bêtisier", quantity: 1, unit_price: PRICES.betisier });
  if (data.albumPhoto) lines.push({ label: "Album Photo 50 pages Premium", quantity: 1, unit_price: PRICES.album });
  if (data.coffretUSB) lines.push({ label: "Coffret USB", quantity: 1, unit_price: PRICES.coffret });
  if (data.delai === "express") lines.push({ label: "Livraison express (< 10 jours)", quantity: 1, unit_price: PRICES.express });
  return lines;
}

type Status = "loading" | "success" | "error";

const StepGenerating = ({ data }: Props) => {
  const [status, setStatus] = useState<Status>("loading");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const submit = async () => {
      try {
        const lines = buildQuoteLines(data);
        const { data: result, error } = await supabase.functions.invoke("create-pennylane-quote", {
          body: {
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            telephone: data.telephone,
            adresse: data.lieu || "",
            dateMariage: data.dateHeure ? data.dateHeure.split("T")[0] : "",
            lines,
          },
        });
        if (error) { console.error("Edge function error:", error); toast.error("Erreur lors de la création du devis."); setStatus("error"); return; }
        if (result?.error) { console.error("Pennylane error:", result); toast.error(`Erreur : ${result.error}`); setStatus("error"); return; }
        setQuoteNumber(result?.quote?.quote_number || "");
        setPdfUrl(result?.quote?.public_file_url || "");
        setStatus("success");
        toast.success("Votre devis a été créé avec succès !");
      } catch (err) {
        console.error("Submit error:", err);
        toast.error("Une erreur est survenue.");
        setStatus("error");
      }
    };
    submit();
  }, []);

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <CheckCircle2 className="w-20 h-20 text-accent mb-6" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
          Devis créé avec succès !
        </h1>
        {quoteNumber && (
          <p className="text-center text-muted-foreground text-sm mb-4">
            Référence : <span className="font-semibold text-foreground">{quoteNumber}</span>
          </p>
        )}
        <p className="text-center text-muted-foreground text-sm mb-6">
          Vous recevrez votre devis par email sous peu.
        </p>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Télécharger le devis PDF
          </a>
        )}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-20 h-20 text-destructive mb-6" />
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
          Erreur lors de la génération
        </h1>
        <p className="text-center text-muted-foreground text-sm">
          Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="mb-8"
      >
        <Loader2 className="w-16 h-16 text-foreground" />
      </motion.div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Génération de votre devis en cours...
      </h1>
      <p className="text-center text-muted-foreground text-sm">
        Nous analysons vos besoins et calculons le prix optimal pour votre projet.
      </p>
    </div>
  );
};

export default StepGenerating;

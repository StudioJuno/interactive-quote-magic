import { useEffect } from "react";
import { QuoteData, PRICES } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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

const StepGenerating = ({ data }: Props) => {
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
            adresse: data.dateMariage,
            dateMariage: data.dateHeure ? data.dateHeure.split("T")[0] : "",
            lines,
          },
        });
        if (error) { console.error("Edge function error:", error); toast.error("Erreur lors de la création du devis."); return; }
        if (result?.error) { console.error("Pennylane error:", result); toast.error(`Erreur : ${result.error}`); return; }
        toast.success("Votre devis a été créé avec succès !");
      } catch (err) {
        console.error("Submit error:", err);
        toast.error("Une erreur est survenue.");
      }
    };
    submit();
  }, []);

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

import { useEffect, useState } from "react";
import { QuoteData, PRICES } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  data: QuoteData;
}

type Status = "loading" | "success" | "error";

const StepGenerating = ({ data }: Props) => {
  const [status, setStatus] = useState<Status>("loading");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const submit = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("create-pennylane-quote", {
          body: {
            // Contact
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            telephone: data.telephone,
            adresse: data.adresse || "",
            // Event details
            offerType: data.offerType,
            dateHeure: data.dateHeure,
            nbHeuresCouverture: data.nbHeuresCouverture,
            moments: data.moments,
            lieu: data.lieu,
            departement: data.departement,
            nbInvites: data.nbInvites,
            // Providers
            nbPhotographes: data.nbPhotographes,
            nbVideastes: data.nbVideastes,
            // Options
            optionDrone: data.optionDrone,
            optionInterviews: data.optionInterviews,
            // Films
            filmTeaser: data.filmTeaser,
            filmSignature: data.filmSignature,
            filmReseaux: data.filmReseaux,
            filmBetisier: data.filmBetisier,
            // Supports
            albumPhoto: data.albumPhoto,
            coffretUSB: data.coffretUSB,
            // Delivery
            delai: data.delai,
            // Other
            remarques: data.remarques,
            source: data.source,
            sourceAutre: data.sourceAutre,
            // Prices
            prices: PRICES,
          },
        });
        if (error) { console.error("Edge function error:", error); toast.error("Erreur lors de la création du devis."); setStatus("error"); return; }
        if (result?.error) { console.error("Pennylane error:", result); toast.error(`Erreur : ${result.error}`); setStatus("error"); return; }
        setQuoteNumber(result?.quote?.quote_number || result?.estimate?.quote_number || "");
        setPdfUrl(result?.quote?.public_file_url || result?.estimate?.public_file_url || "");
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

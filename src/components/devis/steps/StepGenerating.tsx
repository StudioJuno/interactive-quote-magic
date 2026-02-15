import { useEffect, useState } from "react";
import { QuoteData, PRICES } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, Sparkles, CalendarDays, CreditCard, FileDown } from "lucide-react";

interface Props {
  data: QuoteData;
  subtotal: number;
}

type Status = "loading" | "success" | "error";

// Confetti particle component
const ConfettiParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{
      left: `${x}%`,
      top: "40%",
      backgroundColor: `hsl(${Math.random() * 60 + 20}, 70%, 60%)`,
    }}
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{
      opacity: [1, 1, 0],
      y: [0, -80, 120],
      x: [(Math.random() - 0.5) * 100],
      scale: [1, 1.2, 0.5],
      rotate: [0, Math.random() * 360],
    }}
    transition={{ duration: 2, delay, ease: "easeOut" }}
  />
);

const StepGenerating = ({ data, subtotal }: Props) => {
  const [status, setStatus] = useState<Status>("loading");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const submit = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("create-pennylane-quote", {
          body: {
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            email2: data.email2,
            telephone: data.telephone,
            telephone2: data.telephone2,
            adresse: data.adresse || "",
            offerType: data.offerType,
            dateHeure: data.dateHeure,
            nbHeuresCouverture: data.nbHeuresCouverture,
            moments: data.moments,
            events: data.events,
            lieu: data.lieu,
            departement: data.departement,
            nbInvites: data.nbInvites,
            nbPhotographes: data.nbPhotographes,
            nbVideastes: data.nbVideastes,
            optionDrone: data.optionDrone,
            optionInterviews: data.optionInterviews,
            optionDiscours: data.optionDiscours,
            filmTeaser: data.filmTeaser,
            filmSignature: data.filmSignature,
            filmReseaux: data.filmReseaux,
            filmBetisier: data.filmBetisier,
            albumPhoto: data.albumPhoto,
            coffretUSB: data.coffretUSB,
            delai: data.delai,
            remarques: data.remarques,
            source: data.source,
            sourceAutre: data.sourceAutre,
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

  const deposit = Math.round(subtotal * 0.3);

  const handlePayDeposit = () => {
    // Opens Stripe payment link for 30% deposit - for now redirect to contact
    window.open(`https://calendly.com/studio-juno/30min`, "_blank");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 relative overflow-hidden">
        {/* Confetti */}
        {Array.from({ length: 20 }).map((_, i) => (
          <ConfettiParticle key={i} delay={i * 0.08} x={Math.random() * 100} />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="relative">
            <CheckCircle2 className="w-16 h-16 text-accent" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            >
              <Sparkles className="w-5 h-5 text-accent" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-xl sm:text-2xl font-heading font-bold text-center mb-2 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Devis créé avec succès !
        </motion.h1>

        {quoteNumber && (
          <motion.p
            className="text-center text-muted-foreground text-sm mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Référence : <span className="font-semibold text-foreground">{quoteNumber}</span>
          </motion.p>
        )}

        <motion.p
          className="text-center text-muted-foreground text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Vous recevrez votre devis par email sous peu.
        </motion.p>

        {/* Conversion modules */}
        <motion.div
          className="w-full max-w-md space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Download PDF */}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full p-4 rounded-xl border border-border bg-card hover:border-accent/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <FileDown className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">Télécharger le devis PDF</p>
                <p className="text-xs text-muted-foreground">Consultez votre devis détaillé</p>
              </div>
            </a>
          )}

          {/* Book a call */}
          <a
            href="https://calendly.com/studio-juno/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full p-4 rounded-xl border border-border bg-card hover:border-accent/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Réserver un appel</p>
              <p className="text-xs text-muted-foreground">Discutons de votre projet en 30 min</p>
            </div>
          </a>

          {/* Pay deposit */}
          <button
            onClick={handlePayDeposit}
            className="flex items-center gap-4 w-full p-4 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Réserver ma date</p>
              <p className="text-xs text-muted-foreground">
                Acompte de 30 % — {deposit.toLocaleString("fr-FR")} €
              </p>
            </div>
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <XCircle className="w-20 h-20 text-destructive mb-6" />
        </motion.div>
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
        <Loader2 className="w-16 h-16 text-accent" />
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

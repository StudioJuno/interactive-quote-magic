import { useState } from "react";
import { QuoteData, PRICES } from "../types";
import { toast } from "sonner";
import { MapPin, Loader2, Mail, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onPrev: () => void;
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

const StepContact = ({ data, onChange, onPrev }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!data.nom || !data.email) {
      toast.error("Veuillez remplir au moins le nom et l'email.");
      return;
    }
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Vos coordonnées
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Pour recevoir votre devis et réserver
      </p>

      <div className="max-w-xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={data.prenom}
              onChange={(e) => onChange({ prenom: e.target.value })}
              placeholder="Nom & prénom de la mariée"
              className="wizard-input pl-10"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={data.nom}
              onChange={(e) => onChange({ nom: e.target.value })}
              placeholder="Nom & prénom du marié"
              className="wizard-input pl-10"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              value={data.telephone}
              onChange={(e) => onChange({ telephone: e.target.value })}
              placeholder="Téléphone"
              className="wizard-input pl-10"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="Email"
              className="wizard-input pl-10"
            />
          </div>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={data.dateMariage}
            onChange={(e) => onChange({ dateMariage: e.target.value })}
            placeholder="Adresse"
            className="wizard-input pl-10"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-10">
        <motion.button
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-accent text-accent-foreground font-body font-medium text-sm rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-shadow disabled:opacity-50 flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Envoi en cours..." : "Envoyer le devis"}
        </motion.button>
      </div>
    </div>
  );
};

export default StepContact;

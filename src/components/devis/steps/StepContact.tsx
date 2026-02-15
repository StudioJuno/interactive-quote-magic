import { useState } from "react";
import { QuoteData, PRICES } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onPrev: () => void;
}

function buildQuoteLines(data: QuoteData) {
  const lines: { label: string; quantity: number; unit_price: number }[] = [];

  if (data.nbPhotographes > 0) {
    lines.push({ label: "Photographe", quantity: data.nbPhotographes, unit_price: PRICES.photographe });
  }
  if (data.nbVideastes > 0) {
    lines.push({ label: "Vidéaste", quantity: data.nbVideastes, unit_price: PRICES.vidéaste });
  }
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
          adresse: data.dateMariage, // dateMariage field is used as address
          dateMariage: data.dateHeure ? data.dateHeure.split("T")[0] : "",
          lines,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Erreur lors de la création du devis. Veuillez réessayer.");
        return;
      }

      if (result?.error) {
        console.error("Pennylane error:", result);
        toast.error(`Erreur Pennylane : ${result.error}`);
        return;
      }

      toast.success("Votre devis a été créé avec succès dans Pennylane !");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-10">
        Vos coordonnees pour recevoir le devis et réserver
      </h1>

      <div className="max-w-xl mx-auto space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={data.prenom}
            onChange={(e) => onChange({ prenom: e.target.value })}
            placeholder="Nom & prénom de la mariée"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <input
            type="text"
            value={data.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
            placeholder="Nom & prénom du marié"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="tel"
            value={data.telephone}
            onChange={(e) => onChange({ telephone: e.target.value })}
            placeholder="Téléphone"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Email"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={data.dateMariage}
            onChange={(e) => onChange({ dateMariage: e.target.value })}
            placeholder="Adresse"
            className="w-full pl-10 pr-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-10">
        <button
          onClick={onPrev}
          className="w-12 h-12 border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-foreground text-background font-body font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Envoi en cours..." : "Envoyer le devis"}
        </button>
      </div>
    </div>
  );
};

export default StepContact;

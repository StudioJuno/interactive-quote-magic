import { QuoteData } from "../types";
import { toast } from "sonner";
import { MapPin, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const StepContact = ({ data, onChange, onPrev, onNext }: Props) => {
  const handleNext = () => {
    if (!data.nom || !data.email) {
      toast.error("Veuillez remplir au moins le nom et l'email.");
      return;
    }
    onNext();
  };

  useWizardKeyboard({ onPrev });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        Vos coordonnées
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Pour recevoir votre devis et réserver
      </p>

      <div className="max-w-xl mx-auto space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="step-label">Mariée</label>
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
          </div>
          <div>
            <label className="step-label">Marié</label>
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="step-label">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={data.telephone}
                onChange={(e) => onChange({ telephone: e.target.value })}
                placeholder="06 00 00 00 00"
                className="wizard-input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="step-label">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="votre@email.com"
                className="wizard-input pl-10"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="step-label">Adresse (optionnel)</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={data.adresse}
              onChange={(e) => onChange({ adresse: e.target.value })}
              placeholder="Adresse de facturation"
              className="wizard-input pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-10">
        <motion.button
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-accent/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="px-8 py-3 bg-accent text-accent-foreground font-body font-medium text-sm rounded-full shadow-lg shadow-accent/25 hover:shadow-accent/35 hover:brightness-110 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Envoyer le devis ✨
        </motion.button>
      </div>
    </div>
  );
};

export default StepContact;

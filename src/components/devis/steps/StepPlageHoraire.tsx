import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MOMENTS = [
  "Séance pré-engagement",
  "Préparatifs",
  "Cérémonie civile",
  "Cérémonie religieuse/laïque",
  "Cocktail / vin d'honneur",
  "Soirée",
  "Mairie",
  "Brunch lendemain",
  "Autre",
];

const StepPlageHoraire = ({ data, onChange, onNext, onPrev }: Props) => {
  const toggleMoment = (moment: string) => {
    const current = data.moments;
    const updated = current.includes(moment)
      ? current.filter((m) => m !== moment)
      : [...current, moment];
    onChange({ moments: updated });
  };

  const handleNext = () => {
    if (data.moments.length === 0) {
      toast.error("Veuillez sélectionner au moins un moment.");
      return;
    }
    onNext();
  };

  useWizardKeyboard({ onNext: handleNext, onPrev });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        Moments à capturer
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Quels moments souhaitez-vous couvrir ?
      </p>

      <div className="max-w-md mx-auto">
        <div className="flex flex-wrap gap-2">
          {MOMENTS.map((m, i) => (
            <motion.button
              key={m}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => toggleMoment(m)}
              className={`tag-button ${data.moments.includes(m) ? "selected" : ""}`}
            >
              {m}
            </motion.button>
          ))}
        </div>

        {data.moments.length >= 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-accent font-medium mt-4 bg-accent/5 border border-accent/15 px-3 py-2.5 rounded-xl"
          >
            Vous pourrez définir une date et un lieu pour chaque moment à l'étape suivante.
          </motion.p>
        )}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
};

export default StepPlageHoraire;

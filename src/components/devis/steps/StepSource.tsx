import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SOURCES = [
  "Instagram",
  "Facebook",
  "Google",
  "Recommandation - Qui ?",
  "Mariages.net",
  "Autre - Champs libre",
];

const StepSource = ({ data, onChange, onNext, onPrev }: Props) => {
  const handleNext = () => {
    if (!data.source) { toast.error("Veuillez sélectionner une option."); return; }
    onNext();
  };

  // Auto-advance only for simple sources (not those that need follow-up input)
  const needsInput = data.source === "Recommandation - Qui ?" || data.source === "Autre - Champs libre";
  useAutoAdvance(data.source, handleNext, { enabled: !needsInput });
  useWizardKeyboard({ onNext: handleNext, onPrev });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        Comment avez-vous connu Juno ?
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Aidez-nous à mieux vous connaître
      </p>

      <div className="grid gap-3 max-w-md mx-auto">
        {SOURCES.map((src, i) => {
          const selected = data.source === src;
          return (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onChange({ source: src })}
              className={`option-card flex items-center gap-4 ${selected ? 'selected' : ''}`}
            >
              <div className="option-radio">
                {selected && (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-accent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </div>
              <span className="font-body font-medium text-sm">{src}</span>
            </motion.div>
          );
        })}
      </div>

      {needsInput && (
        <motion.div
          className="mt-6 max-w-md mx-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <input
            type="text"
            value={data.sourceAutre}
            onChange={(e) => onChange({ sourceAutre: e.target.value })}
            placeholder={data.source === "Recommandation - Qui ?" ? "Qui vous a recommandé ?" : "Précisez..."}
            className="wizard-input"
            autoFocus
          />
        </motion.div>
      )}

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
};

export default StepSource;

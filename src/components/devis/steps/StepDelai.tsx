import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepDelai = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    { value: "standard" as const, label: "Standard", desc: "4 semaines incluses", icon: Clock },
    { value: "express" as const, label: "Express", desc: "Moins de 10 jours — +200 €", icon: Zap },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Délai de livraison
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Sous combien de temps souhaitez-vous recevoir vos photos/vidéos ?
      </p>

      <div className="grid gap-3 max-w-md mx-auto">
        {options.map((opt, i) => {
          const selected = data.delai === opt.value;
          const Icon = opt.icon;
          return (
            <motion.div
              key={opt.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onChange({ delai: opt.value })}
              className={`option-card flex items-center gap-4 ${selected ? 'selected' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                selected ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-body font-medium text-base">{opt.label}</span>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
              <div className="option-radio">
                {selected && (
                  <motion.div className="w-2.5 h-2.5 rounded-full bg-accent" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={() => {
        if (!data.delai) { toast.error("Veuillez sélectionner un délai."); return; }
        onNext();
      }} />
    </div>
  );
};

export default StepDelai;

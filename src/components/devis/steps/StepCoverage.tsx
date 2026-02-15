import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Calendar, CalendarDays } from "lucide-react";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepCoverage = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    { value: "jour-j" as const, label: "Uniquement le jour J", desc: "Couverture complète le jour du mariage", icon: Calendar },
    { value: "autres-moments" as const, label: "Couvrir d'autres moments", desc: "Mairie, brunch du lendemain, etc.", icon: CalendarDays },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Que souhaitez-vous couvrir ?
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Définissez l'étendue de votre couverture
      </p>

      <div className="grid gap-3 max-w-md mx-auto">
        {options.map((opt, i) => {
          const selected = data.coverageType === opt.value;
          const Icon = opt.icon;
          return (
            <motion.div
              key={opt.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onChange({ coverageType: opt.value })}
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

      {data.coverageType === "autres-moments" && (
        <motion.div
          className="mt-8 max-w-md mx-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <p className="font-body text-sm mb-3 text-muted-foreground">Combien de jours au total ?</p>
          <div className="flex gap-3">
            {[2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ nbJours: n })}
                className={`tag-button flex-1 ${data.nbJours === n ? 'selected' : ''}`}
              >
                {n} jours
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <NavigationButtons onPrev={onPrev} onNext={() => {
        if (!data.coverageType) { toast.error("Veuillez sélectionner une option."); return; }
        onNext();
      }} />
    </div>
  );
};

export default StepCoverage;

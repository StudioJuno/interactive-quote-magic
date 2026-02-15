import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { motion } from "framer-motion";
import { Plane, Mic, Speech } from "lucide-react";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepOptionsSupp = ({ data, onChange, onNext, onPrev }: Props) => {
  useWizardKeyboard({ onNext, onPrev });

  const options = [
    {
      key: "optionDrone" as const,
      label: "Prises de vues aériennes (drone)",
      price: "150 €",
      desc: "⚠️ Sous réserve d'autorisations et météo",
      icon: Plane,
    },
    {
      key: "optionDiscours" as const,
      label: "Discours",
      price: "100 €",
      desc: "Captation complète des échanges de vœux et discours. Remise d'un film + d'un fichier sonore",
      icon: Speech,
    },
    {
      key: "optionInterviews" as const,
      label: "Interviews / témoignages",
      price: "100 €",
      desc: "Interview des mariés et des invités. Remise d'un film + d'un fichier sonore",
      icon: Mic,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        Options supplémentaires
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Enrichissez votre prestation
      </p>

      <div className="space-y-3 max-w-lg mx-auto">
        {options.map((opt, i) => {
          const checked = data[opt.key];
          const Icon = opt.icon;
          return (
            <motion.div
              key={opt.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`option-card flex items-center gap-4 ${checked ? 'selected' : ''}`}
              onClick={() => onChange({ [opt.key]: !data[opt.key] })}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                checked ? 'bg-accent text-accent-foreground scale-110' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-body font-medium text-sm">{opt.label}</span>
                  <span className="text-xs font-semibold text-accent">{opt.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
              </div>
              <div className="option-checkbox">
                {checked && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepOptionsSupp;

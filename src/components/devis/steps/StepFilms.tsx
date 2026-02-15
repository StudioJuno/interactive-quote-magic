import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { motion } from "framer-motion";
import { Clapperboard, Film, Share2, PartyPopper } from "lucide-react";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepFilms = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    { key: "filmTeaser" as const, label: 'Film "teaser"', price: "200 €", desc: "1 min intense — horizontal + vertical", icon: Film },
    { key: "filmSignature" as const, label: 'Film "signature"', price: "250 €", desc: "3 à 5 min — le format phare", icon: Clapperboard },
    { key: "filmReseaux" as const, label: "Réseaux sociaux express", price: "200 €", desc: "3 reels + 15 photos en < 7 jours", icon: Share2 },
    { key: "filmBetisier" as const, label: "Bêtisier", price: "80 €", desc: "Les moments drôles et décalés", icon: PartyPopper },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Vos films
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-2">
        Le film long (~15 min) est toujours inclus
      </p>
      <p className="text-center text-muted-foreground text-xs mb-8">
        Ajoutez en option :
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
              transition={{ delay: i * 0.06 }}
              className={`option-card flex items-center gap-4 ${checked ? 'selected' : ''}`}
              onClick={() => onChange({ [opt.key]: !data[opt.key] })}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                checked ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-body font-medium text-sm">{opt.label}</span>
                  <span className="text-xs font-semibold text-accent">{opt.price}</span>
                </div>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
              <div className="option-checkbox">
                {checked && (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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

export default StepFilms;

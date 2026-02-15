import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { motion } from "framer-motion";
import { BookOpen, Usb } from "lucide-react";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepSupports = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    { key: "albumPhoto" as const, label: "Album Photo 50 pages Premium", price: "200 €", desc: "Un souvenir intemporel et personnalisé", icon: BookOpen },
    { key: "coffretUSB" as const, label: "Coffret USB", price: "80 €", desc: "Écrin raffiné avec clé USB haut de gamme", icon: Usb },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Supports souvenirs
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Vos photos sont livrées via une galerie privée élégante
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

      <p className="text-xs text-accent italic text-center mt-6 max-w-lg mx-auto">
        L'album et le coffret seront paramétrables dès la livraison
      </p>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepSupports;

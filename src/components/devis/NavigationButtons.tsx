import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  isSubmit?: boolean;
  nextLabel?: string;
}

const NavigationButtons = ({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  isSubmit = false,
  nextLabel = "Continuer",
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      {showPrev && (
        <motion.button
          type="button"
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-accent/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Précédent (Échap)"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}
      {showNext && (
        <motion.button
          type={isSubmit ? "submit" : "button"}
          onClick={isSubmit ? undefined : onNext}
          className="h-12 px-8 rounded-full bg-accent text-accent-foreground font-body font-medium text-sm flex items-center gap-2 shadow-lg shadow-accent/25 hover:shadow-accent/35 hover:brightness-110 transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          title="Continuer (Entrée)"
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default NavigationButtons;

import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  isSubmit?: boolean;
}

const NavigationButtons = ({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  isSubmit = false,
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {showPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {showNext && (
        <button
          type={isSubmit ? "submit" : "button"}
          onClick={isSubmit ? undefined : onNext}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;

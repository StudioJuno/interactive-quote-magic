import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { MessageSquare } from "lucide-react";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepRemarques = ({ data, onChange, onNext, onPrev }: Props) => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Remarques
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Des préférences pour le rendu de vos films ou photos ?
      </p>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-muted-foreground" />
          <textarea
            value={data.remarques}
            onChange={(e) => onChange({ remarques: e.target.value })}
            placeholder="Ex : Style cinématographique, couleurs chaudes..."
            rows={5}
            className="wizard-input pl-10 resize-y"
          />
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepRemarques;

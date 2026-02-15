import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepRemarques = ({ data, onChange, onNext, onPrev }: Props) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
        Des remarques quant au rendu pour votre film/photos ?
      </h1>

      <div className="max-w-md mx-auto">
        <textarea
          value={data.remarques}
          onChange={(e) => onChange({ remarques: e.target.value })}
          placeholder="Ex: Remarques sur le rendu final"
          rows={5}
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm resize-y focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepRemarques;

import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepInvites = ({ data, onChange, onNext, onPrev }: Props) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
        Combien d'invités prévoyez-vous ?
      </h1>

      <div className="max-w-md mx-auto">
        <input
          type="number"
          value={data.nbInvites}
          onChange={(e) => onChange({ nbInvites: e.target.value })}
          placeholder="Ex: 100"
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepInvites;

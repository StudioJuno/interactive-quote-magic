import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { Users } from "lucide-react";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepInvites = ({ data, onChange, onNext, onPrev }: Props) => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Vos invités
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Combien d'invités prévoyez-vous ?
      </p>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="number"
            value={data.nbInvites}
            onChange={(e) => onChange({ nbInvites: e.target.value })}
            placeholder="Ex : 100"
            className="wizard-input pl-10"
          />
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepInvites;

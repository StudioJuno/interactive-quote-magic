import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepLieu = ({ data, onChange, onNext, onPrev }: Props) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-8">
        Quel est le lieu de votre mariage ?
      </h1>

      <div className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          value={data.lieu}
          onChange={(e) => onChange({ lieu: e.target.value })}
          placeholder="Ex: Église Saint-Pierre"
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        />
        <p className="text-sm text-summary-accent italic">
          Si votre lieu n'est pas encore défini, indiquez simplement le département prévu pour votre mariage — les frais de déplacement sont toujours offerts.
        </p>
        <input
          type="number"
          value={data.departement}
          onChange={(e) => onChange({ departement: e.target.value })}
          placeholder="75"
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepLieu;

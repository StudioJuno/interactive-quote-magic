import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepLieu = ({ data, onChange, onNext, onPrev }: Props) => {
  const handleNext = () => {
    if (!data.departement.trim()) { toast.error("Veuillez renseigner au moins le département."); return; }
    onNext();
  };

  useWizardKeyboard({ onNext: handleNext, onPrev });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        Lieu du mariage
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Indiquez le lieu ou au minimum le département
      </p>

      <div className="max-w-md mx-auto space-y-5">
        <div>
          <label className="step-label">Nom du lieu (optionnel)</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={data.lieu}
              onChange={(e) => onChange({ lieu: e.target.value })}
              placeholder="Ex : Château de Versailles"
              className="wizard-input pl-10"
            />
          </div>
        </div>
        <p className="text-xs text-accent italic font-medium">
          Les frais de déplacement sont toujours offerts ✨
        </p>
        <div>
          <label className="step-label">Département *</label>
          <input
            type="text"
            value={data.departement}
            onChange={(e) => onChange({ departement: e.target.value })}
            placeholder="Ex : 75"
            className="wizard-input"
          />
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
};

export default StepLieu;

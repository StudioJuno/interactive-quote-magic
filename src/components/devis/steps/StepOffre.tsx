import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
}

const StepOffre = ({ data, onChange, onNext }: Props) => {
  const options = [
    { value: "film" as const, label: "Film uniquement" },
    { value: "photos" as const, label: "Photos uniquement" },
    { value: "photos-film" as const, label: "Photos et Film" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
        Que souhaitez-vous ?
      </h1>

      <div className="space-y-3 max-w-md mx-auto">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onChange({ offerType: opt.value })}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                data.offerType === opt.value
                  ? "border-foreground"
                  : "border-muted-foreground"
              }`}
            >
              {data.offerType === opt.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
              )}
            </div>
            <span className="font-body text-base">{opt.label}</span>
          </label>
        ))}
      </div>

      <NavigationButtons showPrev={false} onNext={onNext} />
    </div>
  );
};

export default StepOffre;

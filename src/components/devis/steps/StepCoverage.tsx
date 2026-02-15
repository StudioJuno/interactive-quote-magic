import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepCoverage = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    { value: "jour-j" as const, label: "Uniquement le jour J", desc: "" },
    {
      value: "autres-moments" as const,
      label: "Également couvrir d'autres moments",
      desc: "mairie, brunch du lendemain, etc.",
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
        Que souhaitez-vous couvrir ?
      </h1>

      <div className="space-y-4 max-w-md mx-auto">
        {options.map((opt) => (
          <div
            key={opt.value}
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => onChange({ coverageType: opt.value })}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                data.coverageType === opt.value
                  ? "border-foreground"
                  : "border-muted-foreground"
              }`}
            >
              {data.coverageType === opt.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
              )}
            </div>
            <div>
              <span className="font-body text-base">{opt.label}</span>
              {opt.desc && (
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.coverageType === "autres-moments" && (
        <div className="mt-8 max-w-md mx-auto">
          <p className="font-body text-base mb-3">Combien de jours au total ?</p>
          <div className="flex gap-3">
            {[2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ nbJours: n })}
                className={`px-5 py-2 border text-sm font-body transition-all ${
                  data.nbJours === n
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {n} jours
              </button>
            ))}
          </div>
        </div>
      )}

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepCoverage;

import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepDelai = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    { value: "standard" as const, label: "Standard (4 semaines inclus)", desc: "" },
    { value: "express" as const, label: "Express (moins de 10 jours)", desc: "200 euros supplémentaires" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
        Sous combien de temps souhaitez-vous recevoir vos photos/vidéos ?
      </h1>

      <div className="space-y-4 max-w-md mx-auto">
        {options.map((opt) => (
          <div key={opt.value} className="flex items-start gap-3 cursor-pointer" onClick={() => onChange({ delai: opt.value })}>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                data.delai === opt.value ? "border-foreground" : "border-muted-foreground"
              }`}
            >
              {data.delai === opt.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
              )}
            </div>
            <div>
              <span className="font-body text-base">{opt.label}</span>
              {opt.desc && <p className="text-sm text-muted-foreground">{opt.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepDelai;

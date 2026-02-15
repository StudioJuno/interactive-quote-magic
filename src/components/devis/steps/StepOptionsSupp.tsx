import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepOptionsSupp = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    {
      key: "optionDrone" as const,
      label: "Prises de vues aériennes (drone) - 150 €",
      desc: "Des images aériennes pour sublimer votre mariage. ⚠️ Sous réserve d'autorisations et météo. En cas d'impossibilité, remboursement garanti.",
    },
    {
      key: "optionInterviews" as const,
      label: "Interviews ou témoignages des invités - 100 €",
      desc: "Captation du son - micros cravates",
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
        Souhaitez-vous des options supplémentaires spécifiques ?
      </h1>

      <div className="space-y-5 max-w-lg mx-auto">
        {options.map((opt) => (
          <label key={opt.key} className="flex items-start gap-3 cursor-pointer" onClick={() => onChange({ [opt.key]: !data[opt.key] })}>
            <div
              className={`w-5 h-5 border-2 flex items-center justify-center mt-0.5 transition-all ${
                data[opt.key] ? "border-foreground bg-foreground" : "border-muted-foreground"
              }`}
            >
              {data[opt.key] && (
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <span className="font-body font-medium text-base">{opt.label}</span>
              <p className="text-sm text-muted-foreground">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepOptionsSupp;

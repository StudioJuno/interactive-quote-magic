import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepSupports = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    {
      key: "albumPhoto" as const,
      label: "Album Photo 50 pages Premium - 200 €",
      desc: "Un souvenir intemporel et personnalisé. Vous choisissez vos photos et la mise en page, ou laissez notre équipe créer un album harmonieux, clé en main. Chaque détail est pensé pour un livre unique.",
    },
    {
      key: "coffretUSB" as const,
      label: "Coffret USB - 80 €",
      desc: "Un écrin raffiné pour vos souvenirs. Films et photos remis sur une clé USB haut de gamme, présentée dans un coffret personnalisé.",
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-4">
        Souhaitez-vous des supports pour vos souvenirs ?
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Vos photos sont livrées via une galerie privée élégante et un lien téléchargeable
      </p>

      <div className="space-y-5 max-w-lg mx-auto">
        {options.map((opt) => (
          <div key={opt.key} className="flex items-start gap-3 cursor-pointer" onClick={() => onChange({ [opt.key]: !data[opt.key] })}>
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
          </div>
        ))}
      </div>

      <p className="text-sm text-summary-accent italic text-center mt-6 max-w-lg mx-auto">
        L'album photo et le coffret USB seront entièrement paramétrables dès la livraison de vos photos et films.
      </p>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepSupports;

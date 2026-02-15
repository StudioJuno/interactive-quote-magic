import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepFilms = ({ data, onChange, onNext, onPrev }: Props) => {
  const options = [
    {
      key: "filmTeaser" as const,
      label: 'Film "teaser" - 200 €',
      desc: "1 min : une minute intense qui concentre vos plus beaux instants. Livré en format horizontal + vertical",
    },
    {
      key: "filmSignature" as const,
      label: 'Film "signature" - 250 €',
      desc: "3 à 5min : le format phare, équilibre parfait entre émotion et récit",
    },
    {
      key: "filmReseaux" as const,
      label: "Contenu réseaux sociaux express – 200 €",
      desc: "En moins de 7 jours : 3 reels de 15 s (vertical, prêts Insta/TikTok) + 15 photos verticales retouchées. Le concentré de votre mariage, prêt à partager.",
    },
    {
      key: "filmBetisier" as const,
      label: "Bêtisier – 80 €",
      desc: 'Un montage bonus qui regroupe tous les moments drôles, décalés ou "off" qu\'on n\'a pas pu mettre dans le film principal. À regarder sans modération !',
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-4">
        Quel(s) film(s) souhaitez-vous recevoir ?
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-2">
        Le film long (environ 15 minutes) est toujours inclus dans toutes nos prestations vidéo.
      </p>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Vous pouvez ajouter en option :
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

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepFilms;

import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const photographeOptions = [
  { value: 0, label: "Aucun photographe", desc: "Je n'ai pas besoin de photographe pour cette journée" },
  { value: 1, label: "1 photographe", desc: "Économique" },
  { value: 2, label: "2 photographes", desc: "Deux regards complémentaires. Plus d'angles, plus de portraits, plus de photos pour raconter votre histoire en détail." },
  { value: 3, label: "3 photographes", desc: "Idéal pour les grands mariages. Chaque instant est couvert : mariés, invités, ambiance et décor." },
];

const videasteOptions = [
  { value: 0, label: "Aucun vidéaste", desc: "Je n'ai pas besoin de vidéaste pour cette journée" },
  { value: 1, label: "1 vidéaste", desc: "Économique" },
  { value: 2, label: "2 vidéastes", desc: "Deux caméras, deux visions. Un film plus riche, dynamique et cinématographique." },
  { value: 3, label: "3 vidéastes", desc: "L'expérience grand spectacle. Trois caméras pour un rendu immersif et complet, digne d'un film de cinéma." },
];

const StepPrestataires = ({ data, onChange, onNext, onPrev }: Props) => {
  const showPhotographes = data.offerType === "photos" || data.offerType === "photos-film";
  const showVideastes = data.offerType === "film" || data.offerType === "photos-film";

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-8">
        De combien de prestataires avez-vous besoin ?
      </h1>

      <div className="max-w-lg mx-auto space-y-3">
        {showPhotographes &&
          photographeOptions.map((opt) => (
            <label key={`photo-${opt.value}`} className="flex items-start gap-3 cursor-pointer" onClick={() => onChange({ nbPhotographes: opt.value })}>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                  data.nbPhotographes === opt.value ? "border-foreground" : "border-muted-foreground"
                }`}
              >
                {data.nbPhotographes === opt.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                )}
              </div>
              <div>
                <span className="font-body font-medium text-base">{opt.label}</span>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </div>
            </label>
          ))}

        {showPhotographes && showVideastes && <div className="pt-4" />}

        {showVideastes &&
          videasteOptions.map((opt) => (
            <label key={`video-${opt.value}`} className="flex items-start gap-3 cursor-pointer" onClick={() => onChange({ nbVideastes: opt.value })}>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                  data.nbVideastes === opt.value ? "border-foreground" : "border-muted-foreground"
                }`}
              >
                {data.nbVideastes === opt.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
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

export default StepPrestataires;

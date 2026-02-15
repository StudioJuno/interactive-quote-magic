import { useMemo } from "react";
import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MOMENTS = [
  "Séance pré-engagement",
  "Préparatifs",
  "Cérémonie civile",
  "Cérémonie religieuse/laïque",
  "Cocktail / vin d'honneur",
  "Soirée",
  "Mairie",
  "Brunch lendemain",
  "Autre (champ libre)",
];

const StepPlageHoraire = ({ data, onChange, onNext, onPrev }: Props) => {
  const toggleMoment = (moment: string) => {
    const current = data.moments;
    const updated = current.includes(moment)
      ? current.filter((m) => m !== moment)
      : [...current, moment];
    onChange({ moments: updated });
  };

  const plageText = useMemo(() => {
    if (!data.dateHeure || !data.nbHeuresCouverture) return null;
    try {
      const start = new Date(data.dateHeure);
      const end = new Date(start.getTime() + data.nbHeuresCouverture * 60 * 60 * 1000);
      const fmt = (d: Date) =>
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      return `📅 Prestation de ${fmt(start)} à ${fmt(end)}`;
    } catch {
      return null;
    }
  }, [data.dateHeure, data.nbHeuresCouverture]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-10">
        Sur quelle plage souhaitez vous couvrir votre mariage ?
      </h1>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Date & heure */}
        <input
          type="datetime-local"
          value={data.dateHeure}
          onChange={(e) => onChange({ dateHeure: e.target.value })}
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm text-center focus:outline-none focus:ring-1 focus:ring-foreground"
        />

        {/* Nombre d'heures */}
        <div>
          <label className="font-body text-sm mb-1 block">
            Nombre d'heure de couvertures
          </label>
          <input
            type="number"
            min={1}
            max={24}
            value={data.nbHeuresCouverture}
            onChange={(e) =>
              onChange({ nbHeuresCouverture: parseInt(e.target.value) || 1 })
            }
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <p className="text-sm text-summary-accent italic mt-2">
            Chaque heure couverte par un photographe inclus 50 photos retouchées
            en haute définition
          </p>
          {plageText && (
            <p className="text-sm text-muted-foreground mt-1">{plageText}</p>
          )}
        </div>

        {/* Moments */}
        <div>
          <p className="font-body text-sm mb-3">
            Quels moments souhaitez-vous capturer ?
          </p>
          <div className="flex flex-wrap gap-3">
            {MOMENTS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMoment(m)}
                className={`px-4 py-2 border text-sm font-body transition-all ${
                  data.moments.includes(m)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2 italic">
            Sélectionner une ou plusieurs options
          </p>
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepPlageHoraire;

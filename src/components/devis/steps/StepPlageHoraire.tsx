import { useMemo } from "react";
import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

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
  "Autre",
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
      return `Prestation de ${fmt(start)} à ${fmt(end)}`;
    } catch {
      return null;
    }
  }, [data.dateHeure, data.nbHeuresCouverture]);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-3">
        Votre plage horaire
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Quand souhaitez-vous couvrir votre mariage ?
      </p>

      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Date et heure de début
          </label>
          <input
            type="datetime-local"
            value={data.dateHeure}
            onChange={(e) => onChange({ dateHeure: e.target.value })}
            className="wizard-input"
          />
        </div>

        <div>
          <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Nombre d'heures de couverture
          </label>
          <input
            type="number"
            min={1}
            max={24}
            value={data.nbHeuresCouverture}
            onChange={(e) => onChange({ nbHeuresCouverture: parseInt(e.target.value) || 1 })}
            className="wizard-input"
          />
          <p className="text-xs text-accent italic mt-2">
            Chaque heure couverte par un photographe inclut 50 photos retouchées HD
          </p>
          {plageText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mt-2 bg-muted/50 px-3 py-2 rounded-lg"
            >
              <Clock className="w-4 h-4" />
              {plageText}
            </motion.div>
          )}
        </div>

        <div>
          <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
            Moments à capturer
          </label>
          <div className="flex flex-wrap gap-2">
            {MOMENTS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMoment(m)}
                className={`tag-button ${data.moments.includes(m) ? 'selected' : ''}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={() => {
        if (!data.dateHeure) { toast.error("Veuillez renseigner la date et l'heure."); return; }
        onNext();
      }} />
    </div>
  );
};

export default StepPlageHoraire;

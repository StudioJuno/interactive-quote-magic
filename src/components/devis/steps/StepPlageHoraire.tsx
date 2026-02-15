import { useMemo } from "react";
import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";

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

const HOURS: string[] = [];
for (let h = 6; h <= 23; h++) {
  HOURS.push(`${String(h).padStart(2, "0")}:00`);
  HOURS.push(`${String(h).padStart(2, "0")}:30`);
}
HOURS.push("00:00");

const StepPlageHoraire = ({ data, onChange, onNext, onPrev }: Props) => {
  const toggleMoment = (moment: string) => {
    const current = data.moments;
    const updated = current.includes(moment)
      ? current.filter((m) => m !== moment)
      : [...current, moment];
    onChange({ moments: updated });
  };

  // Split dateHeure into date and time parts
  const datePart = data.dateHeure ? data.dateHeure.split("T")[0] : "";
  const timePart = data.dateHeure ? data.dateHeure.split("T")[1]?.substring(0, 5) || "" : "";

  const updateDate = (date: string) => {
    const time = timePart || "14:00";
    onChange({ dateHeure: `${date}T${time}` });
  };

  const updateTime = (time: string) => {
    const date = datePart || new Date().toISOString().split("T")[0];
    onChange({ dateHeure: `${date}T${time}` });
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
        {/* Date */}
        <div>
          <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Date du mariage
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={datePart}
              onChange={(e) => updateDate(e.target.value)}
              className="wizard-input pl-10"
            />
          </div>
        </div>

        {/* Heure de début */}
        <div>
          <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Heure de début
          </label>
          <div className="flex flex-wrap gap-2">
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => updateTime(h)}
                className={`tag-button min-w-[70px] ${timePart === h ? "selected" : ""}`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Nombre d'heures */}
        <div>
          <label className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Nombre d'heures de couverture
          </label>
          <div className="flex flex-wrap gap-2">
            {[4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ nbHeuresCouverture: n })}
                className={`tag-button min-w-[55px] ${data.nbHeuresCouverture === n ? "selected" : ""}`}
              >
                {n}h
              </button>
            ))}
          </div>
          <p className="text-xs text-foreground/60 italic mt-2">
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

        {/* Moments */}
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
                className={`tag-button ${data.moments.includes(m) ? "selected" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <NavigationButtons
        onPrev={onPrev}
        onNext={() => {
          if (!datePart) {
            toast.error("Veuillez renseigner la date.");
            return;
          }
          onNext();
        }}
      />
    </div>
  );
};

export default StepPlageHoraire;

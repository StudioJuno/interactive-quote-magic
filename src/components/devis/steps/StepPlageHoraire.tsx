import { useMemo, useState } from "react";
import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock, CalendarIcon } from "lucide-react";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const [calendarOpen, setCalendarOpen] = useState(false);

  const toggleMoment = (moment: string) => {
    const current = data.moments;
    const updated = current.includes(moment)
      ? current.filter((m) => m !== moment)
      : [...current, moment];
    onChange({ moments: updated });
  };

  const datePart = data.dateHeure ? data.dateHeure.split("T")[0] : "";
  const timePart = data.dateHeure ? data.dateHeure.split("T")[1]?.substring(0, 5) || "" : "";

  const selectedDate = datePart ? new Date(datePart + "T12:00:00") : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const formatted = format(date, "yyyy-MM-dd");
    const time = timePart || "14:00";
    onChange({ dateHeure: `${formatted}T${time}` });
    setCalendarOpen(false);
  };

  const updateTime = (time: string) => {
    const date = datePart || new Date().toISOString().split("T")[0];
    onChange({ dateHeure: `${date}T${time}` });
  };

  const handleNext = () => {
    if (!datePart) {
      toast.error("Veuillez renseigner la date.");
      return;
    }
    onNext();
  };

  useWizardKeyboard({ onNext: handleNext, onPrev });

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
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        Votre plage horaire
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Quand souhaitez-vous couvrir votre mariage ?
      </p>

      <div className="max-w-lg mx-auto space-y-7">
        {/* Date */}
        <div>
          <label className="step-label">Date du mariage</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="wizard-input pl-10 text-left relative w-full cursor-pointer"
              >
                <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                {selectedDate ? (
                  <span className="text-foreground">
                    {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Choisir une date</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-xl" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={fr}
                disabled={{ before: new Date() }}
                initialFocus
                className="rounded-2xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Heure */}
        <div>
          <label className="step-label">Heure de début</label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={timePart}
              onChange={(e) => updateTime(e.target.value)}
              className="wizard-input pl-10 appearance-none cursor-pointer bg-card"
            >
              <option value="" disabled>Choisir une heure</option>
              {HOURS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nombre d'heures */}
        <div>
          <label className="step-label">Nombre d'heures de couverture</label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((n) => (
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
          <p className="text-xs text-muted-foreground italic mt-2.5">
            Chaque heure couverte par un photographe inclut 50 photos retouchées HD
          </p>
          {plageText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-accent font-medium mt-2.5 bg-accent/5 border border-accent/15 px-3 py-2.5 rounded-xl"
            >
              <Clock className="w-4 h-4" />
              {plageText}
            </motion.div>
          )}
        </div>

        {/* Moments */}
        <div>
          <label className="step-label">Moments à capturer</label>
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

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
};

export default StepPlageHoraire;

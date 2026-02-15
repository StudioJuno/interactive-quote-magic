import { useMemo, useState } from "react";
import { QuoteData, EventEntry } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CalendarIcon, MapPin, Plus, Trash2 } from "lucide-react";
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

const HOURS: string[] = [];
for (let h = 6; h <= 23; h++) {
  HOURS.push(`${String(h).padStart(2, "0")}:00`);
  HOURS.push(`${String(h).padStart(2, "0")}:30`);
}
HOURS.push("00:00");

const EventCard = ({
  event,
  index,
  total,
  onChange,
  onRemove,
}: {
  event: EventEntry;
  index: number;
  total: number;
  onChange: (updated: EventEntry) => void;
  onRemove: () => void;
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const datePart = event.dateHeure ? event.dateHeure.split("T")[0] : "";
  const timePart = event.dateHeure ? event.dateHeure.split("T")[1]?.substring(0, 5) || "" : "";
  const selectedDate = datePart ? new Date(datePart + "T12:00:00") : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const formatted = format(date, "yyyy-MM-dd");
    const time = timePart || "14:00";
    onChange({ ...event, dateHeure: `${formatted}T${time}` });
    setCalendarOpen(false);
  };

  const updateTime = (time: string) => {
    const date = datePart || new Date().toISOString().split("T")[0];
    onChange({ ...event, dateHeure: `${date}T${time}` });
  };

  const plageText = useMemo(() => {
    if (!event.dateHeure || !event.nbHeuresCouverture) return null;
    try {
      const start = new Date(event.dateHeure);
      const end = new Date(start.getTime() + event.nbHeuresCouverture * 60 * 60 * 1000);
      const fmt = (d: Date) =>
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      return `${fmt(start)} → ${fmt(end)}`;
    } catch {
      return null;
    }
  }, [event.dateHeure, event.nbHeuresCouverture]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-xl p-5 bg-card space-y-4 relative"
    >
      {total > 1 && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            Jour {index + 1}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Date + Time row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="wizard-input pl-9 text-left relative w-full cursor-pointer text-sm"
              >
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                {selectedDate ? (
                  <span className="text-foreground">
                    {format(selectedDate, "d MMM yyyy", { locale: fr })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Date</span>
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
                className="rounded-2xl pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Heure</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={timePart}
              onChange={(e) => updateTime(e.target.value)}
              className="wizard-input pl-9 appearance-none cursor-pointer bg-card text-sm"
            >
              <option value="" disabled>Heure</option>
              {HOURS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Durée de couverture</label>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ ...event, nbHeuresCouverture: n })}
              className={`tag-button min-w-[44px] text-xs py-1.5 ${event.nbHeuresCouverture === n ? "selected" : ""}`}
            >
              {n}h
            </button>
          ))}
        </div>
        {plageText && (
          <p className="text-xs text-accent font-medium mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {plageText}
          </p>
        )}
      </div>

      {/* Lieu */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Lieu (optionnel)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={event.lieu}
              onChange={(e) => onChange({ ...event, lieu: e.target.value })}
              placeholder="Ex : Château de Versailles"
              className="wizard-input pl-9 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Dépt. *</label>
          <input
            type="text"
            value={event.departement}
            onChange={(e) => onChange({ ...event, departement: e.target.value })}
            placeholder="75"
            className="wizard-input text-sm"
          />
        </div>
      </div>
    </motion.div>
  );
};

const StepDateLieu = ({ data, onChange, onNext, onPrev }: Props) => {
  const needsMultiple = data.moments.length >= 2;
  const events = data.events.length > 0 ? data.events : [{ dateHeure: "", lieu: "", departement: "75", nbHeuresCouverture: 10 }];

  const updateEvent = (index: number, updated: EventEntry) => {
    const newEvents = [...events];
    newEvents[index] = updated;
    // Sync first event to flat fields for backward compat
    const first = newEvents[0];
    onChange({
      events: newEvents,
      dateHeure: first.dateHeure,
      lieu: first.lieu,
      departement: first.departement,
      nbHeuresCouverture: first.nbHeuresCouverture,
    });
  };

  const addEvent = () => {
    onChange({ events: [...events, { dateHeure: "", lieu: "", departement: "75", nbHeuresCouverture: 10 }] });
  };

  const removeEvent = (index: number) => {
    if (events.length <= 1) return;
    const newEvents = events.filter((_, i) => i !== index);
    const first = newEvents[0];
    onChange({
      events: newEvents,
      dateHeure: first.dateHeure,
      lieu: first.lieu,
      departement: first.departement,
      nbHeuresCouverture: first.nbHeuresCouverture,
    });
  };

  const handleNext = () => {
    const hasEmptyDate = events.some((e) => !e.dateHeure.split("T")[0]);
    if (hasEmptyDate) {
      toast.error("Veuillez renseigner toutes les dates.");
      return;
    }
    const hasEmptyDept = events.some((e) => !e.departement.trim());
    if (hasEmptyDept) {
      toast.error("Veuillez renseigner tous les départements.");
      return;
    }
    onNext();
  };

  useWizardKeyboard({ onNext: handleNext, onPrev });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        {needsMultiple ? "Vos dates & lieux" : "Date & lieu"}
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-6">
        {needsMultiple
          ? "Renseignez les informations pour chaque moment"
          : "Quand et où aura lieu votre mariage ?"}
      </p>
      <p className="text-xs text-accent italic font-medium text-center mb-6">
        Les frais de déplacement sont toujours offerts ✨
      </p>

      <div className="max-w-lg mx-auto space-y-4">
        <AnimatePresence mode="popLayout">
          {events.map((event, i) => (
            <EventCard
              key={i}
              event={event}
              index={i}
              total={events.length}
              onChange={(updated) => updateEvent(i, updated)}
              onRemove={() => removeEvent(i)}
            />
          ))}
        </AnimatePresence>

        {needsMultiple && (
          <motion.button
            type="button"
            onClick={addEvent}
            className="w-full border border-dashed border-border rounded-xl py-3 text-sm text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus className="w-4 h-4" />
            Ajouter un jour
          </motion.button>
        )}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
};

export default StepDateLieu;

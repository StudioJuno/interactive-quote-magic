import { QuoteData, PRICES } from "../types";
import NavigationButtons from "../NavigationButtons";
import { motion } from "framer-motion";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepRecap = ({ data, onChange, onNext, onPrev }: Props) => {
  useWizardKeyboard({ onNext, onPrev });

  const label =
    data.offerType === "photos-film"
      ? "Photos & Vidéo"
      : data.offerType === "film"
      ? "Vidéo"
      : "Photos";

  const lines: { label: string; price: number }[] = [];
  if (data.nbVideastes > 0) lines.push({ label: `${data.nbVideastes} vidéaste${data.nbVideastes > 1 ? "s" : ""}`, price: data.nbVideastes * PRICES.vidéaste });
  if (data.nbPhotographes > 0) lines.push({ label: `${data.nbPhotographes} photographe${data.nbPhotographes > 1 ? "s" : ""}`, price: data.nbPhotographes * PRICES.photographe });
  if (data.optionDrone) lines.push({ label: "Drone", price: PRICES.drone });
  if (data.optionInterviews) lines.push({ label: "Interviews", price: PRICES.interviews });
  if (data.filmTeaser) lines.push({ label: 'Film "teaser"', price: PRICES.teaser });
  if (data.filmSignature) lines.push({ label: 'Film "signature"', price: PRICES.signature });
  if (data.filmReseaux) lines.push({ label: "Réseaux sociaux", price: PRICES.reseaux });
  if (data.filmBetisier) lines.push({ label: "Bêtisier", price: PRICES.betisier });
  if (data.albumPhoto) lines.push({ label: "Album Photo", price: PRICES.album });
  if (data.coffretUSB) lines.push({ label: "Coffret USB", price: PRICES.coffret });
  if (data.delai === "express") lines.push({ label: "Express", price: PRICES.express });

  const subtotal = lines.reduce((sum, l) => sum + l.price, 0);

  const dateDisplay = data.dateHeure
    ? new Date(data.dateHeure).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : "";
  const heuresDisplay = data.nbHeuresCouverture ? `${data.nbHeuresCouverture}h de couverture` : "";

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-1">
        Récapitulatif
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8">{label}</p>

      <div className="max-w-lg mx-auto">
        {/* Event details */}
        <div className="bg-accent/5 border border-accent/15 rounded-xl p-4 mb-6">
          {dateDisplay && (
            <p className="font-body font-semibold text-sm mb-1">
              📅 {dateDisplay}
            </p>
          )}
          {heuresDisplay && (
            <p className="text-xs text-muted-foreground mb-1">⏱ {heuresDisplay}</p>
          )}
          {data.moments.length > 0 && (
            <p className="text-accent text-xs">{data.moments.join(", ")}</p>
          )}
          {data.lieu && (
            <p className="text-xs text-muted-foreground mt-1">📍 {data.lieu}</p>
          )}
        </div>

        {/* Line items */}
        <div className="space-y-2.5 mb-4">
          {lines.map((line, i) => (
            <motion.div
              key={line.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex justify-between text-sm font-body"
            >
              <span className="text-muted-foreground">{line.label}</span>
              <span className="font-medium tabular-nums">{line.price} €</span>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border pt-4 mb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Livraison {data.delai === "express" ? "Express" : "Standard"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 mb-6 bg-accent/5 border border-accent/15 rounded-xl px-4 py-3">
          <span className="text-sm font-medium">Total HT</span>
          <motion.span
            key={subtotal}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl font-heading font-bold text-accent"
          >
            {subtotal.toLocaleString("fr-FR")} €
          </motion.span>
        </div>

        {/* Code promo */}
        <div className="flex gap-3">
          <input
            type="text"
            value={data.codePromo}
            onChange={(e) => onChange({ codePromo: e.target.value })}
            placeholder="Code promo"
            className="wizard-input flex-1"
          />
          <button
            type="button"
            className="px-5 py-3 border border-accent/30 text-accent rounded-xl font-body text-sm font-medium hover:bg-accent/5 transition-colors"
          >
            Valider
          </button>
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default StepRecap;

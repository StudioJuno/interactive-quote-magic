import { QuoteData, PRICES } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, X } from "lucide-react";

interface QuoteSummaryProps {
  data: QuoteData;
  onClose?: () => void;
  isMobile?: boolean;
}

const AnimatedPrice = ({ value }: { value: number }) => (
  <motion.span
    key={value}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="text-xl font-heading font-bold text-accent"
  >
    {value.toLocaleString("fr-FR")} €
  </motion.span>
);

const QuoteSummary = ({ data, onClose, isMobile }: QuoteSummaryProps) => {
  const label =
    data.offerType === "photos-film"
      ? "Photos & Vidéo"
      : data.offerType === "film"
      ? "Vidéo"
      : data.offerType === "photos"
      ? "Photos"
      : "Votre devis";

  const lines: { label: string; price: number }[] = [];

  if (data.nbVideastes > 0) {
    lines.push({
      label: `${data.nbVideastes} vidéaste${data.nbVideastes > 1 ? "s" : ""}`,
      price: data.nbVideastes * PRICES.vidéaste,
    });
  }
  if (data.nbPhotographes > 0) {
    lines.push({
      label: `${data.nbPhotographes} photographe${data.nbPhotographes > 1 ? "s" : ""}`,
      price: data.nbPhotographes * PRICES.photographe,
    });
  }
  if (data.optionDrone) lines.push({ label: "Drone", price: PRICES.drone });
  if (data.optionDiscours) lines.push({ label: "Discours", price: PRICES.discours });
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
  const timeDisplay = data.dateHeure
    ? data.dateHeure.split("T")[1]?.substring(0, 5) || ""
    : "";

  const hasAnyInfo = data.offerType !== "" || lines.length > 0;
  if (!hasAnyInfo) return null;

  return (
    <div className={`bg-card border border-border rounded-2xl p-6 font-body shadow-sm ${isMobile ? 'w-full' : 'w-72'}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-accent" />
          </div>
          <h3 className="text-sm font-heading font-semibold">{label}</h3>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Date & time */}
      {dateDisplay && (
        <p className="font-medium text-xs mb-1">
          📅 {dateDisplay}{timeDisplay ? ` à ${timeDisplay}` : ""}{data.nbHeuresCouverture ? ` (${data.nbHeuresCouverture}h)` : ""}
        </p>
      )}

      {/* Moments */}
      {data.moments.length > 0 && (
        <p className="text-muted-foreground text-xs mb-3">{data.moments.join(", ")}</p>
      )}

      {/* Lieu */}
      {data.lieu && (
        <p className="text-muted-foreground text-xs mb-3">📍 {data.lieu}</p>
      )}

      {/* Coverage type */}
      {data.coverageType && !dateDisplay && (
        <p className="text-muted-foreground text-xs mb-3">
          {data.coverageType === "jour-j" ? "Jour J uniquement" : `${data.nbJours} jours`}
        </p>
      )}

      {lines.length > 0 && (
        <>
          <div className="space-y-2.5 py-3 border-t border-border">
            <AnimatePresence mode="popLayout">
              {lines.map((line, i) => (
                <motion.div
                  key={line.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">{line.label}</span>
                  <span className="font-medium tabular-nums">{line.price} €</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total HT</span>
              <AnimatedPrice value={subtotal} />
            </div>
          </div>
        </>
      )}

      {lines.length === 0 && (
        <p className="text-xs text-muted-foreground italic py-2">
          Vos options apparaîtront ici au fur et à mesure
        </p>
      )}

      {/* Délai */}
      {data.delai && (
        <p className="text-xs font-medium mt-3 text-muted-foreground">
          🚀 Livraison {data.delai === "express" ? "Express" : "Standard"}
        </p>
      )}
    </div>
  );
};

export default QuoteSummary;

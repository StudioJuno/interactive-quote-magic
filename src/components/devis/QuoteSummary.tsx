import { QuoteData, PRICES } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, X } from "lucide-react";

interface QuoteSummaryProps {
  data: QuoteData;
  onClose?: () => void;
  isMobile?: boolean;
}

const QuoteSummary = ({ data, onClose, isMobile }: QuoteSummaryProps) => {
  const label =
    data.offerType === "photos-film"
      ? "Photos & Vidéo"
      : data.offerType === "film"
      ? "Vidéo"
      : "Photos";

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
  if (data.optionInterviews) lines.push({ label: "Interviews", price: PRICES.interviews });
  if (data.filmTeaser) lines.push({ label: 'Film "teaser"', price: PRICES.teaser });
  if (data.filmSignature) lines.push({ label: 'Film "signature"', price: PRICES.signature });
  if (data.filmReseaux) lines.push({ label: "Réseaux sociaux", price: PRICES.reseaux });
  if (data.filmBetisier) lines.push({ label: "Bêtisier", price: PRICES.betisier });
  if (data.albumPhoto) lines.push({ label: "Album Photo", price: PRICES.album });
  if (data.coffretUSB) lines.push({ label: "Coffret USB", price: PRICES.coffret });
  if (data.delai === "express") lines.push({ label: "Express", price: PRICES.express });

  const subtotal = lines.reduce((sum, l) => sum + l.price, 0);

  if (lines.length === 0) return null;

  return (
    <div className={`bg-card border border-border rounded-xl p-6 font-body ${isMobile ? 'w-full' : 'w-72'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-heading font-semibold">{label}</h3>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {data.dateMariage && (
        <p className="text-accent font-medium text-xs mb-3 bg-accent/10 px-3 py-1.5 rounded-full inline-block">
          📍 {data.dateMariage}
        </p>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {lines.map((line, i) => (
            <motion.div
              key={line.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.05 }}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">{line.label}</span>
              <span className="font-medium">{line.price} €</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t border-border mt-4 pt-3">
        <motion.div
          className="flex justify-between items-center"
          key={subtotal}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <span className="text-sm font-medium">Total</span>
          <span className="text-xl font-heading font-bold text-accent">{subtotal} €</span>
        </motion.div>
      </div>
    </div>
  );
};

export default QuoteSummary;

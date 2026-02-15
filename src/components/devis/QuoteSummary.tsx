import { QuoteData, PRICES } from "./types";

interface QuoteSummaryProps {
  data: QuoteData;
}

const QuoteSummary = ({ data }: QuoteSummaryProps) => {
  const label =
    data.offerType === "photos-film"
      ? "Photos et Vidéo"
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
  if (data.filmReseaux) lines.push({ label: "Contenu réseaux sociaux", price: PRICES.reseaux });
  if (data.filmBetisier) lines.push({ label: "Bêtisier", price: PRICES.betisier });
  if (data.albumPhoto) lines.push({ label: "Album Photo 50 pages", price: PRICES.album });
  if (data.coffretUSB) lines.push({ label: "Coffret USB", price: PRICES.coffret });
  if (data.delai === "express") lines.push({ label: "Livraison express", price: PRICES.express });

  const subtotal = lines.reduce((sum, l) => sum + l.price, 0);

  if (lines.length === 0) return null;

  return (
    <div className="border border-border bg-summary-bg p-5 w-64 text-sm font-body">
      <h3 className="text-base font-heading font-semibold text-center mb-3">{label}</h3>

      {data.dateMariage && (
        <p className="text-summary-accent font-semibold text-sm mb-2">
          {data.dateMariage}
        </p>
      )}

      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i} className="flex justify-between">
            <span>{line.label}</span>
            <span>{line.price} €</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border mt-3 pt-2">
        <div className="flex justify-between font-semibold">
          <span></span>
          <span>{subtotal} €</span>
        </div>
        <div className="flex justify-between font-bold text-base mt-1">
          <span>Total:</span>
          <span>{subtotal} €</span>
        </div>
      </div>
    </div>
  );
};

export default QuoteSummary;

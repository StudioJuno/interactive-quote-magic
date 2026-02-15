import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, Video } from "lucide-react";
import { useWizardKeyboard } from "@/hooks/useWizardKeyboard";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const allPhotographeOptions = [
  { value: 0, label: "Aucun photographe", desc: "Pas de photographe" },
  { value: 1, label: "1 photographe", desc: "Économique" },
  { value: 2, label: "2 photographes", desc: "Deux regards complémentaires" },
  { value: 3, label: "3 photographes", desc: "Idéal grands mariages" },
];

const allVideasteOptions = [
  { value: 1, label: "1 vidéaste", desc: "Économique" },
  { value: 2, label: "2 vidéastes", desc: "Film riche et cinématographique" },
  { value: 3, label: "3 vidéastes", desc: "Rendu immersif et complet" },
];

function getRecommended(nbInvites: string): number {
  const n = parseInt(nbInvites, 10);
  if (!n || n < 150) return 1;
  if (n < 250) return 2;
  return 3;
}

const StepPrestataires = ({ data, onChange, onNext, onPrev }: Props) => {
  const showPhotographes = data.offerType === "photos" || data.offerType === "photos-film";
  const showVideastes = data.offerType === "film" || data.offerType === "photos-film";
  const recommended = getRecommended(data.nbInvites);
  const photographeOptions = allPhotographeOptions;
  const videasteOptions = allVideasteOptions;

  const handleNext = () => {
    if (showPhotographes && data.nbPhotographes === 0 && showVideastes && data.nbVideastes === 0) {
      toast.error("Veuillez sélectionner au moins un prestataire.");
      return;
    }
    onNext();
  };

  useWizardKeyboard({ onNext: handleNext, onPrev });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2">
        Vos prestataires
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8">
        De combien de prestataires avez-vous besoin ?
      </p>

      <div className="max-w-lg mx-auto space-y-3">
        {showPhotographes && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4 text-accent" />
              <span className="step-label !mb-0">Photographes</span>
            </div>
            {photographeOptions.map((opt, i) => {
              const selected = data.nbPhotographes === opt.value;
              return (
                <motion.div
                  key={`photo-${opt.value}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`option-card flex items-center gap-3 py-3 px-4 ${selected ? 'selected' : ''}`}
                  onClick={() => onChange({ nbPhotographes: opt.value })}
                >
                  <div className="option-radio">
                    {selected && (
                      <motion.div className="w-2.5 h-2.5 rounded-full bg-accent" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-body font-medium text-sm">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">— {opt.desc}</span>
                    {opt.value === recommended && opt.value > 0 && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">Conseillé</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}

        {showPhotographes && showVideastes && <div className="pt-3" />}

        {showVideastes && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4 text-accent" />
              <span className="step-label !mb-0">Vidéastes</span>
            </div>
            {videasteOptions.map((opt, i) => {
              const selected = data.nbVideastes === opt.value;
              return (
                <motion.div
                  key={`video-${opt.value}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + (showPhotographes ? 0.2 : 0) }}
                  className={`option-card flex items-center gap-3 py-3 px-4 ${selected ? 'selected' : ''}`}
                  onClick={() => onChange({ nbVideastes: opt.value })}
                >
                  <div className="option-radio">
                    {selected && (
                      <motion.div className="w-2.5 h-2.5 rounded-full bg-accent" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-body font-medium text-sm">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">— {opt.desc}</span>
                    {opt.value === recommended && opt.value > 0 && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">Conseillé</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
};

export default StepPrestataires;

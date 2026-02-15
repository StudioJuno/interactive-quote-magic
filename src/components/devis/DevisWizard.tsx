import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuoteData, initialQuoteData, PRICES } from "./types";
import StepIndicator from "./StepIndicator";
import QuoteSummary from "./QuoteSummary";
import StepOffre from "./steps/StepOffre";
import StepCoverage from "./steps/StepCoverage";
import StepLieu from "./steps/StepLieu";
import StepInvites from "./steps/StepInvites";
import StepPrestataires from "./steps/StepPrestataires";
import StepDateLieu from "./steps/StepDateLieu";
import StepOptionsSupp from "./steps/StepOptionsSupp";
import StepFilms from "./steps/StepFilms";
import StepSupports from "./steps/StepSupports";
import StepPlageHoraire from "./steps/StepPlageHoraire";
import StepDelai from "./steps/StepDelai";
import StepRemarques from "./steps/StepRemarques";
import StepSource from "./steps/StepSource";
import StepRecap from "./steps/StepRecap";
import StepContact from "./steps/StepContact";
import StepGenerating from "./steps/StepGenerating";
import { Receipt } from "lucide-react";

const MAIN_STEPS = [
  { label: "Offre" },
  { label: "Prestation" },
  { label: "Remarque" },
  { label: "Contact" },
];

const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  }),
};

const DevisWizard = () => {
  const [data, setData] = useState<QuoteData>(initialQuoteData);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const onChange = useCallback((updates: Partial<QuoteData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const subSteps = useMemo(() => {
    const steps: string[] = ["offre", "coverage", "plage-horaire", "date-lieu"];
    steps.push("invites", "prestataires");
    if (data.offerType === "film" || data.offerType === "photos-film") {
      steps.push("options-supp");
      steps.push("films");
    }
    if (data.offerType === "photos" || data.offerType === "photos-film") {
      steps.push("supports");
    }
    steps.push("delai");
    steps.push("remarques");
    steps.push("source");
    steps.push("recap");
    steps.push("contact");
    steps.push("generating");
    return steps;
  }, [data.offerType]);

  const currentSubStep = subSteps[step] || "offre";

  const getMainStep = () => {
    if (["offre", "coverage", "plage-horaire", "date-lieu"].includes(currentSubStep)) return 1;
    if (["invites", "prestataires", "options-supp", "films", "supports", "delai"].includes(currentSubStep)) return 2;
    if (["remarques", "source", "recap"].includes(currentSubStep)) return 3;
    return 4;
  };

  // Build step summaries for completed main steps
  const stepSummaries = useMemo(() => {
    const summaries: Record<number, string> = {};
    const mainStep = getMainStep();
    if (mainStep > 1 && data.offerType) {
      const labels: Record<string, string> = { film: "Vidéo", photos: "Photos", "photos-film": "Photos & Film" };
      summaries[1] = labels[data.offerType] || "";
    }
    if (mainStep > 2 && data.lieu) {
      summaries[2] = data.lieu;
    }
    if (mainStep > 3) {
      summaries[3] = "✓";
    }
    return summaries;
  }, [data.offerType, data.lieu, getMainStep()]);

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, subSteps.length - 1));
  };
  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const goToMainStep = (mainStep: number) => {
    const mainStepFirstSub: Record<number, string> = {
      1: "offre",
      2: "invites",
      3: "remarques",
      4: "contact",
    };
    const target = mainStepFirstSub[mainStep];
    if (target) {
      const idx = subSteps.indexOf(target);
      if (idx !== -1) {
        setDirection(idx > step ? 1 : -1);
        setStep(idx);
      }
    }
  };

  const showSummary = data.offerType !== "";

  // Calculate total for mobile FAB
  const total = useMemo(() => {
    let t = 0;
    t += data.nbVideastes * PRICES.vidéaste;
    t += data.nbPhotographes * PRICES.photographe;
    if (data.optionDrone) t += PRICES.drone;
    if (data.optionInterviews) t += PRICES.interviews;
    if (data.optionDiscours) t += PRICES.discours;
    if (data.filmTeaser) t += PRICES.teaser;
    if (data.filmSignature) t += PRICES.signature;
    if (data.filmReseaux) t += PRICES.reseaux;
    if (data.filmBetisier) t += PRICES.betisier;
    if (data.albumPhoto) t += PRICES.album;
    if (data.coffretUSB) t += PRICES.coffret;
    if (data.delai === "express") t += PRICES.express;
    return t;
  }, [data]);

  const renderStep = () => {
    switch (currentSubStep) {
      case "offre": return <StepOffre data={data} onChange={onChange} onNext={next} />;
      case "coverage": return <StepCoverage data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "plage-horaire": return <StepPlageHoraire data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "date-lieu": return <StepDateLieu data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "invites": return <StepInvites data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "prestataires": return <StepPrestataires data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "options-supp": return <StepOptionsSupp data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "films": return <StepFilms data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "supports": return <StepSupports data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "delai": return <StepDelai data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "remarques": return <StepRemarques data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "source": return <StepSource data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "recap": return <StepRecap data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "contact": return <StepContact data={data} onChange={onChange} onPrev={prev} onNext={next} />;
      case "generating": return <StepGenerating data={data} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        <StepIndicator
          currentMainStep={getMainStep()}
          steps={MAIN_STEPS}
          onStepClick={goToMainStep}
          stepSummaries={stepSummaries}
          currentSubStepIndex={step}
          totalSubSteps={subSteps.length - 1} // exclude "generating"
        />
      </div>

      <div className="flex gap-8 w-full max-w-5xl justify-center items-start">
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 w-full max-w-[720px] min-h-[480px] flex flex-col justify-center items-center shadow-sm overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSubStep}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {showSummary && (
          <motion.div
            className="hidden md:block sticky top-8 shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <QuoteSummary data={data} />
          </motion.div>
        )}
      </div>

      {/* Mobile FAB with price */}
      {showSummary && (
        <motion.button
          className="md:hidden fixed bottom-6 right-6 h-14 px-5 rounded-full bg-accent text-accent-foreground shadow-xl shadow-accent/30 flex items-center gap-2.5 z-50"
          onClick={() => setShowMobileSummary(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Receipt className="w-5 h-5" />
          {total > 0 && (
            <motion.span
              key={total}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-body font-semibold text-sm"
            >
              {total.toLocaleString("fr-FR")} €
            </motion.span>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {showMobileSummary && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSummary(false)}
            />
            <motion.div
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <QuoteSummary data={data} isMobile onClose={() => setShowMobileSummary(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevisWizard;

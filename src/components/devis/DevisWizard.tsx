import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuoteData, initialQuoteData } from "./types";
import StepIndicator from "./StepIndicator";
import QuoteSummary from "./QuoteSummary";
import StepOffre from "./steps/StepOffre";
import StepCoverage from "./steps/StepCoverage";
import StepLieu from "./steps/StepLieu";
import StepInvites from "./steps/StepInvites";
import StepPrestataires from "./steps/StepPrestataires";
import StepOptionsSupp from "./steps/StepOptionsSupp";
import StepFilms from "./steps/StepFilms";
import StepSupports from "./steps/StepSupports";
import StepPlageHoraire from "./steps/StepPlageHoraire";
import StepDelai from "./steps/StepDelai";
import StepRemarques from "./steps/StepRemarques";
import StepContact from "./steps/StepContact";
import { Receipt } from "lucide-react";

const MAIN_STEPS = [
  { label: "Offre" },
  { label: "Prestation" },
  { label: "Remarque" },
  { label: "Contact" },
];

const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
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
    const steps: string[] = ["offre", "coverage", "plage-horaire"];
    steps.push("lieu", "invites", "prestataires");
    if (data.offerType === "film" || data.offerType === "photos-film") {
      steps.push("options-supp");
      steps.push("films");
    }
    if (data.offerType === "photos" || data.offerType === "photos-film") {
      steps.push("supports");
    }
    steps.push("delai");
    steps.push("remarques");
    steps.push("contact");
    return steps;
  }, [data.offerType]);

  const currentSubStep = subSteps[step] || "offre";

  const getMainStep = () => {
    if (["offre", "coverage", "plage-horaire"].includes(currentSubStep)) return 1;
    if (["lieu", "invites", "prestataires", "options-supp", "films", "supports", "delai"].includes(currentSubStep)) return 2;
    if (currentSubStep === "remarques") return 3;
    return 4;
  };

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
      2: "lieu",
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

  const showSummary = getMainStep() >= 2 && (data.nbPhotographes > 0 || data.nbVideastes > 0);

  const renderStep = () => {
    switch (currentSubStep) {
      case "offre": return <StepOffre data={data} onChange={onChange} onNext={next} />;
      case "coverage": return <StepCoverage data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "plage-horaire": return <StepPlageHoraire data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "lieu": return <StepLieu data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "invites": return <StepInvites data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "prestataires": return <StepPrestataires data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "options-supp": return <StepOptionsSupp data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "films": return <StepFilms data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "supports": return <StepSupports data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "delai": return <StepDelai data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "remarques": return <StepRemarques data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "contact": return <StepContact data={data} onChange={onChange} onPrev={prev} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        <StepIndicator currentMainStep={getMainStep()} steps={MAIN_STEPS} onStepClick={goToMainStep} />
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
            className="hidden lg:block sticky top-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <QuoteSummary data={data} />
          </motion.div>
        )}
      </div>

      {/* Mobile floating summary button */}
      {showSummary && (
        <motion.button
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-xl shadow-accent/30 flex items-center justify-center z-50"
          onClick={() => setShowMobileSummary(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Receipt className="w-5 h-5" />
        </motion.button>
      )}

      {/* Mobile summary drawer */}
      <AnimatePresence>
        {showMobileSummary && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSummary(false)}
            />
            <motion.div
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-8"
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

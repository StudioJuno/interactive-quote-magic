import { useState, useCallback, useMemo } from "react";
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

const MAIN_STEPS = [
  { label: "Offre" },
  { label: "Prestation" },
  { label: "Remarque" },
  { label: "Contact" },
];

const DevisWizard = () => {
  const [data, setData] = useState<QuoteData>(initialQuoteData);
  const [step, setStep] = useState(0);

  const onChange = useCallback((updates: Partial<QuoteData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Build sub-steps dynamically based on offerType
  const subSteps = useMemo(() => {
    const steps: string[] = ["offre", "coverage", "plage-horaire"];

    // Prestation sub-steps
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

  const next = () => setStep((s) => Math.min(s + 1, subSteps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const showSummary = getMainStep() >= 2 && (data.nbPhotographes > 0 || data.nbVideastes > 0);

  const renderStep = () => {
    switch (currentSubStep) {
      case "offre":
        return <StepOffre data={data} onChange={onChange} onNext={next} />;
      case "coverage":
        return <StepCoverage data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "plage-horaire":
        return <StepPlageHoraire data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "lieu":
        return <StepLieu data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "invites":
        return <StepInvites data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "prestataires":
        return <StepPrestataires data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "options-supp":
        return <StepOptionsSupp data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "films":
        return <StepFilms data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "supports":
        return <StepSupports data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "delai":
        return <StepDelai data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "remarques":
        return <StepRemarques data={data} onChange={onChange} onNext={next} onPrev={prev} />;
      case "contact":
        return <StepContact data={data} onChange={onChange} onPrev={prev} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <StepIndicator currentMainStep={getMainStep()} steps={MAIN_STEPS} />
      </div>

      <div className="flex gap-6 w-full max-w-5xl justify-center items-start">
        <div className="border border-border bg-card p-8 sm:p-12 w-full max-w-[700px] min-h-[500px] flex flex-col justify-center">
          {renderStep()}
        </div>

        {showSummary && (
          <div className="hidden lg:block sticky top-8">
            <QuoteSummary data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DevisWizard;

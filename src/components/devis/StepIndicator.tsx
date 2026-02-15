interface StepIndicatorProps {
  currentMainStep: number;
  steps: { label: string }[];
  onStepClick?: (stepNum: number) => void;
}

const StepIndicator = ({ currentMainStep, steps, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum <= currentMainStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                onClick={() => stepNum <= currentMainStep && onStepClick?.(stepNum)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-body font-medium transition-all ${
                  stepNum <= currentMainStep ? "cursor-pointer hover:scale-110" : ""
                } ${
                  isActive
                    ? "border-step-active bg-step-active text-step-active-foreground"
                    : "border-step-inactive bg-transparent text-step-inactive"
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`text-xs mt-1.5 font-body font-medium ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`w-20 sm:w-32 h-0.5 mb-5 mx-1 transition-all ${
                  stepNum < currentMainStep ? "bg-step-line" : "bg-step-line-inactive"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;

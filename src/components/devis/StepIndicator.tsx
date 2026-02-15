import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentMainStep: number;
  steps: { label: string }[];
  onStepClick?: (stepNum: number) => void;
  stepSummaries?: Record<number, string>;
  currentSubStepIndex?: number;
  totalSubSteps?: number;
}

const StepIndicator = ({ currentMainStep, steps, onStepClick, stepSummaries, currentSubStepIndex, totalSubSteps }: StepIndicatorProps) => {
  const totalSteps = steps.length;
  const progress = ((currentMainStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="relative h-1 bg-step-line-inactive rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentMainStep;
          const isCurrent = stepNum === currentMainStep;
          const isClickable = stepNum <= currentMainStep;
          const summary = stepSummaries?.[stepNum];

          return (
            <button
              key={index}
              onClick={() => isClickable && onStepClick?.(stepNum)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 min-w-0 flex-1 ${
                isClickable ? "cursor-pointer" : "cursor-default opacity-35"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-colors duration-300 ${
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isCurrent
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                    : "bg-muted text-muted-foreground"
                }`}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                layout
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  stepNum
                )}
              </motion.div>
              <span
                className={`text-xs font-body font-medium transition-colors duration-300 ${
                  isCurrent ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {isCompleted && summary && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-muted-foreground truncate max-w-[80px]"
                >
                  {summary}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      {/* Step counter */}
      {currentSubStepIndex !== undefined && totalSubSteps !== undefined && (
        <motion.p
          key={currentSubStepIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[11px] text-muted-foreground mt-4 font-body"
        >
          Étape {currentSubStepIndex + 1} sur {totalSubSteps}
        </motion.p>
      )}
    </div>
  );
};

export default StepIndicator;

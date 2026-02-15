import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentMainStep: number;
  steps: { label: string }[];
  onStepClick?: (stepNum: number) => void;
}

const StepIndicator = ({ currentMainStep, steps, onStepClick }: StepIndicatorProps) => {
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
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentMainStep;
          const isCurrent = stepNum === currentMainStep;
          const isClickable = stepNum <= currentMainStep;

          return (
            <button
              key={index}
              onClick={() => isClickable && onStepClick?.(stepNum)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                isClickable ? "cursor-pointer" : "cursor-default opacity-40"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-colors duration-300 ${
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isCurrent
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;

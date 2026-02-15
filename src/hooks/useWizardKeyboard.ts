import { useEffect } from "react";

interface UseWizardKeyboardOptions {
  onNext?: () => void;
  onPrev?: () => void;
  enabled?: boolean;
}

export const useWizardKeyboard = ({ onNext, onPrev, enabled = true }: UseWizardKeyboardOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "Enter" && onNext) {
        e.preventDefault();
        onNext();
      }
      if (e.key === "Escape" && onPrev) {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNext, onPrev, enabled]);
};

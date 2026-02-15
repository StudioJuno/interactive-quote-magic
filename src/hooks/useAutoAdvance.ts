import { useEffect, useRef } from "react";

/**
 * Automatically advances to the next step after a value is selected.
 * Only triggers once per value change, with a configurable delay.
 */
export const useAutoAdvance = (
  value: string | number | boolean,
  onNext: () => void,
  options?: { delay?: number; enabled?: boolean }
) => {
  const { delay = 500, enabled = true } = options || {};
  const prevValue = useRef(value);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    
    // Only trigger on actual user selection (not initial render)
    if (value === prevValue.current) return;
    if (value === "" || value === 0 || value === false) return;
    
    prevValue.current = value;
    hasTriggered.current = false;

    const timer = setTimeout(() => {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        onNext();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, onNext, delay, enabled]);
};

import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  enabled?: boolean;
}

export function useAnimatedCounter(optionsOrEnd: number | UseAnimatedCounterOptions) {
  const options: UseAnimatedCounterOptions =
    typeof optionsOrEnd === 'number' ? { end: optionsOrEnd } : optionsOrEnd;

  const {
    end,
    duration = 1500,
    start = 0,
    decimals = 0,
    enabled = true,
  } = options;

  const [value, setValue] = useState(start);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      setValue(end);
      return;
    }

    const startTime = performance.now();
    const startValue = start;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (end - startValue) * eased;

      setValue(Number(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, start, decimals, enabled]);

  return value;
}

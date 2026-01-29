import { useEffect, useRef, useState } from 'react';

export function useCounterAnimation(targetValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const startTime = Date.now();
    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      const currentCount = Math.floor(targetValue * easeOutQuad);
      
      setCount(currentCount);

      if (progress === 1) {
        clearInterval(animationInterval);
        hasAnimated.current = true;
      }
    }, 16);

    return () => clearInterval(animationInterval);
  }, [targetValue, duration]);

  return count;
}

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiAnimationProps {
  trigger?: boolean;
  duration?: number;
}

export function ConfettiAnimation({
  trigger = true,
  duration = 3000,
}: ConfettiAnimationProps) {
  useEffect(() => {
    if (!trigger) return;

    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 2;

      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00D9A3', '#6C5CE7', '#FDCB6E'],
      });

      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00D9A3', '#6C5CE7', '#FDCB6E'],
      });
    }, 16);

    return () => clearInterval(interval);
  }, [trigger, duration]);

  return null;
}


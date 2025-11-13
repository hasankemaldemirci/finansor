import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { getLevelIcon, getLevelTitle } from '../constants/levelConfig';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  open: boolean;
  onClose: () => void;
  newLevel: number;
}

export function LevelUpModal({ open, onClose, newLevel }: LevelUpModalProps) {
  const title = getLevelTitle(newLevel);
  const icon = getLevelIcon(newLevel);

  useEffect(() => {
    if (open) {
      // Continuous confetti from sides
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const intervalId = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(intervalId);
          return;
        }

        // Left side confetti
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00D9A3', '#6C5CE7', '#FDCB6E'],
          useWorker: false,
        });

        // Right side confetti
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00D9A3', '#6C5CE7', '#FDCB6E'],
          useWorker: false,
        });
      }, 200);

      return () => clearInterval(intervalId);
    }
  }, [open, newLevel]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Seviye Atladın!</DialogTitle>
          <DialogDescription className="sr-only">
            Level {newLevel} seviyesine ulaştınız: {title}
          </DialogDescription>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center py-4 sm:py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-6xl sm:text-8xl mb-3 sm:mb-4"
          >
            {icon}
          </motion.div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Seviye Atladın!
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-4xl sm:text-6xl font-bold text-primary mb-2">
              Level {newLevel}
            </p>
            <p className="text-lg sm:text-2xl text-muted-foreground">{title}</p>
          </motion.div>
        </motion.div>
        <Button onClick={onClose} className="mt-4 w-full" size="lg">
          Harika! 🎉
        </Button>
      </DialogContent>
    </Dialog>
  );
}


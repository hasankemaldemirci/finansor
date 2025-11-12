import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
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
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00D9A3', '#6C5CE7', '#FDCB6E'],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00D9A3', '#6C5CE7', '#FDCB6E'],
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Seviye Atladın!</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-8xl mb-4"
          >
            {icon}
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Seviye Atladın!
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-6xl font-bold text-primary mb-2">
              Level {newLevel}
            </p>
            <p className="text-2xl text-muted-foreground">{title}</p>
          </motion.div>
        </motion.div>
        <Button onClick={onClose} className="mt-4" size="lg">
          Harika! 🎉
        </Button>
      </DialogContent>
    </Dialog>
  );
}


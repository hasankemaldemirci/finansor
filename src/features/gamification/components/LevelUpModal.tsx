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
import { useTranslation } from 'react-i18next';

interface LevelUpModalProps {
  open: boolean;
  onClose: () => void;
  newLevel: number;
}

export function LevelUpModal({ open, onClose, newLevel }: LevelUpModalProps) {
  const { t } = useTranslation();
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
          <DialogTitle className="sr-only">{t('achievements.levelUpTitle')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('level.label')} {newLevel} {t('achievements.levelReached')}: {title}
          </DialogDescription>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="py-4 text-center sm:py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-3 text-6xl sm:mb-4 sm:text-8xl"
          >
            {icon}
          </motion.div>
          <h2 className="mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent sm:mb-4 sm:text-4xl">
            {t('achievements.levelUpTitle')}
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="mb-2 text-4xl font-bold text-primary sm:text-6xl">
              {t('level.label')} {newLevel}
            </p>
            <p className="text-lg text-muted-foreground sm:text-2xl">{title}</p>
          </motion.div>
        </motion.div>
        <Button onClick={onClose} className="mt-4 w-full" size="lg">
          {t('common.great')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

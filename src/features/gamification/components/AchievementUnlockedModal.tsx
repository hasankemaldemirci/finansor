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
import { Achievement } from '../types/achievement.types';
import { AchievementBadge } from './AchievementBadge';
import { ShareButton } from '@/shared/components/ShareButton';
import { generateAchievementShareText } from '@/shared/utils/socialShare';
import { useLevel } from '../hooks/useLevel';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';

interface AchievementUnlockedModalProps {
  open: boolean;
  onClose: () => void;
  achievement: Achievement | null;
  hideOverlay?: boolean;
}

export function AchievementUnlockedModal({
  open,
  onClose,
  achievement,
  hideOverlay,
}: AchievementUnlockedModalProps) {
  const { t } = useTranslation();
  const { level } = useLevel();

  useEffect(() => {
    if (open && achievement) {
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
  }, [open, achievement]);

  if (!achievement) return null;

  const achievementName = t(achievement.name);
  const achievementDescription = t(achievement.description);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-md"
        hideOverlay={hideOverlay}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">{t('achievements.achievementUnlocked')}</DialogTitle>
          <DialogDescription className="sr-only">
            {achievementName} {t('achievements.achievementUnlockedDesc')}
          </DialogDescription>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="py-4 text-center sm:py-6"
        >
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mb-3 flex justify-center sm:mb-4"
          >
            <AchievementBadge achievement={achievement} size="lg" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-2 text-xl font-bold sm:text-2xl">
              🎉 {t('achievements.achievementUnlocked')}
            </h2>
            <p className="mb-2 text-2xl font-bold text-primary sm:text-3xl">
              {achievementName}
            </p>
            <p className="mb-4 px-2 text-sm text-muted-foreground sm:text-base">
              {achievementDescription}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary sm:px-4 sm:text-base">
              <span>+{achievement.xpReward} XP</span>
              <span>⭐</span>
            </div>
          </motion.div>
        </motion.div>
        <div className="flex gap-2">
          <Button onClick={onClose} size="lg" className="flex-1">
            {t('achievements.greatEmoji')}
          </Button>
          <ShareButton
            title={`${achievementName} ${t('achievements.shareTitle')}`}
            text={generateAchievementShareText(achievementName, level)}
            variant="outline"
            size="lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

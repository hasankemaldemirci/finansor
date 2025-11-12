import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Achievement } from '../types/achievement.types';
import { AchievementBadge } from './AchievementBadge';

interface AchievementUnlockedModalProps {
  open: boolean;
  onClose: () => void;
  achievement: Achievement | null;
}

export function AchievementUnlockedModal({
  open,
  onClose,
  achievement,
}: AchievementUnlockedModalProps) {
  if (!achievement) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Achievement Unlocked!</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center py-6"
        >
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <AchievementBadge achievement={achievement} size="lg" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">
              🎉 Başarı Kilidi Açıldı!
            </h2>
            <p className="text-3xl font-bold text-primary mb-2">
              {achievement.name}
            </p>
            <p className="text-muted-foreground mb-4">
              {achievement.description}
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
              <span>+{achievement.xpReward} XP</span>
              <span>⭐</span>
            </div>
          </motion.div>
        </motion.div>
        <Button onClick={onClose} size="lg">
          Harika! 🎊
        </Button>
      </DialogContent>
    </Dialog>
  );
}


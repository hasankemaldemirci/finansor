import { useGamificationStore } from '../stores/gamificationStore';
import { useMemo } from 'react';

export const useAchievements = () => {
  const { achievements } = useGamificationStore();

  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.unlocked),
    [achievements]
  );

  const lockedAchievements = useMemo(
    () => achievements.filter((a) => !a.unlocked),
    [achievements]
  );

  const completionPercentage = useMemo(
    () =>
      achievements.length > 0
        ? Math.floor((unlockedAchievements.length / achievements.length) * 100)
        : 0,
    [unlockedAchievements, achievements]
  );

  const achievementsByType = useMemo(() => {
    return {
      action: achievements.filter((a) => a.type === 'action'),
      savings: achievements.filter((a) => a.type === 'savings'),
      streak: achievements.filter((a) => a.type === 'streak'),
      goal: achievements.filter((a) => a.type === 'goal'),
      special: achievements.filter((a) => a.type === 'special'),
    };
  }, [achievements]);

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    completionPercentage,
    achievementsByType,
  };
};


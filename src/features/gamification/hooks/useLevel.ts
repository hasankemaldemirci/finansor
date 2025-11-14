import { useGamificationStore } from '../stores/gamificationStore';
import { getProgressPercentage } from '../utils/levelCalculator';

export const useLevel = () => {
  const { level, xp, getUserLevel, getRequiredXPForNextLevel } =
    useGamificationStore();

  const levelData = getUserLevel();
  const nextLevelXP = getRequiredXPForNextLevel();
  const progressPercentage = getProgressPercentage(xp, nextLevelXP);

  return {
    level: levelData.level,
    xp: levelData.xp,
    title: levelData.title,
    nextLevelXP,
    progressPercentage,
  };
};

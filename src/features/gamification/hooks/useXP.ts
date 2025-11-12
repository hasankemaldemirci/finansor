import { useGamificationStore } from '../stores/gamificationStore';

export const useXP = () => {
  const { xp, totalXP, addXP, xpHistory } = useGamificationStore();

  return {
    xp,
    totalXP,
    addXP,
    xpHistory,
  };
};


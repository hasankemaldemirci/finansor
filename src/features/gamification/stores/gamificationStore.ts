import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserLevel, XPGain } from '../types/level.types';
import { Achievement } from '../types/achievement.types';
import { initializeAchievements } from '../utils/achievementChecker';
import { secureStorageAdapter } from '@/shared/utils/secureStorageAdapter';

interface GamificationState {
  level: number;
  xp: number;
  totalXP: number;
  xpHistory: XPGain[];
  achievements: Achievement[];
  consecutiveDays: number;
  lastActivityDate: string | null;
  addXP: (amount: number, reason: string) => { leveledUp: boolean; newLevel?: number };
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (achievementId: string, addXP?: boolean) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  getUserLevel: () => UserLevel;
  getRequiredXPForNextLevel: () => number;
  updateActivity: () => void;
  resetProgress: () => void;
}

// XP formula: balanced exponential growth
const getRequiredXPForLevel = (level: number): number => {
  return Math.floor(50 * Math.pow(1.4, level - 1));
};

const getLevelTitle = (level: number): string => {
  if (level >= 50) return 'Finans Gurusu';
  if (level >= 40) return 'Yatırım Uzmanı';
  if (level >= 30) return 'Tasarruf Şampiyonu';
  if (level >= 20) return 'Bütçe Ustası';
  if (level >= 15) return 'Para Yöneticisi';
  if (level >= 10) return 'Tasarruf Kahramanı';
  if (level >= 5) return 'Birikim Avcısı';
  return 'Yeni Başlayan';
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      totalXP: 0,
      xpHistory: [],
      achievements: initializeAchievements(),
      consecutiveDays: 0,
      lastActivityDate: null,

      addXP: (amount, reason) => {
        const currentXP = get().xp + amount;
        const currentLevel = get().level;
        const requiredXP = getRequiredXPForLevel(currentLevel + 1);

        const xpGain: XPGain = {
          amount,
          reason,
          timestamp: new Date(),
        };

        if (currentXP >= requiredXP) {
          const newLevel = currentLevel + 1;
          const remainingXP = currentXP - requiredXP;
          
          set((state) => ({
            xp: remainingXP,
            level: newLevel,
            totalXP: state.totalXP + amount,
            xpHistory: [...state.xpHistory.slice(-50), xpGain], // Keep last 50
          }));
          
          return { leveledUp: true, newLevel };
        }

        set((state) => ({
          xp: currentXP,
          totalXP: state.totalXP + amount,
          xpHistory: [...state.xpHistory.slice(-50), xpGain],
        }));
        
        return { leveledUp: false };
      },

      setAchievements: (achievements) => {
        set({ achievements });
      },

      unlockAchievement: (achievementId, shouldAddXP = true) => {
        const achievement = get().achievements.find((a) => a.id === achievementId);
        
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedDate: new Date(), progress: 100 }
              : a
          ),
        }));

        // Add XP reward
        if (shouldAddXP && achievement && !achievement.unlocked) {
          get().addXP(achievement.xpReward, `Achievement: ${achievement.name}`);
        }
      },

      updateAchievementProgress: (achievementId, progress) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId ? { ...a, progress } : a
          ),
        }));
      },

      getUserLevel: () => {
        const { level, xp } = get();
        return {
          level,
          xp,
          title: getLevelTitle(level),
          nextLevelXP: getRequiredXPForLevel(level + 1),
        };
      },

      getRequiredXPForNextLevel: () => {
        const { level } = get();
        return getRequiredXPForLevel(level + 1);
      },

      updateActivity: () => {
        const today = new Date().toDateString();
        const lastDate = get().lastActivityDate;

        if (lastDate === today) {
          // Same day, no change
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastDate === yesterdayStr) {
          // Consecutive day
          set((state) => ({
            consecutiveDays: state.consecutiveDays + 1,
            lastActivityDate: today,
          }));
        } else {
          // Streak broken
          set({
            consecutiveDays: 1,
            lastActivityDate: today,
          });
        }
      },

      resetProgress: () => {
        set({
          level: 1,
          xp: 0,
          totalXP: 0,
          xpHistory: [],
          achievements: initializeAchievements(),
          consecutiveDays: 0,
          lastActivityDate: null,
        });
      },
    }),
    {
      name: 'gamification-storage',
      storage: secureStorageAdapter<GamificationState>(),
    }
  )
);


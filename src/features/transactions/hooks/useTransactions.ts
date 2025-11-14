import { useTransactionStore } from '../stores/transactionStore';
import { useGamificationStore } from '@/features/gamification/stores/gamificationStore';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { calculateXPFromTransaction } from '../utils/transactionCalculations';
import { toast } from '@/shared/hooks/useToast';
import { CreateTransactionDto } from '../types/transaction.types';
import { checkAchievements, calculateAchievementProgress } from '@/features/gamification/utils/achievementChecker';
import { Achievement } from '@/features/gamification/types/achievement.types';

export const useTransactions = () => {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    updateTransaction: updateTransactionInStore,
    getTransactionById,
    getTotalIncome,
    getTotalExpenses,
    getSavings,
    getStats,
  } = useTransactionStore();

  const {
    addXP,
    achievements,
    level,
    consecutiveDays,
    unlockAchievement,
    updateAchievementProgress,
    updateActivity,
  } = useGamificationStore();

  const { settings } = useSettingsStore();

  const createTransaction = (dto: CreateTransactionDto) => {
    const transaction = addTransaction(dto);
    const xpGained = calculateXPFromTransaction(transaction);

    // Update activity streak
    updateActivity();

    // Add XP
    const { leveledUp, newLevel } = addXP(
      xpGained,
      `${dto.type === 'income' ? 'Gelir' : 'Gider'} eklendi`
    );

    // Check for achievements
    const currentSavings = getSavings();
    const stats = getStats();
    const updatedTransactions = [...transactions, transaction];
    
    const newlyUnlocked = checkAchievements({
      transactions: updatedTransactions,
      currentSavings,
      consecutiveDays,
      currentLevel: level,
      achievements,
      monthlySavings: stats.monthlySavings,
      monthlyGoal: settings.monthlyGoal,
    });

    // Unlock new achievements
    const unlockedAchievements: Achievement[] = [];
    newlyUnlocked.forEach((achievement) => {
      unlockAchievement(achievement.id);
      unlockedAchievements.push(achievement);
    });

    // Update progress for locked achievements
    achievements.forEach((achievement) => {
      if (!achievement.unlocked) {
        const progress = calculateAchievementProgress(achievement, {
          transactions: updatedTransactions,
          currentSavings,
          consecutiveDays,
          currentLevel: level,
          achievements,
        });
        updateAchievementProgress(achievement.id, progress);
      }
    });

    // Only show toast if no special events (level up or achievement unlock)
    // These important events have their own modals, no need for toast
    if (!leveledUp && unlockedAchievements.length === 0) {
      toast({
        title: '✅ İşlem eklendi!',
        description: `+${xpGained} XP kazandın`,
        variant: 'success',
      });
    }
    // No toast for level up or achievement - modals handle the celebration

    return { transaction, leveledUp, newLevel, xpGained, unlockedAchievements };
  };

  const editTransaction = (id: string, dto: CreateTransactionDto) => {
    const transaction = updateTransactionInStore(id, dto);
    
    toast({
      title: '✅ İşlem güncellendi!',
      description: 'İşlem başarıyla düzenlendi',
      variant: 'success',
    });

    return { transaction };
  };

  const deleteTransaction = (id: string) => {
    removeTransaction(id);
    toast({
      title: 'İşlem silindi',
      description: 'İşlem başarıyla kaldırıldı',
    });
  };

  return {
    transactions,
    createTransaction,
    editTransaction,
    deleteTransaction,
    getTransactionById,
    getTotalIncome,
    getTotalExpenses,
    getSavings,
    getStats,
  };
};


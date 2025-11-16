import { useTransactionStore } from '../stores/transactionStore';
import { useGamificationStore } from '@/features/gamification/stores/gamificationStore';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { 
  calculateXPFromTransaction,
  calculateSavingsBonusXP 
} from '../utils/transactionCalculations';
import { toast } from '@/shared/hooks/useToast';
import { CreateTransactionDto } from '../types/transaction.types';
import {
  checkAchievements,
  calculateAchievementProgress,
} from '@/features/gamification/utils/achievementChecker';
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
    // Get previous monthly savings before adding transaction
    const previousStats = getStats();
    const previousMonthlySavings = previousStats.monthlySavings;

    const transaction = addTransaction(dto);
    const xpGained = calculateXPFromTransaction(transaction);

    // Update activity streak
    updateActivity();

    // Calculate savings bonus XP
    const stats = getStats();
    const savingsBonusXP = calculateSavingsBonusXP(
      stats.monthlySavings,
      previousMonthlySavings
    );

    // Total XP = transaction XP + savings bonus
    const totalXP = xpGained + savingsBonusXP;

    // Add XP with appropriate message
    let xpMessage = `${dto.type === 'income' ? 'Gelir' : 'Gider'} eklendi`;
    if (savingsBonusXP > 0) {
      xpMessage += ` (+${savingsBonusXP} XP tasarruf bonusu)`;
    }

    const { leveledUp, newLevel } = addXP(totalXP, xpMessage);

    // Check for achievements
    const currentSavings = getSavings();
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

    // Unlock new achievements and collect XP
    const unlockedAchievements: Achievement[] = [];
    let totalAchievementXP = 0;
    
    newlyUnlocked.forEach((achievement) => {
      // Don't add XP immediately, collect it first
      unlockAchievement(achievement.id, false); // shouldAddXP = false
      unlockedAchievements.push(achievement);
      totalAchievementXP += achievement.xpReward;
    });

    // Add all achievement XP at once to prevent multiple level ups
    if (totalAchievementXP > 0) {
      addXP(totalAchievementXP, `${unlockedAchievements.length} achievement açıldı`);
    }

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
      const xpMessage = savingsBonusXP > 0 
        ? `+${totalXP} XP kazandın (${xpGained} işlem + ${savingsBonusXP} tasarruf bonusu)`
        : `+${totalXP} XP kazandın`;
      
      toast({
        title: '✅ İşlem eklendi!',
        description: xpMessage,
        variant: 'success',
      });
    }
    // No toast for level up or achievement - modals handle the celebration

    return { transaction, leveledUp, newLevel, xpGained: totalXP, unlockedAchievements };
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

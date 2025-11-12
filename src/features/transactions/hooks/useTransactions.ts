import { useTransactionStore } from '../stores/transactionStore';
import { useGamificationStore } from '@/features/gamification/stores/gamificationStore';
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

  const createTransaction = (dto: CreateTransactionDto) => {
    console.log('💰 Creating transaction:', dto);
    
    const transaction = addTransaction(dto);
    const xpGained = calculateXPFromTransaction(transaction);

    // Update activity streak
    updateActivity();

    // Add XP
    console.log('📈 Calling addXP with:', xpGained, 'XP');
    const { leveledUp, newLevel } = addXP(
      xpGained,
      `${dto.type === 'income' ? 'Gelir' : 'Gider'} eklendi`
    );
    
    console.log('✅ Transaction complete. Level up?', leveledUp, 'New level:', newLevel);

    // Check for achievements
    const currentSavings = getSavings();
    const updatedTransactions = [...transactions, transaction];
    
    const newlyUnlocked = checkAchievements({
      transactions: updatedTransactions,
      currentSavings,
      consecutiveDays,
      currentLevel: level,
      achievements,
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

    toast({
      title: '✅ İşlem eklendi!',
      description: `+${xpGained} XP kazandın`,
      variant: 'success',
    });

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


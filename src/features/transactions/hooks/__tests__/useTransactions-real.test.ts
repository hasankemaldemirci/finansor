import { describe, it, expect, beforeEach } from 'vitest';
import { useTransactionStore } from '../../stores/transactionStore';
import { useGamificationStore } from '@/features/gamification/stores/gamificationStore';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { CreateTransactionDto } from '../../types/transaction.types';
import { calculateXPFromTransaction, calculateSavingsBonusXP } from '../../utils/transactionCalculations';
import { checkAchievements } from '@/features/gamification/utils/achievementChecker';

// Simulate the actual createTransaction flow
function simulateCreateTransaction(dto: CreateTransactionDto) {
  // Get previous stats
  const previousStats = useTransactionStore.getState().getStats();
  const previousMonthlySavings = previousStats.monthlySavings;

  // Add transaction
  const transaction = useTransactionStore.getState().addTransaction(dto);

  // Calculate XP (same as in useTransactions)
  const xpGained = calculateXPFromTransaction(transaction);

  // Update activity
  useGamificationStore.getState().updateActivity();

  // Calculate savings bonus
  const stats = useTransactionStore.getState().getStats();
  const savingsBonusXP = calculateSavingsBonusXP(
    stats.monthlySavings,
    previousMonthlySavings
  );

  // Add transaction XP
  const totalXP = xpGained + savingsBonusXP;
  const levelBeforeAchievements = useGamificationStore.getState().level;
  useGamificationStore.getState().addXP(totalXP, 'Transaction added');

  // Check achievements
  const transactions = useTransactionStore.getState().transactions;
  const currentSavings = useTransactionStore.getState().getSavings();
  const { level, consecutiveDays, achievements } = useGamificationStore.getState();

  const newlyUnlocked = checkAchievements({
    transactions,
    currentSavings,
    consecutiveDays,
    currentLevel: level,
    achievements,
    monthlySavings: stats.monthlySavings,
    monthlyGoal: useSettingsStore.getState().settings.monthlyGoal,
  });

  // Unlock achievements (collect XP first)
  let totalAchievementXP = 0;
  newlyUnlocked.forEach((achievement) => {
    useGamificationStore.getState().unlockAchievement(achievement.id, false);
    totalAchievementXP += achievement.xpReward;
  });

  // Add all achievement XP at once
  if (totalAchievementXP > 0) {
    useGamificationStore.getState().addXP(totalAchievementXP, `${newlyUnlocked.length} achievement açıldı`);
  }

  return {
    transaction,
    xpGained,
    savingsBonusXP,
    totalXP,
    totalAchievementXP,
    newlyUnlocked,
    levelBeforeAchievements,
    finalLevel: useGamificationStore.getState().level,
    finalXP: useGamificationStore.getState().xp,
  };
}

describe('useTransactions - Real Large Income Scenario', () => {
  beforeEach(() => {
    // Reset all stores
    useTransactionStore.getState().clearAllTransactions();
    useGamificationStore.getState().resetProgress();
    useSettingsStore.getState().resetSettings();
    localStorage.clear();
  });

  it('should NOT reach level 4 with single large income', () => {
    const dto: CreateTransactionDto = {
      type: 'income',
      amount: 110000,
      category: 'salary',
      description: 'Large Income Test',
      date: new Date(),
    };

    const initialLevel = useGamificationStore.getState().level;
    expect(initialLevel).toBe(1);

    const result = simulateCreateTransaction(dto);

    console.log('=== LARGE INCOME ANALYSIS ===');
    console.log('Transaction XP:', result.xpGained);
    console.log('Savings Bonus XP:', result.savingsBonusXP);
    console.log('Total Transaction XP:', result.totalXP);
    console.log('Level before achievements:', result.levelBeforeAchievements);
    console.log('Achievement XP:', result.totalAchievementXP);
    console.log('Unlocked Achievements:', result.newlyUnlocked.map(a => ({ id: a.id, name: a.name, xp: a.xpReward })));
    console.log('Final Level:', result.finalLevel);
    console.log('Final XP:', result.finalXP);

    // Calculate total XP
    const totalXP = result.totalXP + result.totalAchievementXP;
    console.log('TOTAL XP:', totalXP);
    console.log('Level increase:', result.finalLevel - result.levelBeforeAchievements);

    // Should NOT reach level 4
    expect(result.finalLevel).toBeLessThan(4);
    expect(result.finalLevel).toBeLessThanOrEqual(2);

    // Verify XP breakdown
    expect(result.xpGained).toBe(35); // Transaction XP
    expect(result.savingsBonusXP).toBe(30); // Savings bonus
    expect(result.totalXP).toBe(65); // Transaction + Savings
    expect(totalXP).toBeLessThan(150); // Total should be reasonable
  });

  it('should track all XP sources correctly', () => {
    const dto: CreateTransactionDto = {
      type: 'income',
      amount: 110000,
      category: 'salary',
      description: 'Large Income Test',
      date: new Date(),
    };

    const result = simulateCreateTransaction(dto);

    // Verify each XP source
    expect(result.xpGained).toBeGreaterThan(0);
    expect(result.savingsBonusXP).toBeGreaterThanOrEqual(0);
    expect(result.totalAchievementXP).toBeGreaterThanOrEqual(0);

    // Total should be reasonable
    const totalXP = result.totalXP + result.totalAchievementXP;
    expect(totalXP).toBeLessThan(200); // Should not exceed 200 XP
  });
});


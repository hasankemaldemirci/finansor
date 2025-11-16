import { describe, it, expect } from 'vitest';
import { checkAchievements } from '../achievementChecker';
import { Transaction } from '@/features/transactions/types/transaction.types';
import { initializeAchievements } from '../achievementChecker';

describe('AchievementChecker - Savings Milestones', () => {
  it('should NOT unlock savings milestones on first transaction (30 day requirement)', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 110000,
        category: 'salary',
        description: 'Large Income Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      },
    ];

    const achievements = initializeAchievements();
    const context = {
      transactions,
      currentSavings: 110000,
      consecutiveDays: 1,
      currentLevel: 1,
      achievements,
      monthlySavings: 110000,
      monthlyGoal: 0,
    };

    const newlyUnlocked = checkAchievements(context);

    // Savings milestones should NOT unlock (30 day requirement)
    const savingsMilestones = newlyUnlocked.filter(
      (a) => a.id.startsWith('savings-')
    );

    expect(savingsMilestones.length).toBe(0);
  });

  it('should unlock first-income and big-saver achievements for large income', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 110000,
        category: 'salary',
        description: 'Large Income Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      },
    ];

    const achievements = initializeAchievements();
    const context = {
      transactions,
      currentSavings: 110000,
      consecutiveDays: 1,
      currentLevel: 1,
      achievements,
      monthlySavings: 110000,
      monthlyGoal: 0,
    };

    const newlyUnlocked = checkAchievements(context);

    // Should unlock first-income
    const firstIncome = newlyUnlocked.find((a) => a.id === 'first-income');
    expect(firstIncome).toBeDefined();

    // Should unlock big-saver (10k+ income)
    const bigSaver = newlyUnlocked.find((a) => a.id === 'big-saver');
    expect(bigSaver).toBeDefined();

    // Should NOT unlock savings milestones (30 day requirement)
    const savingsMilestones = newlyUnlocked.filter((a) =>
      a.id.startsWith('savings-')
    );
    expect(savingsMilestones.length).toBe(0);
  });

  it('should calculate total XP for large income correctly', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 110000,
        category: 'salary',
        description: 'Large Income Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      },
    ];

    const achievements = initializeAchievements();
    const context = {
      transactions,
      currentSavings: 110000,
      consecutiveDays: 1,
      currentLevel: 1,
      achievements,
      monthlySavings: 110000,
      monthlyGoal: 0,
    };

    const newlyUnlocked = checkAchievements(context);

    // Calculate total achievement XP
    const totalAchievementXP = newlyUnlocked.reduce(
      (sum, a) => sum + a.xpReward,
      0
    );

    // Should only be first-income (15) + big-saver (15) = 30 XP
    expect(totalAchievementXP).toBe(30);

    // Transaction XP: 35
    // Savings bonus: 30
    // Achievement XP: 30
    // Total: 95 XP
    const totalXP = 35 + 30 + 30;
    expect(totalXP).toBe(95);
  });
});


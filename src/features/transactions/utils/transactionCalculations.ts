import { Transaction } from '../types/transaction.types';

// XP calculations - Rewards income tracking, minimal reward for expense tracking
export const calculateXPFromTransaction = (
  transaction: Transaction
): number => {
  // Income: Base XP + logarithmic amount-based bonus
  // Expense: Minimal XP (only for tracking, not rewarding spending)
  if (transaction.type === 'income') {
    const baseXP = 15;
    // Logarithmic bonus: sqrt(amount / 1000) * 2, max 20 bonus
    // This prevents huge amounts from giving excessive XP
    // Examples:
    //   1k = 2 XP, 10k = 6 XP, 50k = 14 XP, 100k = 20 XP (max)
    const amountBonus = Math.min(20, Math.floor(Math.sqrt(transaction.amount / 1000) * 2));
    return baseXP + amountBonus;
  } else {
    // Expenses: Very minimal XP (2 XP) - just for tracking, not rewarding
    return 2;
  }
};

// Calculate savings bonus XP when positive savings occur
export const calculateSavingsBonusXP = (
  monthlySavings: number,
  previousMonthlySavings: number
): number => {
  // Only give bonus if savings increased
  if (monthlySavings <= previousMonthlySavings || monthlySavings <= 0) {
    return 0;
  }

  const savingsIncrease = monthlySavings - previousMonthlySavings;
  
  // Logarithmic bonus: sqrt(increase / 100) * 1.5, max 30 bonus
  // This prevents huge savings from giving excessive XP
  // Examples:
  //   1k increase = 5 XP, 10k = 15 XP, 50k = 30 XP (max)
  const bonusXP = Math.min(30, Math.floor(Math.sqrt(savingsIncrease / 100) * 1.5));
  
  return bonusXP;
};

// Calculate category distribution
export const getCategoryDistribution = (
  transactions: Transaction[]
): Record<string, number> => {
  return transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    },
    {} as Record<string, number>
  );
};

// Get recent transactions (last N days)
export const getRecentTransactions = (
  transactions: Transaction[],
  days: number = 7
): Transaction[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return transactions
    .filter((t) => new Date(t.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

import { Transaction } from '../types/transaction.types';

// XP calculations - Fixed XP per transaction (amount independent)
export const calculateXPFromTransaction = (transaction: Transaction): number => {
  // Fixed XP rewards to encourage tracking all transactions
  const incomeXP = 15;  // Slightly more for income tracking
  const expenseXP = 10; // Standard for expenses
  
  const xpGained = transaction.type === 'income' ? incomeXP : expenseXP;
  
  return xpGained;
};

// Calculate category distribution
export const getCategoryDistribution = (
  transactions: Transaction[]
): Record<string, number> => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);
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


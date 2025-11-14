import { Transaction } from '../types/transaction.types';
import { TransactionType } from '@/shared/types/common.types';

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export const getMonthlyStats = (
  transactions: Transaction[],
  months: number = 6
): MonthlyData[] => {
  const now = new Date();
  const monthlyMap = new Map<string, { income: number; expense: number }>();

  // Initialize last N months
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(key, { income: 0, expense: 0 });
  }

  // Aggregate transactions by month
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (monthlyMap.has(key)) {
      const data = monthlyMap.get(key)!;
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else {
        data.expense += transaction.amount;
      }
    }
  });

  // Convert to array with Turkish month names
  const monthNames = [
    'Oca',
    'Şub',
    'Mar',
    'Nis',
    'May',
    'Haz',
    'Tem',
    'Ağu',
    'Eyl',
    'Eki',
    'Kas',
    'Ara',
  ];

  return Array.from(monthlyMap.entries()).map(([key, data]) => {
    const [year, month] = key.split('-');
    const monthIndex = parseInt(month) - 1;
    return {
      month: `${monthNames[monthIndex]} ${year.slice(2)}`,
      income: data.income,
      expense: data.expense,
      savings: data.income - data.expense,
    };
  });
};

export const getCategoryStats = (
  transactions: Transaction[],
  type: TransactionType
): CategoryData[] => {
  const categoryMap = new Map<string, number>();
  let total = 0;

  // Aggregate by category
  transactions
    .filter((t) => t.type === type)
    .forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, current + transaction.amount);
      total += transaction.amount;
    });

  // Convert to array with percentages
  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category: getCategoryLabel(category),
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getTopCategories = (
  transactions: Transaction[],
  type: TransactionType,
  limit: number = 5
): CategoryData[] => {
  return getCategoryStats(transactions, type).slice(0, limit);
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    salary: 'Maaş',
    freelance: 'Serbest Çalışma',
    investment: 'Yatırım',
    gift: 'Hediye',
    rent: 'Kira',
    groceries: 'Market',
    transport: 'Ulaşım',
    entertainment: 'Eğlence',
    bills: 'Faturalar',
    health: 'Sağlık',
    shopping: 'Alışveriş',
    education: 'Eğitim',
    other: 'Diğer',
  };
  return labels[category] || category;
};

export const getRecentTrend = (
  transactions: Transaction[],
  days: number = 30
): 'up' | 'down' | 'stable' => {
  const now = new Date();
  const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const midPoint = new Date(now.getTime() - (days / 2) * 24 * 60 * 60 * 1000);

  let firstHalf = 0;
  let secondHalf = 0;

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    if (date >= periodStart && date < midPoint) {
      firstHalf +=
        transaction.type === 'income'
          ? transaction.amount
          : -transaction.amount;
    } else if (date >= midPoint && date <= now) {
      secondHalf +=
        transaction.type === 'income'
          ? transaction.amount
          : -transaction.amount;
    }
  });

  const diff = secondHalf - firstHalf;
  const threshold = firstHalf * 0.1; // 10% change threshold

  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return 'stable';
};

import { Transaction } from '../types/transaction.types';
import { getCategoryLabel } from './statisticsCalculations';
import i18n from '@/shared/lib/i18n';

export interface SavingsTip {
  category: string;
  message: string;
  icon: string;
  priority: number;
}

const getTips = (): Record<string, string[]> => {
  return {
    groceries: [
      i18n.t('tips.groceries.0'),
      i18n.t('tips.groceries.1'),
      i18n.t('tips.groceries.2'),
    ],
    transport: [
      i18n.t('tips.transport.0'),
      i18n.t('tips.transport.1'),
      i18n.t('tips.transport.2'),
    ],
    entertainment: [
      i18n.t('tips.entertainment.0'),
      i18n.t('tips.entertainment.1'),
      i18n.t('tips.entertainment.2'),
    ],
    shopping: [
      i18n.t('tips.shopping.0'),
      i18n.t('tips.shopping.1'),
      i18n.t('tips.shopping.2'),
    ],
    bills: [
      i18n.t('tips.bills.0'),
      i18n.t('tips.bills.1'),
      i18n.t('tips.bills.2'),
    ],
    health: [
      i18n.t('tips.health.0'),
      i18n.t('tips.health.1'),
      i18n.t('tips.health.2'),
    ],
    rent: [
      i18n.t('tips.rent.0'),
      i18n.t('tips.rent.1'),
      i18n.t('tips.rent.2'),
    ],
    education: [
      i18n.t('tips.education.0'),
      i18n.t('tips.education.1'),
      i18n.t('tips.education.2'),
    ],
  };
};

const getGeneralTips = () => [
  {
    condition: (expenses: number, income: number) => expenses > income * 0.8,
    message: i18n.t('tips.general.highExpenses80'),
    icon: '⚠️',
  },
  {
    condition: (expenses: number, income: number) => expenses > income * 0.6,
    message: i18n.t('tips.general.highExpenses60'),
    icon: '💡',
  },
];

export function getSavingsTips(transactions: Transaction[]): SavingsTip[] {
  const tips: SavingsTip[] = [];
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  // Get current month transactions
  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date) >= currentMonth && new Date(t.date) <= endOfMonth
  );

  // Calculate total income and expenses
  const totalIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Category-based tips
  const categoryExpenses = new Map<string, number>();
  monthlyTransactions
    .filter((t) => t.type === 'expense')
    .forEach((transaction) => {
      const current = categoryExpenses.get(transaction.category) || 0;
      categoryExpenses.set(transaction.category, current + transaction.amount);
    });

  // Find categories with high spending (more than 20% of total expenses)
  const threshold = totalExpenses * 0.2;
  const TIPS = getTips();
  categoryExpenses.forEach((amount, category) => {
    if (amount > threshold && TIPS[category]) {
      const categoryLabel = getCategoryLabel(category);
      const randomTip =
        TIPS[category][Math.floor(Math.random() * TIPS[category].length)];
      tips.push({
        category: categoryLabel,
        message: randomTip,
        icon: '💡',
        priority: amount / totalExpenses, // Higher spending = higher priority
      });
    }
  });

  // General tips
  const GENERAL_TIPS = getGeneralTips();
  GENERAL_TIPS.forEach((tip) => {
    if (tip.condition(totalExpenses, totalIncome)) {
      tips.push({
        category: i18n.t('transactions.general'),
        message: tip.message,
        icon: tip.icon,
        priority: 0.5,
      });
    }
  });

  // Sort by priority (highest first)
  return tips.sort((a, b) => b.priority - a.priority).slice(0, 3); // Return top 3 tips
}

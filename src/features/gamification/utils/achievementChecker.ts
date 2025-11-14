import { Achievement } from '../types/achievement.types';
import { Transaction } from '@/features/transactions/types/transaction.types';
import { ACHIEVEMENTS } from '../constants/achievements';

export interface AchievementCheckContext {
  transactions: Transaction[];
  currentSavings: number;
  consecutiveDays: number;
  currentLevel: number;
  achievements: Achievement[];
  monthlySavings?: number;
  monthlyGoal?: number;
}

// Initialize achievements from constants
export function initializeAchievements(): Achievement[] {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: false,
    unlockedDate: null,
    progress: 0,
  }));
}

// Check all achievements and return newly unlocked ones
export function checkAchievements(
  context: AchievementCheckContext
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  context.achievements.forEach((achievement) => {
    if (achievement.unlocked) return;

    const isUnlocked = checkSingleAchievement(achievement, context);
    if (isUnlocked) {
      newlyUnlocked.push(achievement);
    }
  });

  return newlyUnlocked;
}

// Check single achievement
function checkSingleAchievement(
  achievement: Achievement,
  context: AchievementCheckContext
): boolean {
  const { transactions, currentSavings, consecutiveDays, currentLevel } = context;

  switch (achievement.id) {
    // First actions
    case 'first-income':
      return transactions.some((t) => t.type === 'income');

    case 'first-expense':
      return transactions.some((t) => t.type === 'expense');

    // Transaction milestones
    case 'transactions-10':
      return transactions.length >= 10;
    case 'transactions-50':
      return transactions.length >= 50;
    case 'transactions-100':
      return transactions.length >= 100;
    case 'transactions-500':
      return transactions.length >= 500;

    // Savings milestones - require minimum 30 days of maintaining savings
    case 'savings-1000':
      return checkSavingsWithDuration(transactions, 1000, 30);
    case 'savings-5000':
      return checkSavingsWithDuration(transactions, 5000, 30);
    case 'savings-10000':
      return checkSavingsWithDuration(transactions, 10000, 30);
    case 'savings-50000':
      return checkSavingsWithDuration(transactions, 50000, 30);
    case 'savings-100000':
      return checkSavingsWithDuration(transactions, 100000, 30);

    // Streak achievements
    case 'streak-3':
      return consecutiveDays >= 3;
    case 'streak-7':
      return consecutiveDays >= 7;
    case 'streak-30':
      return consecutiveDays >= 30;
    case 'streak-100':
      return consecutiveDays >= 100;

    // Level achievements
    case 'level-5':
      return currentLevel >= 5;
    case 'level-10':
      return currentLevel >= 10;
    case 'level-25':
      return currentLevel >= 25;
    case 'level-50':
      return currentLevel >= 50;

    // Special achievements
    case 'positive-month':
      return checkPositiveMonth(transactions);
    case 'big-saver':
      return transactions.some((t) => t.type === 'income' && t.amount >= 10000);
    case 'all-categories':
      return checkAllCategories(transactions);
    case 'early-bird':
      return checkTimeRange(transactions, 6, 8);
    case 'night-owl':
      return checkTimeRange(transactions, 23, 1);

    case 'monthly-goal':
      // Monthly goal should be checked at the end of the month
      if (!context.monthlySavings || !context.monthlyGoal || context.monthlyGoal === 0) {
        return false;
      }
      // Check if we're at the end of the month (last 3 days) or past the month
      const now = new Date();
      const dayOfMonth = now.getDate();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const isEndOfMonth = dayOfMonth >= daysInMonth - 2;
      
      // Only unlock if goal is reached AND we're at the end of the month
      return context.monthlySavings >= context.monthlyGoal && isEndOfMonth;

    default:
      return false;
  }
}

// Helper functions
function checkSavingsWithDuration(
  transactions: Transaction[],
  targetAmount: number,
  minDays: number
): boolean {
  if (transactions.length === 0) return false;
  
  // Calculate current savings
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const currentSavings = totalIncome - totalExpenses;
  
  // Must reach target amount
  if (currentSavings < targetAmount) return false;
  
  // Find first transaction date to check minimum duration
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstTransactionDate = new Date(sortedTransactions[0].date);
  const daysSinceFirst = Math.floor(
    (Date.now() - firstTransactionDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Savings must be maintained for at least minDays since first transaction
  return daysSinceFirst >= minDays;
}

function checkPositiveMonth(transactions: Transaction[]): boolean {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= monthStart && date <= monthEnd;
  });

  const income = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return income > expenses && expenses > 0;
}

function checkAllCategories(transactions: Transaction[]): boolean {
  const allCategories = [
    'salary',
    'freelance',
    'investment',
    'gift',
    'other',
    'rent',
    'groceries',
    'transport',
    'entertainment',
    'bills',
    'health',
    'shopping',
    'education',
  ];

  const usedCategories = new Set(transactions.map((t) => t.category));
  return allCategories.every((cat) => usedCategories.has(cat));
}

function checkTimeRange(
  transactions: Transaction[],
  startHour: number,
  endHour: number
): boolean {
  return transactions.some((t) => {
    const hour = new Date(t.createdAt).getHours();
    if (startHour < endHour) {
      return hour >= startHour && hour < endHour;
    } else {
      // Crosses midnight
      return hour >= startHour || hour < endHour;
    }
  });
}

// Calculate progress for an achievement
export function calculateAchievementProgress(
  achievement: Achievement,
  context: AchievementCheckContext
): number {
  if (achievement.unlocked) return 100;

  const { transactions, currentSavings, consecutiveDays, currentLevel } = context;
  const requirement = typeof achievement.requirement === 'number' 
    ? achievement.requirement 
    : achievement.requirement.target;

  switch (achievement.type) {
    case 'action':
      if (achievement.id.startsWith('transactions-')) {
        return Math.min(100, (transactions.length / requirement) * 100);
      }
      return 0;

    case 'savings':
      return Math.min(100, (currentSavings / requirement) * 100);

    case 'streak':
      return Math.min(100, (consecutiveDays / requirement) * 100);

    case 'goal':
      return Math.min(100, (currentLevel / requirement) * 100);

    default:
      return 0;
  }
}


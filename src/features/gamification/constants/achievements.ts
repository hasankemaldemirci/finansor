import { Achievement } from '../types/achievement.types';

const createAchievement = (
  config: Omit<Achievement, 'name' | 'description' | 'unlocked' | 'unlockedDate' | 'progress'>
): Omit<Achievement, 'unlocked' | 'unlockedDate' | 'progress'> => ({
  ...config,
  name: `achievements.list.${config.id}.name`,
  description: `achievements.list.${config.id}.description`,
});

export const ACHIEVEMENTS: Omit<
  Achievement,
  'unlocked' | 'unlockedDate' | 'progress'
>[] = [
  // First Steps
  createAchievement({
    id: 'first-income',
    icon: '💰',
    type: 'action',
    requirement: 1,
    xpReward: 15, // Reduced from 25 - first step should be modest
  }),
  createAchievement({
    id: 'first-expense',
    icon: '💸',
    type: 'action',
    requirement: 1,
    xpReward: 10, // Lower reward for expense tracking
  }),

  // Transaction Milestones
  createAchievement({
    id: 'transactions-10',
    icon: '🌱',
    type: 'action',
    requirement: 10,
    xpReward: 50, // Early milestone
  }),
  createAchievement({
    id: 'transactions-50',
    icon: '🌿',
    type: 'action',
    requirement: 50,
    xpReward: 150, // Mid milestone
  }),
  createAchievement({
    id: 'transactions-100',
    icon: '🌳',
    type: 'action',
    requirement: 100,
    xpReward: 300, // High milestone
  }),
  createAchievement({
    id: 'transactions-500',
    icon: '🏆',
    type: 'action',
    requirement: 500,
    xpReward: 500, // Master milestone
  }),

  // Savings Milestones - Balanced rewards (reduced to prevent excessive leveling)
  createAchievement({
    id: 'savings-1000',
    icon: '💵',
    type: 'savings',
    requirement: 1000,
    xpReward: 50, // Reduced from 100 - milestone achievements should be meaningful but not excessive
  }),
  createAchievement({
    id: 'savings-5000',
    icon: '💴',
    type: 'savings',
    requirement: 5000,
    xpReward: 75, // Reduced from 200
  }),
  createAchievement({
    id: 'savings-10000',
    icon: '💶',
    type: 'savings',
    requirement: 10000,
    xpReward: 100, // Reduced from 350
  }),
  createAchievement({
    id: 'savings-50000',
    icon: '💷',
    type: 'savings',
    requirement: 50000,
    xpReward: 150, // Reduced from 500
  }),
  createAchievement({
    id: 'savings-100000',
    icon: '💎',
    type: 'savings',
    requirement: 100000,
    xpReward: 200, // Reduced from 750
  }),

  // Streak Achievements - Rewards consistency
  createAchievement({
    id: 'streak-3',
    icon: '🔥',
    type: 'streak',
    requirement: 3,
    xpReward: 50, // Early consistency
  }),
  createAchievement({
    id: 'streak-7',
    icon: '⭐',
    type: 'streak',
    requirement: 7,
    xpReward: 150, // Weekly consistency
  }),
  createAchievement({
    id: 'streak-30',
    icon: '🌟',
    type: 'streak',
    requirement: 30,
    xpReward: 400, // Monthly discipline
  }),
  createAchievement({
    id: 'streak-100',
    icon: '✨',
    type: 'streak',
    requirement: 100,
    xpReward: 600, // Exceptional consistency
  }),

  // Level Achievements - Rewards progression
  createAchievement({
    id: 'level-5',
    icon: '🎖️',
    type: 'goal',
    requirement: 5,
    xpReward: 75, // Early level
  }),
  createAchievement({
    id: 'level-10',
    icon: '🏅',
    type: 'goal',
    requirement: 10,
    xpReward: 150, // Mid level
  }),
  createAchievement({
    id: 'level-25',
    icon: '🥇',
    type: 'goal',
    requirement: 25,
    xpReward: 300, // High level
  }),
  createAchievement({
    id: 'level-50',
    icon: '👑',
    type: 'goal',
    requirement: 50,
    xpReward: 500, // Halfway milestone
  }),

  // Special Achievements
  createAchievement({
    id: 'positive-month',
    icon: '📈',
    type: 'special',
    requirement: 1,
    xpReward: 50, // Reduced from 200 - monthly achievement, not per transaction
  }),
  createAchievement({
    id: 'big-saver',
    icon: '🎉',
    type: 'special',
    requirement: 10000,
    xpReward: 15, // Reduced from 25 - large income already gives transaction bonus
  }),
  createAchievement({
    id: 'all-categories',
    icon: '🎨',
    type: 'special',
    requirement: 1,
    xpReward: 250, // Comprehensive tracking
  }),
  createAchievement({
    id: 'early-bird',
    icon: '🌅',
    type: 'special',
    requirement: 1,
    xpReward: 30, // Fun achievement
  }),
  createAchievement({
    id: 'night-owl',
    icon: '🦉',
    type: 'special',
    requirement: 1,
    xpReward: 30, // Fun achievement
  }),
  createAchievement({
    id: 'monthly-goal',
    icon: '🎯',
    type: 'goal',
    requirement: 1,
    xpReward: 300, // Important goal achievement
  }),
  // Monthly Goal Progress Milestones - Reduced XP to prevent excessive leveling
  createAchievement({
    id: 'monthly-goal-25',
    icon: '📊',
    type: 'goal',
    requirement: 0.25,
    xpReward: 10, // Reduced from 50 - early progress milestone
  }),
  createAchievement({
    id: 'monthly-goal-50',
    icon: '📈',
    type: 'goal',
    requirement: 0.5,
    xpReward: 15, // Reduced from 100 - halfway progress
  }),
  createAchievement({
    id: 'monthly-goal-75',
    icon: '🚀',
    type: 'goal',
    requirement: 0.75,
    xpReward: 20, // Reduced from 150 - near completion
  }),
];

export const ACHIEVEMENT_CATEGORIES = {
  action: { labelKey: 'achievements.categories.action', color: 'text-blue-500' },
  savings: { labelKey: 'achievements.categories.savings', color: 'text-green-500' },
  streak: { labelKey: 'achievements.categories.streak', color: 'text-orange-500' },
  goal: { labelKey: 'achievements.categories.goal', color: 'text-purple-500' },
  special: { labelKey: 'achievements.categories.special', color: 'text-yellow-500' },
};

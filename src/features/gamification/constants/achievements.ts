import { Achievement } from '../types/achievement.types';

export const ACHIEVEMENTS: Omit<
  Achievement,
  'unlocked' | 'unlockedDate' | 'progress'
>[] = [
  // First Steps
  {
    id: 'first-income',
    name: 'İlk Gelir',
    description: 'İlk gelir kaydını ekle',
    icon: '💰',
    type: 'action',
    requirement: 1,
    xpReward: 15, // Reduced from 25 - first step should be modest
  },
  {
    id: 'first-expense',
    name: 'İlk Gider',
    description: 'İlk gider kaydını ekle',
    icon: '💸',
    type: 'action',
    requirement: 1,
    xpReward: 10, // Lower reward for expense tracking
  },

  // Transaction Milestones
  {
    id: 'transactions-10',
    name: 'Başlangıç',
    description: '10 işlem ekle',
    icon: '🌱',
    type: 'action',
    requirement: 10,
    xpReward: 50, // Early milestone
  },
  {
    id: 'transactions-50',
    name: 'Deneyimli',
    description: '50 işlem ekle',
    icon: '🌿',
    type: 'action',
    requirement: 50,
    xpReward: 150, // Mid milestone
  },
  {
    id: 'transactions-100',
    name: 'Profesyonel',
    description: '100 işlem ekle',
    icon: '🌳',
    type: 'action',
    requirement: 100,
    xpReward: 300, // High milestone
  },
  {
    id: 'transactions-500',
    name: 'Master',
    description: '500 işlem ekle',
    icon: '🏆',
    type: 'action',
    requirement: 500,
    xpReward: 500, // Master milestone
  },

  // Savings Milestones - Balanced rewards (reduced to prevent excessive leveling)
  {
    id: 'savings-1000',
    name: 'İlk Bin',
    description: '1.000 TL tasarruf et',
    icon: '💵',
    type: 'savings',
    requirement: 1000,
    xpReward: 50, // Reduced from 100 - milestone achievements should be meaningful but not excessive
  },
  {
    id: 'savings-5000',
    name: 'Beş Bin Kulübü',
    description: '5.000 TL tasarruf et',
    icon: '💴',
    type: 'savings',
    requirement: 5000,
    xpReward: 75, // Reduced from 200
  },
  {
    id: 'savings-10000',
    name: 'On Bin Başarısı',
    description: '10.000 TL tasarruf et',
    icon: '💶',
    type: 'savings',
    requirement: 10000,
    xpReward: 100, // Reduced from 350
  },
  {
    id: 'savings-50000',
    name: 'Tasarruf Kahramanı',
    description: '50.000 TL tasarruf et',
    icon: '💷',
    type: 'savings',
    requirement: 50000,
    xpReward: 150, // Reduced from 500
  },
  {
    id: 'savings-100000',
    name: 'Altı Haneli',
    description: '100.000 TL tasarruf et',
    icon: '💎',
    type: 'savings',
    requirement: 100000,
    xpReward: 200, // Reduced from 750
  },

  // Streak Achievements - Rewards consistency
  {
    id: 'streak-3',
    name: 'Kararlı',
    description: '3 gün üst üste işlem ekle',
    icon: '🔥',
    type: 'streak',
    requirement: 3,
    xpReward: 50, // Early consistency
  },
  {
    id: 'streak-7',
    name: 'Haftalık Devamlılık',
    description: '7 gün üst üste işlem ekle',
    icon: '⭐',
    type: 'streak',
    requirement: 7,
    xpReward: 150, // Weekly consistency
  },
  {
    id: 'streak-30',
    name: 'Aylık Disiplin',
    description: '30 gün üst üste işlem ekle',
    icon: '🌟',
    type: 'streak',
    requirement: 30,
    xpReward: 400, // Monthly discipline
  },
  {
    id: 'streak-100',
    name: 'Demir İrade',
    description: '100 gün üst üste işlem ekle',
    icon: '✨',
    type: 'streak',
    requirement: 100,
    xpReward: 600, // Exceptional consistency
  },

  // Level Achievements - Rewards progression
  {
    id: 'level-5',
    name: 'Seviye 5',
    description: "Seviye 5'e ulaş",
    icon: '🎖️',
    type: 'goal',
    requirement: 5,
    xpReward: 75, // Early level
  },
  {
    id: 'level-10',
    name: 'Seviye 10',
    description: "Seviye 10'a ulaş",
    icon: '🏅',
    type: 'goal',
    requirement: 10,
    xpReward: 150, // Mid level
  },
  {
    id: 'level-25',
    name: 'Seviye 25',
    description: "Seviye 25'e ulaş",
    icon: '🥇',
    type: 'goal',
    requirement: 25,
    xpReward: 300, // High level
  },
  {
    id: 'level-50',
    name: 'Yarı Yol',
    description: "Seviye 50'ye ulaş",
    icon: '👑',
    type: 'goal',
    requirement: 50,
    xpReward: 500, // Halfway milestone
  },

  // Special Achievements
  {
    id: 'positive-month',
    name: 'Pozitif Ay',
    description: 'Bir ayda giderden fazla gelir',
    icon: '📈',
    type: 'special',
    requirement: 1,
    xpReward: 50, // Reduced from 200 - monthly achievement, not per transaction
  },
  {
    id: 'big-saver',
    name: 'Büyük Tasarruf',
    description: 'Tek seferde 10.000 TL gelir ekle',
    icon: '🎉',
    type: 'special',
    requirement: 10000,
    xpReward: 15, // Reduced from 25 - large income already gives transaction bonus
  },
  {
    id: 'all-categories',
    name: 'Çeşitlilik',
    description: 'Tüm kategorileri kullan',
    icon: '🎨',
    type: 'special',
    requirement: 1,
    xpReward: 250, // Comprehensive tracking
  },
  {
    id: 'early-bird',
    name: 'Sabahçı',
    description: 'Sabah 6-8 arası işlem ekle',
    icon: '🌅',
    type: 'special',
    requirement: 1,
    xpReward: 30, // Fun achievement
  },
  {
    id: 'night-owl',
    name: 'Gece Kuşu',
    description: 'Gece 23-01 arası işlem ekle',
    icon: '🦉',
    type: 'special',
    requirement: 1,
    xpReward: 30, // Fun achievement
  },
  {
    id: 'monthly-goal',
    name: 'Aylık Hedef',
    description: 'Aylık tasarruf hedefinize ulaşın',
    icon: '🎯',
    type: 'goal',
    requirement: 1,
    xpReward: 300, // Important goal achievement
  },
  // Monthly Goal Progress Milestones - Reduced XP to prevent excessive leveling
  {
    id: 'monthly-goal-25',
    name: 'Hedefin %25\'i',
    description: 'Aylık tasarruf hedefinizin %25\'ine ulaşın',
    icon: '📊',
    type: 'goal',
    requirement: 0.25,
    xpReward: 10, // Reduced from 50 - early progress milestone
  },
  {
    id: 'monthly-goal-50',
    name: 'Hedefin Yarısı',
    description: 'Aylık tasarruf hedefinizin %50\'sine ulaşın',
    icon: '📈',
    type: 'goal',
    requirement: 0.5,
    xpReward: 15, // Reduced from 100 - halfway progress
  },
  {
    id: 'monthly-goal-75',
    name: 'Hedefin %75\'i',
    description: 'Aylık tasarruf hedefinizin %75\'ine ulaşın',
    icon: '🚀',
    type: 'goal',
    requirement: 0.75,
    xpReward: 20, // Reduced from 150 - near completion
  },
];

export const ACHIEVEMENT_CATEGORIES = {
  action: { label: 'İşlem', color: 'text-blue-500' },
  savings: { label: 'Tasarruf', color: 'text-green-500' },
  streak: { label: 'Süreklilik', color: 'text-orange-500' },
  goal: { label: 'Hedef', color: 'text-purple-500' },
  special: { label: 'Özel', color: 'text-yellow-500' },
};

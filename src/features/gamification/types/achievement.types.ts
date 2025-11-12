export type AchievementType =
  | 'savings'
  | 'streak'
  | 'action'
  | 'goal'
  | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AchievementType;
  requirement: number | AchievementRequirement;
  unlocked: boolean;
  unlockedDate: Date | null;
  progress?: number;
  xpReward: number;
}

export interface AchievementRequirement {
  type: 'amount' | 'count' | 'streak' | 'percentage';
  target: number;
  category?: string;
}


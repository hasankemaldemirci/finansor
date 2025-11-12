import { Currency, Theme } from './common.types';

export interface UserSettings {
  theme: Theme;
  notifications: boolean;
  currency: Currency;
  monthlyGoal: number;
  language: string;
}

export interface UserData {
  id: string;
  level: number;
  xp: number;
  totalSavings: number;
  currentBalance: number;
  joinDate: Date;
  lastLoginDate: Date;
  consecutiveDays: number;
  settings: UserSettings;
}


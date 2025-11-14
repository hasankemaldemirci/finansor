export interface UserLevel {
  level: number;
  xp: number;
  title: string;
  nextLevelXP: number;
}

export interface LevelConfig {
  level: number;
  requiredXP: number;
  title: string;
  icon: string;
}

export interface XPGain {
  amount: number;
  reason: string;
  timestamp: Date;
}

import { LevelConfig } from '../types/level.types';

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Yeni Başlayan',
  5: 'Birikim Avcısı',
  10: 'Tasarruf Kahramanı',
  15: 'Para Yöneticisi',
  20: 'Bütçe Ustası',
  30: 'Tasarruf Şampiyonu',
  40: 'Yatırım Uzmanı',
  50: 'Finans Gurusu',
};

export function getLevelTitle(level: number): string {
  const levels = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const lvl of levels) {
    if (level >= lvl) {
      return LEVEL_TITLES[lvl];
    }
  }

  return LEVEL_TITLES[1];
}

export function getLevelIcon(level: number): string {
  if (level >= 50) return '👑';
  if (level >= 40) return '💎';
  if (level >= 30) return '🏆';
  if (level >= 20) return '⭐';
  if (level >= 10) return '🎯';
  if (level >= 5) return '🌟';
  return '🌱';
}

export const LEVEL_CONFIGS: LevelConfig[] = Array.from(
  { length: 100 },
  (_, i) => {
    const level = i + 1;
    // More balanced XP curve - encourages consistent tracking
    // Level 2: ~50 XP (5 transactions)
    // Level 5: ~200 XP (20 transactions)
    // Level 10: ~800 XP (80 transactions)
    return {
      level,
      requiredXP: Math.floor(50 * Math.pow(1.4, level - 1)),
      title: getLevelTitle(level),
      icon: getLevelIcon(level),
    };
  }
);

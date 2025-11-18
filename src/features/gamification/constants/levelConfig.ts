import { LevelConfig } from '../types/level.types';
import i18n from '@/shared/lib/i18n';

const LEVEL_THRESHOLDS = [50, 40, 30, 20, 15, 10, 5, 1];

export function getLevelTitle(level: number): string {
  for (const threshold of LEVEL_THRESHOLDS) {
    if (level >= threshold) {
      return i18n.t(`level.titles.${threshold}`, `Level ${level}`);
    }
  }

  return i18n.t('level.titles.1', 'Beginner');
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

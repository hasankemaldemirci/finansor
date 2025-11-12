export function getRequiredXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromTotalXP(totalXP: number): {
  level: number;
  currentXP: number;
} {
  let level = 1;
  let remainingXP = totalXP;

  while (remainingXP >= getRequiredXPForLevel(level + 1)) {
    remainingXP -= getRequiredXPForLevel(level + 1);
    level++;
  }

  return { level, currentXP: remainingXP };
}

export function getProgressPercentage(currentXP: number, requiredXP: number): number {
  return Math.min(100, Math.floor((currentXP / requiredXP) * 100));
}


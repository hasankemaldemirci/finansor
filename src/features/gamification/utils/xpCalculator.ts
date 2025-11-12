export const XP_REWARDS = {
  TRANSACTION_ADDED: 10,
  DAILY_LOGIN: 5,
  WEEKLY_STREAK: 25,
  MONTHLY_GOAL_REACHED: 100,
  ACHIEVEMENT_UNLOCKED: 50,
} as const;

export function calculateBonusXP(
  baseXP: number,
  multiplier: number = 1
): number {
  return Math.floor(baseXP * multiplier);
}

export function getXPForAmount(amount: number): number {
  // Every 100 units = 1 XP
  return Math.floor(amount / 100);
}


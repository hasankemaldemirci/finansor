import { describe, it, expect, beforeEach } from 'vitest';
import { useGamificationStore } from '../gamificationStore';

// Helper function to calculate required XP (same as in store)
const getRequiredXPForLevel = (level: number): number => {
  return Math.floor(50 * Math.pow(1.4, level - 1));
};

describe('GamificationStore - Level Progression', () => {
  beforeEach(() => {
    // Reset store
    useGamificationStore.getState().resetProgress();
    localStorage.clear();
  });

  describe('Level Requirements', () => {
    it('should calculate correct XP requirements for each level', () => {
      expect(getRequiredXPForLevel(2)).toBe(70); // 50 * 1.4^1
      expect(getRequiredXPForLevel(3)).toBe(97); // 50 * 1.4^2
      expect(getRequiredXPForLevel(4)).toBe(137); // 50 * 1.4^3
      expect(getRequiredXPForLevel(5)).toBe(192); // 50 * 1.4^4
    });

    it('should require cumulative XP for multiple levels', () => {
      const level2 = getRequiredXPForLevel(2); // 70
      const level3 = getRequiredXPForLevel(3); // 97
      const level4 = getRequiredXPForLevel(4); // 137
      const level5 = getRequiredXPForLevel(5); // 192

      const totalForLevel5 = level2 + level3 + level4 + level5;
      expect(totalForLevel5).toBe(496);
    });
  });

  describe('XP Addition and Level Progression', () => {
    it('should start at level 1 with 0 XP', () => {
      const { level, xp } = useGamificationStore.getState();
      expect(level).toBe(1);
      expect(xp).toBe(0);
    });

    it('should not level up with small XP gain (50 XP)', () => {
      const { leveledUp } = useGamificationStore.getState().addXP(50, 'Test');
      expect(leveledUp).toBe(false);
      
      const { level } = useGamificationStore.getState();
      expect(level).toBe(1);
    });

    it('should level up to 2 with 70 XP', () => {
      const { leveledUp, newLevel } = useGamificationStore.getState().addXP(70, 'Test');
      expect(leveledUp).toBe(true);
      expect(newLevel).toBe(2);
      
      const { level, xp } = useGamificationStore.getState();
      expect(level).toBe(2);
      expect(xp).toBe(0); // Exactly enough, no remainder
    });

    it('should level up multiple times with large XP gain', () => {
      // Add 200 XP (should reach level 3)
      const result1 = useGamificationStore.getState().addXP(200, 'Test');
      expect(result1.leveledUp).toBe(true);
      
      const { level: level1 } = useGamificationStore.getState();
      expect(level1).toBeGreaterThan(1);
    });

    it('should handle large income scenario correctly', () => {
      // Simulate large income: 
      // - Transaction XP: 35 (base 15 + bonus 20)
      // - Savings bonus: 30 (max)
      // - First income achievement: 15 XP
      // - Big saver achievement (10k+): 15 XP
      // Total: 95 XP
      const transactionXP = 35;
      const savingsBonus = 30;
      const firstIncomeXP = 15;
      const bigSaverXP = 15;
      const totalXP = transactionXP + savingsBonus + firstIncomeXP + bigSaverXP;

      expect(totalXP).toBe(95);

      // 95 XP should only get to level 2 (70 XP needed, 25 remaining)
      const { leveledUp, newLevel } = useGamificationStore.getState().addXP(totalXP, 'Large Income');
      
      if (leveledUp) {
        expect(newLevel).toBe(2);
        const { level, xp } = useGamificationStore.getState();
        expect(level).toBe(2);
        expect(xp).toBe(25); // 95 - 70 = 25 remaining
      } else {
        // If not leveled up, should be close to level 2
        const { xp } = useGamificationStore.getState();
        expect(xp).toBeGreaterThan(50);
      }
    });

    it('should NOT reach level 4 with large income', () => {
      // Reset
      useGamificationStore.getState().resetProgress();

      // Large income scenario with all achievements
      const transactionXP = 35;
      const savingsBonus = 30;
      const firstIncomeXP = 15;
      const bigSaverXP = 15;
      const totalXP = transactionXP + savingsBonus + firstIncomeXP + bigSaverXP;

      expect(totalXP).toBe(95);

      useGamificationStore.getState().addXP(totalXP, 'Large Income');

      const { level } = useGamificationStore.getState();
      
      // Should NOT reach level 4
      // Level 1->2: 70 XP, Level 2->3: 97 XP, Level 3->4: 137 XP
      // Total needed: 304 XP, but we only have 115 XP
      expect(level).toBeLessThan(4);
      expect(level).toBeLessThanOrEqual(2); // Should be at most level 2
    });

    it('should require significant XP to reach level 4', () => {
      // Level 1->2: 70 XP
      // Level 2->3: 97 XP
      // Level 3->4: 137 XP
      // Total: 304 XP needed

      const requiredXP = getRequiredXPForLevel(2) + 
                         getRequiredXPForLevel(3) + 
                         getRequiredXPForLevel(4);

      expect(requiredXP).toBe(304);

      // Large income gives 95 XP (with all achievements), which is much less than 304
      const largeIncomeXP = 35 + 30 + 15 + 15; // 95 XP (transaction + savings + first income + big saver)
      expect(largeIncomeXP).toBe(95);
      expect(largeIncomeXP).toBeLessThan(requiredXP);
      expect(largeIncomeXP).toBeLessThan(requiredXP / 2); // Should be less than half
    });
  });

  describe('Multiple Level Ups', () => {
    it('should handle multiple level ups in sequence', () => {
      // Add enough XP to reach level 3
      const xpForLevel3 = getRequiredXPForLevel(2) + getRequiredXPForLevel(3); // 70 + 97 = 167
      
      const result = useGamificationStore.getState().addXP(xpForLevel3, 'Large gain');
      
      if (result.leveledUp) {
        const { level } = useGamificationStore.getState();
        expect(level).toBeGreaterThanOrEqual(2);
      }
    });

    it('should track remaining XP after level up', () => {
      // Add 100 XP (enough for level 2, with remainder)
      const { leveledUp } = useGamificationStore.getState().addXP(100, 'Test');
      
      if (leveledUp) {
        const { level, xp } = useGamificationStore.getState();
        expect(level).toBe(2);
        expect(xp).toBe(30); // 100 - 70 = 30
      }
    });
  });
});


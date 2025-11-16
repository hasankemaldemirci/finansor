import { describe, it, expect } from 'vitest';
import {
  calculateXPFromTransaction,
  calculateSavingsBonusXP,
} from '../transactionCalculations';
import { Transaction } from '../../types/transaction.types';

describe('TransactionCalculations - XP System', () => {
  describe('calculateXPFromTransaction', () => {
    it('should give base XP for small income (1k)', () => {
      const transaction: Transaction = {
        id: '1',
        type: 'income',
        amount: 1000,
        category: 'salary',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const xp = calculateXPFromTransaction(transaction);
      // Base 15 + sqrt(1000/1000)*2 = 15 + 2 = 17
      expect(xp).toBe(17);
    });

    it('should give logarithmic bonus for medium income (10k)', () => {
      const transaction: Transaction = {
        id: '1',
        type: 'income',
        amount: 10000,
        category: 'salary',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const xp = calculateXPFromTransaction(transaction);
      // Base 15 + sqrt(10000/1000)*2 = 15 + sqrt(10)*2 = 15 + 6 = 21
      expect(xp).toBe(21);
    });

    it('should cap bonus at 20 for large income', () => {
      const transaction: Transaction = {
        id: '1',
        type: 'income',
        amount: 110000,
        category: 'salary',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const xp = calculateXPFromTransaction(transaction);
      // Base 15 + min(20, sqrt(amount/1000)*2) = 15 + 20 = 35
      expect(xp).toBe(35);
      expect(xp).toBeLessThanOrEqual(35); // Max should be 35
    });

    it('should give minimal XP for expenses', () => {
      const transaction: Transaction = {
        id: '1',
        type: 'expense',
        amount: 5000,
        category: 'groceries',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const xp = calculateXPFromTransaction(transaction);
      expect(xp).toBe(2); // Minimal XP for tracking
    });

    it('should give same XP for same amount expenses', () => {
      const transaction1: Transaction = {
        id: '1',
        type: 'expense',
        amount: 100,
        category: 'groceries',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const transaction2: Transaction = {
        id: '2',
        type: 'expense',
        amount: 100000,
        category: 'shopping',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      expect(calculateXPFromTransaction(transaction1)).toBe(2);
      expect(calculateXPFromTransaction(transaction2)).toBe(2);
    });
  });

  describe('calculateSavingsBonusXP', () => {
    it('should return 0 if savings decreased', () => {
      const bonus = calculateSavingsBonusXP(5000, 10000);
      expect(bonus).toBe(0);
    });

    it('should return 0 if savings did not increase', () => {
      const bonus = calculateSavingsBonusXP(10000, 10000);
      expect(bonus).toBe(0);
    });

    it('should return 0 if savings are negative', () => {
      const bonus = calculateSavingsBonusXP(-1000, -2000);
      expect(bonus).toBe(0);
    });

    it('should give logarithmic bonus for small savings increase (1k)', () => {
      const bonus = calculateSavingsBonusXP(1000, 0);
      // sqrt(1000/100) * 1.5 = sqrt(10) * 1.5 = 3.16 * 1.5 = 4.74 = 4
      expect(bonus).toBe(4);
    });

    it('should give logarithmic bonus for medium savings increase (10k)', () => {
      const bonus = calculateSavingsBonusXP(10000, 0);
      // sqrt(10000/100) * 1.5 = sqrt(100) * 1.5 = 10 * 1.5 = 15
      expect(bonus).toBe(15);
    });

    it('should cap bonus at 30 for large savings increase', () => {
      const bonus = calculateSavingsBonusXP(110000, 0);
      // sqrt(increase/100) * 1.5, max 30
      expect(bonus).toBe(30);
      expect(bonus).toBeLessThanOrEqual(30);
    });

    it('should calculate bonus for incremental savings', () => {
      // Start with 0
      const bonus1 = calculateSavingsBonusXP(5000, 0);
      expect(bonus1).toBeGreaterThan(0);

      // Increase from 5k to 10k
      const bonus2 = calculateSavingsBonusXP(10000, 5000);
      expect(bonus2).toBeGreaterThan(0);
      expect(bonus2).toBeLessThanOrEqual(30);
    });
  });

  describe('XP Balance - Large Income Scenario', () => {
    it('should not give excessive XP for large income', () => {
      const transaction: Transaction = {
        id: '1',
        type: 'income',
        amount: 110000,
        category: 'salary',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const xp = calculateXPFromTransaction(transaction);
      
      // Should be capped at reasonable amount
      expect(xp).toBe(35); // Base 15 + max bonus 20
      expect(xp).toBeLessThan(50); // Should not exceed 50
    });

    it('should not give excessive savings bonus for large increase', () => {
      const bonus = calculateSavingsBonusXP(110000, 0);
      
      // Should be capped at 30
      expect(bonus).toBe(30);
      expect(bonus).toBeLessThanOrEqual(30);
    });

    it('should calculate total XP for large income with savings', () => {
      const transaction: Transaction = {
        id: '1',
        type: 'income',
        amount: 110000,
        category: 'salary',
        description: 'Test',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const transactionXP = calculateXPFromTransaction(transaction);
      const savingsBonus = calculateSavingsBonusXP(110000, 0);
      const totalXP = transactionXP + savingsBonus;

      // Total should be reasonable (35 + 30 = 65)
      expect(totalXP).toBe(65);
      expect(totalXP).toBeLessThan(100); // Should not exceed 100
    });
  });
});


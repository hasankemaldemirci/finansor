import { describe, it, expect } from 'vitest';
import { transactionSchema, settingsSchema } from '../transaction.schema';

describe('Transaction Schema', () => {
  describe('Valid Inputs', () => {
    it('should validate valid income transaction', () => {
      const valid = {
        type: 'income',
        amount: 1000,
        category: 'salary',
        description: 'Monthly salary',
        date: new Date(),
      };

      const result = transactionSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('income');
        expect(result.data.amount).toBe(1000);
      }
    });

    it('should validate valid expense transaction', () => {
      const valid = {
        type: 'expense',
        amount: 500,
        category: 'groceries',
        description: 'Weekly groceries',
      };

      const result = transactionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should handle optional fields', () => {
      const minimal = {
        type: 'income',
        amount: 100,
      };

      const result = transactionSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Inputs', () => {
    it('should reject invalid transaction type', () => {
      const invalid = {
        type: 'invalid',
        amount: 100,
      };

      const result = transactionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject negative amounts', () => {
      const invalid = {
        type: 'income',
        amount: -100,
      };

      const result = transactionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject zero amount', () => {
      const invalid = {
        type: 'income',
        amount: 0,
      };

      const result = transactionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject too large amounts', () => {
      const invalid = {
        type: 'income',
        amount: 9999999999,
      };

      const result = transactionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject too long descriptions', () => {
      const invalid = {
        type: 'income',
        amount: 100,
        description: 'A'.repeat(600),
      };

      const result = transactionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('Sanitization', () => {
    it('should sanitize XSS in description', () => {
      const withXSS = {
        type: 'income',
        amount: 100,
        description: '<script>alert("XSS")</script>',
      };

      const result = transactionSchema.safeParse(withXSS);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).not.toContain('<script>');
      }
    });

    it('should sanitize category', () => {
      const withSpecialChars = {
        type: 'income',
        amount: 100,
        category: 'groceries!@#',
      };

      const result = transactionSchema.safeParse(withSpecialChars);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category).not.toContain('!');
        expect(result.data.category).not.toContain('@');
      }
    });

    it('should sanitize amount', () => {
      const withNegative = {
        type: 'income',
        amount: -100,
      };

      const result = transactionSchema.safeParse(withNegative);
      expect(result.success).toBe(false);
    });
  });

  describe('Date Handling', () => {
    it('should use provided date', () => {
      const date = new Date('2024-01-01');
      const data = {
        type: 'income',
        amount: 100,
        date,
      };

      const result = transactionSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.date).toBeInstanceOf(Date);
      }
    });

    it('should default to current date if not provided', () => {
      const data = {
        type: 'income',
        amount: 100,
      };

      const result = transactionSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.date).toBeInstanceOf(Date);
      }
    });
  });
});

describe('Settings Schema', () => {
  describe('Valid Inputs', () => {
    it('should validate valid settings', () => {
      const valid = {
        theme: 'dark',
        currency: 'TRY',
        monthlyGoal: 5000,
        notifications: true,
        language: 'tr',
      };

      const result = settingsSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should accept all theme options', () => {
      ['light', 'dark', 'system'].forEach(theme => {
        const result = settingsSchema.safeParse({
          theme,
          currency: 'TRY',
          monthlyGoal: 0,
          notifications: true,
          language: 'tr',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept all currency options', () => {
      ['TRY', 'USD', 'EUR'].forEach(currency => {
        const result = settingsSchema.safeParse({
          theme: 'light',
          currency,
          monthlyGoal: 0,
          notifications: true,
          language: 'tr',
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Invalid Inputs', () => {
    it('should reject invalid theme', () => {
      const invalid = {
        theme: 'invalid',
        currency: 'TRY',
        monthlyGoal: 0,
        notifications: true,
        language: 'tr',
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject invalid currency', () => {
      const invalid = {
        theme: 'light',
        currency: 'INVALID',
        monthlyGoal: 0,
        notifications: true,
        language: 'tr',
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject negative monthly goal', () => {
      const invalid = {
        theme: 'light',
        currency: 'TRY',
        monthlyGoal: -100,
        notifications: true,
        language: 'tr',
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject too large monthly goal', () => {
      const invalid = {
        theme: 'light',
        currency: 'TRY',
        monthlyGoal: 9999999999,
        notifications: true,
        language: 'tr',
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});


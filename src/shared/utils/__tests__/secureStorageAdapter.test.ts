import { describe, it, expect, beforeEach } from 'vitest';
import { secureStorageAdapter } from '../secureStorageAdapter';
import { cryptoService } from '../crypto';

describe('SecureStorageAdapter', () => {
  let storage: ReturnType<typeof secureStorageAdapter<any>>;

  beforeEach(() => {
    localStorage.clear();
    (cryptoService as any).encryptionKey = null;
    (cryptoService as any).initializeKey();
    storage = secureStorageAdapter<any>();
  });

  describe('getItem', () => {
    it('should retrieve and decrypt stored data', () => {
      const testData = { state: { name: 'Test', value: 123 }, version: 0 };
      storage.setItem('test-key', testData);
      
      const retrieved = storage.getItem('test-key');
      expect(retrieved).toBeTruthy();
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const retrieved = storage.getItem('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        state: {
          transactions: [
            { id: '1', amount: 100 },
            { id: '2', amount: 200 },
          ],
          metadata: {
            count: 2,
            total: 300,
          },
        },
        version: 0,
      };
      
      storage.setItem('complex', complexData);
      const retrieved = storage.getItem('complex');
      
      expect(retrieved).toBeTruthy();
      expect(retrieved).toEqual(complexData);
    });

    it('should handle Zustand persist format', () => {
      const zustandData = {
        state: {
          transactions: [1, 2, 3],
          nested: { value: 'test' },
        },
        version: 0,
      };
      
      storage.setItem('zustand', zustandData);
      const retrieved = storage.getItem('zustand');
      
      expect(retrieved).toBeTruthy();
      expect(retrieved).toEqual(zustandData);
    });
  });

  describe('setItem', () => {
    it('should encrypt and store data', () => {
      const testData = { state: { secret: 'sensitive-data' }, version: 0 };
      storage.setItem('test', testData);
      
      // Check that data is encrypted in storage
      const rawStorage = localStorage.getItem('secure_test');
      expect(rawStorage).toBeTruthy();
      expect(rawStorage).not.toContain('sensitive-data');
      expect(rawStorage!.length).toBeGreaterThan(50);
    });

    it('should overwrite existing data', () => {
      storage.setItem('test', { state: { value: 1 }, version: 0 });
      storage.setItem('test', { state: { value: 2 }, version: 0 });
      
      const retrieved = storage.getItem('test');
      expect(retrieved).toBeTruthy();
      expect(retrieved?.state.value).toBe(2);
    });

    it('should handle empty state objects', () => {
      storage.setItem('empty', { state: {}, version: 0 });
      const retrieved = storage.getItem('empty');
      expect(retrieved).toEqual({ state: {}, version: 0 });
    });
  });

  describe('removeItem', () => {
    it('should remove stored data', () => {
      storage.setItem('test', { state: { data: 'test' }, version: 0 });
      storage.removeItem('test');
      
      const retrieved = storage.getItem('test');
      expect(retrieved).toBeNull();
    });

    it('should handle removing non-existent keys gracefully', () => {
      expect(() => {
        storage.removeItem('non-existent');
      }).not.toThrow();
    });

    it('should remove both encrypted and unencrypted versions', () => {
      // Set encrypted
      storage.setItem('test', { state: { encrypted: true }, version: 0 });
      // Set unencrypted (old format)
      localStorage.setItem('test', JSON.stringify({ encrypted: false }));
      
      storage.removeItem('test');
      
      expect(localStorage.getItem('secure_test')).toBeNull();
      expect(localStorage.getItem('test')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid encrypted data gracefully', () => {
      // This shouldn't happen in practice, but test error handling
      localStorage.setItem('secure_test', 'invalid-json');
      
      // Should return null or handle gracefully
      const retrieved = storage.getItem('test');
      // May return null or handle gracefully - test that it doesn't crash
      expect(retrieved === null || typeof retrieved === 'object').toBe(true);
    });
  });

  describe('Integration with Zustand', () => {
    it('should work as PersistStorage for Zustand', () => {
      // Simulate Zustand persist format
      const zustandData = {
        state: {
          transactions: [{ id: '1', amount: 100 }],
          settings: { theme: 'dark' },
        },
        version: 0,
      };
      
      storage.setItem('zustand-test', zustandData);
      const retrieved = storage.getItem('zustand-test');
      
      expect(retrieved).toBeTruthy();
      expect(retrieved?.state.transactions).toHaveLength(1);
      expect(retrieved?.state.settings.theme).toBe('dark');
    });

    it('should preserve version number', () => {
      const data = {
        state: { test: 'value' },
        version: 5,
      };
      
      storage.setItem('version-test', data);
      const retrieved = storage.getItem('version-test');
      
      expect(retrieved?.version).toBe(5);
    });
  });
});


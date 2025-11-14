import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// LocalStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Navigator mock
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'test-agent',
    language: 'tr-TR',
  },
  writable: true,
});

// Screen mock
Object.defineProperty(window, 'screen', {
  value: {
    width: 1920,
    height: 1080,
  },
  writable: true,
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Global test utilities
global.expect = expect;
global.vi = vi;

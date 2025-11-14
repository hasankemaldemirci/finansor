import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, CategoryBudget } from '@/shared/types/settings.types';
import { Theme, Currency } from '@/shared/types/common.types';
import { secureStorageAdapter } from '@/shared/utils/secureStorageAdapter';

interface SettingsState {
  settings: UserSettings;
  updateTheme: (theme: Theme) => void;
  updateCurrency: (currency: Currency) => void;
  updateMonthlyGoal: (goal: number) => void;
  toggleNotifications: () => void;
  updateLanguage: (language: string) => void;
  setCategoryBudget: (category: string, limit: number) => void;
  removeCategoryBudget: (category: string) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: true,
  currency: 'TRY',
  monthlyGoal: 5000,
  language: 'tr',
  categoryBudgets: [],
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }));

        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },

      updateCurrency: (currency) => {
        set((state) => ({
          settings: { ...state.settings, currency },
        }));
      },

      updateMonthlyGoal: (monthlyGoal) => {
        set((state) => ({
          settings: { ...state.settings, monthlyGoal },
        }));
      },

      toggleNotifications: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: !state.settings.notifications,
          },
        }));
      },

      updateLanguage: (language) => {
        set((state) => ({
          settings: { ...state.settings, language },
        }));
      },

      setCategoryBudget: (category: string, limit: number) => {
        set((state) => {
          const budgets = state.settings.categoryBudgets || [];
          const existing = budgets.find((b) => b.category === category);
          const updatedBudgets = existing
            ? budgets.map((b) =>
                b.category === category ? { ...b, limit } : b
              )
            : [...budgets, { category, limit }];

          return {
            settings: { ...state.settings, categoryBudgets: updatedBudgets },
          };
        });
      },

      removeCategoryBudget: (category: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            categoryBudgets: (state.settings.categoryBudgets || []).filter(
              (b) => b.category !== category
            ),
          },
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },
    }),
    {
      name: 'settings-storage',
      storage: secureStorageAdapter<SettingsState>(),
      onRehydrateStorage: () => (state) => {
        // Migration: Ensure categoryBudgets exists for old data
        if (state?.settings && !state.settings.categoryBudgets) {
          state.settings.categoryBudgets = [];
        }
      },
    }
  )
);

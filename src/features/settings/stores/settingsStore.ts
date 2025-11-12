import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserSettings } from '@/shared/types/settings.types';
import { Theme, Currency } from '@/shared/types/common.types';

interface SettingsState {
  settings: UserSettings;
  updateTheme: (theme: Theme) => void;
  updateCurrency: (currency: Currency) => void;
  updateMonthlyGoal: (goal: number) => void;
  toggleNotifications: () => void;
  updateLanguage: (language: string) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: true,
  currency: 'TL',
  monthlyGoal: 5000,
  language: 'tr',
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

      resetSettings: () => {
        set({ settings: defaultSettings });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


import { useSettingsStore } from '../stores/settingsStore';

export const useSettings = () => {
  const {
    settings,
    updateTheme,
    updateCurrency,
    updateMonthlyGoal,
    toggleNotifications,
    updateLanguage,
    resetSettings,
  } = useSettingsStore();

  return {
    settings,
    updateTheme,
    updateCurrency,
    updateMonthlyGoal,
    toggleNotifications,
    updateLanguage,
    resetSettings,
  };
};


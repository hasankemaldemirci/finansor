import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from '@/shared/components/ui/toaster';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { OnboardingModal } from '@/shared/components/OnboardingModal';
import '@/shared/lib/i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const { settings, updateTheme } = useSettingsStore();
  const { i18n } = useTranslation();

  // Initialize theme on mount
  useEffect(() => {
    updateTheme(settings.theme);
  }, []);

  // Update i18n language when settings change
  useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language, i18n]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
      <OnboardingModal />
    </ErrorBoundary>
  );
}

export default App;

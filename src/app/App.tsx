import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from '@/shared/components/ui/toaster';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

function App() {
  const { settings, updateTheme } = useSettingsStore();

  // Initialize theme on mount
  useEffect(() => {
    updateTheme(settings.theme);
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from '@/shared/components/ui/toaster';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';

function App() {
  const { settings, updateTheme } = useSettingsStore();

  // Initialize theme on mount
  useEffect(() => {
    updateTheme(settings.theme);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;


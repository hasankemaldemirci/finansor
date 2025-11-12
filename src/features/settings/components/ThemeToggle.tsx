import { Moon, Sun } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useSettings } from '../hooks/useSettings';

export function ThemeToggle() {
  const { settings, updateTheme } = useSettings();

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {settings.theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Tema değiştir</span>
    </Button>
  );
}


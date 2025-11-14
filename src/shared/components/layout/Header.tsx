import { useLevel } from '@/features/gamification/hooks/useLevel';
import { ThemeToggle } from '@/features/settings/components/ThemeToggle';
import { getLevelIcon } from '@/features/gamification/constants/levelConfig';
import { NotificationMenu } from './NotificationMenu';

export function Header() {
  const { level, title } = useLevel();

  return (
    <header className="border-b bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/95 sticky top-0 z-40 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-3 h-16 flex items-center justify-between max-w-3xl">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Finansör
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getLevelIcon(level)}</span>
            <div>
              <p className="text-sm font-semibold">Seviye {level}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">{title}</p>
            </div>
          </div>
          <NotificationMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


import { useLevel } from '@/features/gamification/hooks/useLevel';
import { ThemeToggle } from '@/features/settings/components/ThemeToggle';
import { getLevelIcon } from '@/features/gamification/constants/levelConfig';

export function Header() {
  const { level, title } = useLevel();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-3xl">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Finansör
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">{getLevelIcon(level)}</span>
            <div className="hidden sm:block">
              <p className="font-semibold">Level {level}</p>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


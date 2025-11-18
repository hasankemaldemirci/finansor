import { Link } from 'react-router-dom';
import { useLevel } from '@/features/gamification/hooks/useLevel';
import { ThemeToggle } from '@/features/settings/components/ThemeToggle';
import { getLevelIcon } from '@/features/gamification/constants/levelConfig';
import { NotificationMenu } from './NotificationMenu';
import { Logo } from '@/shared/components/Logo';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();
  const { level, title } = useLevel();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 shadow-[0_2px_10px_rgba(0,0,0,0.1)] backdrop-blur-lg supports-[backdrop-filter]:bg-background/95">
      <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between px-3">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Logo size={40} />
          <h1 className="hidden bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent sm:block">
            Finansör
          </h1>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getLevelIcon(level)}</span>
            <div>
              <p className="text-sm font-semibold">{t('level.label')} {level}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {title}
              </p>
            </div>
          </div>
          <NotificationMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

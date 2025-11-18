import { Home, List, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import { useTranslation } from 'react-i18next';

export function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: t('nav.home'), path: ROUTES.HOME },
    { icon: List, label: t('nav.transactions'), path: ROUTES.TRANSACTIONS },
    { icon: BarChart3, label: t('nav.statistics'), path: ROUTES.STATISTICS },
    { icon: Settings, label: t('nav.settings'), path: ROUTES.SETTINGS },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] backdrop-blur-lg supports-[backdrop-filter]:bg-background/95">
      <div className="container mx-auto max-w-3xl px-3">
        <div className="flex h-16 items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 transition-colors',
                  isActive
                    ? 'bg-primary font-semibold text-white shadow-sm'
                    : 'text-foreground/70 hover:bg-primary/10 hover:text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

import { Home, List, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants/routes';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Ana Sayfa', path: ROUTES.HOME },
    { icon: List, label: 'İşlemler', path: ROUTES.TRANSACTIONS },
    { icon: BarChart3, label: 'İstatistikler', path: ROUTES.STATISTICS },
    { icon: Settings, label: 'Ayarlar', path: ROUTES.SETTINGS },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/95 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-3 max-w-3xl">
        <div className="flex items-center justify-around h-16 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-white bg-primary font-semibold shadow-sm'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/10'
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


import { Outlet } from 'react-router-dom';
import { Header } from '@/shared/components/layout/Header';
import { Navigation } from '@/shared/components/layout/Navigation';
import { ScrollToTop } from '@/shared/components/layout/ScrollToTop';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}


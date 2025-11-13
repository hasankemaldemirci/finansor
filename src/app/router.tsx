import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '@/pages/HomePage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { StatisticsPage } from '@/pages/StatisticsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ROUTES } from '@/shared/constants/routes';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: ROUTES.HOME,
          element: <HomePage />,
        },
        {
          path: ROUTES.TRANSACTIONS,
          element: <TransactionsPage />,
        },
        {
          path: ROUTES.ACHIEVEMENTS,
          element: <AchievementsPage />,
        },
        {
          path: ROUTES.STATISTICS,
          element: <StatisticsPage />,
        },
        {
          path: ROUTES.SETTINGS,
          element: <SettingsPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);


import { createBrowserRouter, RouterProvider } from 'react-router';

import NavigationMain from './Navigation';
import ProtectedRoutes from './ProtectedRoutes';
import AuthMain from '@/pages/Auth';
import TradesMain from '@/pages/Trades';
import DashboardMain from '@/pages/Dashboard';
import HomeMain from '@/pages/Home';
import StrategiesMain from '@/pages/Strategies';

const router = createBrowserRouter([
  { path: '/', Component: HomeMain },
  { path: '/auth', Component: AuthMain },
  {
    Component: ProtectedRoutes,
    children: [
      {
        Component: NavigationMain,
        children: [
          { path: '/trades', Component: TradesMain },
          { path: '/dashboard', Component: DashboardMain },
          { path: '/strategies', Component: StrategiesMain },
        ],
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

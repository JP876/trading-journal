import { createBrowserRouter, RouterProvider } from 'react-router';

import NavigationMain from './Navigation';
import AuthMain from '@/pages/Auth';
import TradesMain from '@/pages/Trades';
import DashboardMain from '@/pages/Dashboard';
import ProtectedRoutes from './ProtectedRoutes';

const router = createBrowserRouter([
  { path: '/auth', Component: AuthMain },
  {
    Component: ProtectedRoutes,
    children: [
      {
        Component: NavigationMain,
        children: [
          { path: '/trades', Component: TradesMain },
          { path: '/dashboard', Component: DashboardMain },
        ],
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

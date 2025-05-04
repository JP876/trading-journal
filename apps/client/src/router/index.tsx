import { createBrowserRouter, RouterProvider } from 'react-router';

import NavigationMain from '@/components/navigation';
import TradesMain from '@/pages/trades';
import DashboardMain from '@/pages/dashboard';
import AuthMain from '@/pages/auth';
import MainPage from '@/pages/main';
import ProtectedRoutes from './ProtectedRoutes';

const router = createBrowserRouter([
  { index: true, Component: MainPage },
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

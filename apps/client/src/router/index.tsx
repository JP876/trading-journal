import { lazy } from 'react';
import { createBrowserRouter, redirect, RouterProvider, type MiddlewareFunction } from 'react-router';

import withCatch from '../lib/withCatch';
import { refreshToken } from '../api/auth';
import ProtectedRoutes from './ProtectedRoutes';

const NavigationMain = lazy(() => import('../components/Navigation'));
const HomeMain = lazy(() => import('../pages/home'));
const AuthPage = lazy(() => import('../pages/auth'));
const TradesPage = lazy(() => import('../pages/trades'));
const DashboardMain = lazy(() => import('../pages/dashboard'));

const authMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(refreshToken());
  if (error) {
    throw redirect('/auth');
  }
  return await next();
};

const router = createBrowserRouter([
  { path: '/', Component: HomeMain },
  { path: '/auth', Component: AuthPage },
  {
    Component: ProtectedRoutes,
    middleware: [authMiddleware],
    HydrateFallback: () => null,
    children: [
      {
        Component: NavigationMain,
        children: [
          { path: '/trades', Component: TradesPage },
          { path: '/dashboard', Component: DashboardMain },
        ],
      },
    ],
  },
]);

const RouterMain = () => {
  return <RouterProvider router={router} />;
};

export default RouterMain;

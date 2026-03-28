import { lazy } from 'react';
import { createBrowserRouter, redirect, RouterProvider, type MiddlewareFunction } from 'react-router';

import withCatch from '../lib/withCatch';
import { getLoggedInUser, refreshToken } from '../api/auth';
import ProtectedRoutes from './ProtectedRoutes';

const NavigationMain = lazy(() => import('../components/Navigation'));
const HomeMain = lazy(() => import('../pages/home'));
const AuthPage = lazy(() => import('../pages/auth'));
const TradesPage = lazy(() => import('../pages/trades'));
const DashboardMain = lazy(() => import('../pages/dashboard'));

const protectedRouteMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(refreshToken());
  if (error) {
    throw redirect('/auth');
  }
  return await next();
};

const authMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(getLoggedInUser());
  if (error) {
    return await next();
  }
  return redirect('/dashboard');
};

const router = createBrowserRouter([
  { path: '/', Component: HomeMain },
  { path: '/auth', Component: AuthPage, middleware: [authMiddleware] },
  {
    Component: ProtectedRoutes,
    middleware: [protectedRouteMiddleware],
    HydrateFallback: () => null,
    children: [
      {
        Component: NavigationMain,
        children: [
          { path: '/dashboard', Component: DashboardMain },
          { path: '/trades', Component: TradesPage },
        ],
      },
    ],
  },
]);

const RouterMain = () => {
  return <RouterProvider router={router} />;
};

export default RouterMain;

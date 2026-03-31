import { lazy } from 'react';
import { createBrowserRouter, redirect, type MiddlewareFunction } from 'react-router';

import withCatch from '../lib/withCatch';
import { refreshToken } from '../api/auth';
import ProtectedRoutes from './ProtectedRoutes';

const NavigationMain = lazy(() => import('../components/Navigation'));
const AuthPage = lazy(() => import('../pages/auth'));
const TradesPage = lazy(() => import('../pages/trades'));
const DashboardMain = lazy(() => import('../pages/dashboard'));

const protectedRouteMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(refreshToken());
  if (error) {
    document.dispatchEvent(new CustomEvent('is-authenticated', { detail: false }));
    throw redirect('/');
  }
  return await next();
};

const authMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(refreshToken());
  if (error) {
    return await next();
  }
  return redirect('/dashboard');
};

export const router = createBrowserRouter([
  { path: '/', Component: AuthPage, middleware: [authMiddleware] },
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

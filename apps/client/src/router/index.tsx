import { lazy } from 'react';
import { createBrowserRouter, redirect, type MiddlewareFunction } from 'react-router';
import { getDefaultStore } from 'jotai';

import withCatch from '../lib/withCatch';
import { refreshToken } from '../api/auth';
import ProtectedRoutes from './ProtectedRoutes';
import { snackbarAtom } from '../atoms/snackbar';

const NavigationMain = lazy(() => import('../components/Navigation'));
const AuthPage = lazy(() => import('../pages/auth'));
const TradesPage = lazy(() => import('../pages/trades'));
const DashboardMain = lazy(() => import('../pages/dashboard'));

const protectedRouteMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(refreshToken());

  if (error) {
    getDefaultStore().set(snackbarAtom, {
      open: true,
      severity: 'error',
      message: "Looks like you're not logged in. Please sign in.",
    });
    throw redirect('/');
  } else {
    return await next();
  }
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

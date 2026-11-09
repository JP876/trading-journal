import { getDefaultStore } from 'jotai';
import { lazy } from 'react';
import { createBrowserRouter, redirect, type MiddlewareFunction, type RouteObject } from 'react-router';

import { refreshToken } from '../api/auth';
import { openSnackbarAtom, userAtom } from '../atoms';
import { axiosInstance } from '../lib/axiosInstance';
import { getLoggedInUserDB, hasUsersDB } from '../lib/db/api/users';
import withCatch from '../lib/withCatch';
import type { User } from '../types/user';
import ProtectedRoutes from './ProtectedRoutes';

const NavigationMain = lazy(() => import('../components/Navigation'));
const AuthPage = lazy(() => import('../pages/auth'));
const TradesPage = lazy(() => import('../pages/trades'));
const DashboardMain = lazy(() => import('../pages/dashboard'));

const showErrorMessage = () => {
  getDefaultStore().set(openSnackbarAtom, {
    severity: 'error',
    message: "Looks like you're not logged in. Please sign in.",
  });
};

const protectedRouteMiddleware: MiddlewareFunction = async (_, next) => {
  if (hasUsersDB()) {
    let user = await getLoggedInUserDB();
    if (user) {
      getDefaultStore().set(userAtom, user);
      return await next();
    }
  }

  const [error] = await withCatch(refreshToken());

  if (error) {
    showErrorMessage();
    throw redirect('/');
  }

  const userInfo = getDefaultStore().get(userAtom);
  if (userInfo) return await next();

  const [userError, user] = await withCatch(axiosInstance.get<User>('auth/me'));

  if (userError) {
    showErrorMessage();
    throw redirect('/');
  }

  getDefaultStore().set(userAtom, user.data);
  return await next();
};

const authMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(refreshToken());
  if (error) {
    return await next();
  }
  return redirect('/dashboard');
};

const routes: RouteObject[] = [
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
];

export const router = createBrowserRouter(routes, { future: {} });

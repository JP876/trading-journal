import { createBrowserRouter, redirect, RouterProvider, type MiddlewareFunction } from 'react-router';

import withCatch from '../lib/withCatch';
import { refreshToken } from '../api/auth';
import HomeMain from '../pages/home';
import LoginPage from '../pages/login';
import TradesPage from '../pages/trades';
import NavigationMain from '../components/Navigation';
import ProtectedRoutes from './ProtectedRoutes';

const authMiddleware: MiddlewareFunction = async (_, next) => {
  const [error] = await withCatch(refreshToken());
  if (error) {
    throw redirect('/auth');
  }
  return await next();
};

const router = createBrowserRouter([
  { path: '/', Component: HomeMain },
  { path: '/auth', Component: LoginPage },
  {
    Component: ProtectedRoutes,
    middleware: [authMiddleware],
    children: [
      {
        Component: NavigationMain,
        children: [{ path: '/trades', Component: TradesPage }],
      },
    ],
  },
]);

const RouterMain = () => {
  return <RouterProvider router={router} />;
};

export default RouterMain;

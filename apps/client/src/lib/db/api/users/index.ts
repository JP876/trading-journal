import { db } from '../..';
import type { UserDB } from '../../../../types/user';
import withCatch from '../../../withCatch';

export const getLoggedInUserDB = async () => {
  return db.users.filter((user) => !!user.isLoggedIn).first();
};

export const getAllUsersDB = async () => {
  return db.users.toArray();
};

export const hasUsersDB = () => {
  return !!db.users.count();
};

export const createUserDB = async (): Promise<[Error, null] | [null, UserDB]> => {
  const [addError] = await withCatch(db.users.add({ name: '', image: null, isLoggedIn: true, variety: 'GUEST' }));
  if (addError) return [addError, null];

  const [error, user] = await withCatch(getLoggedInUserDB());
  if (error) return [error, null];

  if (!user?.id) {
    return [new Error('Logged in user not found'), null];
  }
  return [null, user];
};

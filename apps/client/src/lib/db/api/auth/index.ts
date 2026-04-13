import { format } from 'date-fns';

import { db } from '../..';
import withCatch from '../../../withCatch';
import { addTradingSessionDB } from '../tradingSessions';

export const getCurrentUser = async () => {
  const [error, users] = await withCatch(db.users.toArray());
  return error || users.length === 0 ? null : users[0];
};

export const loginUserDB = async () => {
  const user = await getCurrentUser();

  if (user?.id) {
    const [error] = await withCatch(db.users.update(user.id, { isLoggedIn: true }));
    if (error) return error;
  } else {
    const [error] = await withCatch(db.users.add({ name: '', image: null, isLoggedIn: true }));
    if (error) return error;

    const [sessionError] = await withCatch(
      addTradingSessionDB({
        title: `Initial session ${format(new Date(), 'MM/yy')}`,
        isMain: true,
      })
    );
    if (sessionError) return sessionError;
  }
};

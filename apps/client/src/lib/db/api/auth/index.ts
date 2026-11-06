import { format } from 'date-fns';
import { getDefaultStore } from 'jotai';

import { db } from '../..';
import { openModalAtom } from '../../../../atoms/modal';
import { snackbarAtom } from '../../../../atoms/snackbar';
import { TradesPageModal } from '../../../../pages/trades/enums';
import type { UserDB } from '../../../../types/user';
import withCatch from '../../../withCatch';
import { addTradingSessionDB } from '../tradingSessions';
import { createUserDB, getAllUsersDB } from '../users';

export const loginUserDB = async (userId?: number): Promise<[Error, null] | [null, UserDB]> => {
  let usersResult = await withCatch(getAllUsersDB());
  if (usersResult.error) {
    return [usersResult.error, null] as const;
  }

  let user: UserDB | null = usersResult.data[0];
  if (userId) {
    user = usersResult.data.find((u) => u.id === userId) || null;
  }

  if (user?.id) {
    const updateResult = await withCatch(db.users.update(user.id, { isLoggedIn: true, variety: 'GUEST' }));
    if (updateResult.error) {
      return [updateResult.error, null];
    }

    getDefaultStore().set(snackbarAtom, {
      severity: 'success',
      message: `Welcome! You're in guest mode — feel free to look around.`,
    });
    return [null, user];
  }

  const [addError, newUser] = await createUserDB();
  if (addError) return [addError, null];

  const sessionResult = await withCatch(
    addTradingSessionDB({
      title: `Initial session ${format(new Date(), 'MM/yy')}`,
      isMain: true,
      accountSize: 50_000,
    })
  );
  if (sessionResult.error) return [sessionResult.error, null];

  getDefaultStore().set(openModalAtom, { id: TradesPageModal.INTRO });
  return [null, newUser];
};

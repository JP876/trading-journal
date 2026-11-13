import { format } from "date-fns";
import { getDefaultStore } from "jotai";

import type { UserDB } from "../../../../types/user";

import { db } from "../..";
import { openModalAtom, snackbarAtom } from "../../../../atoms";
import { TradesPageModal } from "../../../../pages/trades/enums";
import withCatch from "../../../withCatch";
import { addTradingSessionDB } from "../tradingSessions";
import { createUserDB, getAllUsersDB } from "../users";

export const loginUserDB = async (userId?: number): Promise<[Error, null] | [null, UserDB]> => {
  const [usersError, users] = await withCatch(getAllUsersDB());
  if (usersError) {
    return [usersError, null];
  }

  let user: UserDB | null = users[0];
  if (userId) {
    user = users.find((u) => u.id === userId) || null;
  }

  if (user?.id) {
    const [error] = await withCatch(db.users.update(user.id, { isLoggedIn: true, variety: "GUEST" }));
    if (error) {
      return [error, null];
    }

    getDefaultStore().set(snackbarAtom, {
      severity: "success",
      message: `Welcome! You're in guest mode — feel free to look around.`,
    });
    return [null, user];
  }

  const [addError, newUser] = await createUserDB();
  if (addError) return [addError, null];

  const [sessionError] = await withCatch(
    addTradingSessionDB(newUser.id, {
      title: `Initial session ${format(new Date(), "MM/yy")}`,
      isMain: true,
      accountSize: 50_000,
    }),
  );
  if (sessionError) return [sessionError, null];

  getDefaultStore().set(openModalAtom, { id: TradesPageModal.INTRO, title: "You're exploring as a guest" });
  return [null, newUser];
};

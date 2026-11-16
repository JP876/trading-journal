import { Dexie, type EntityTable } from "dexie";

import type { Tag } from "../../types/tag";
import type { Trade } from "../../types/trade";
import type { TradingSession } from "../../types/tradingSessions";
import type { UserDB } from "../../types/user";

class LogMyTradesDB extends Dexie {
  users!: EntityTable<UserDB, "id">;
  tradingSessions!: EntityTable<TradingSession, "id">;
  trades!: EntityTable<Trade, "id">;
  tags!: EntityTable<Tag, "id">;

  constructor() {
    super("LogMyTradesDB");
    this.version(2).stores({
      users: "++id, name, email, isLoggedIn",
      tradingSessions: `++id, user, title, isMain`,
      trades: `++id, user, pair, result, direction, openDate, closeDate, *tags, tradingSession, [tradingSession+user]`,
      tags: "++id, user, title",
    });
  }
}

export const db = new LogMyTradesDB();

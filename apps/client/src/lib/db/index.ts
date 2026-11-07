import { Dexie, type EntityTable } from 'dexie';

import type { UserDB } from '../../types/user';
import type { TradingSession } from '../../types/tradingSessions';
import type { Trade } from '../../types/trade';
import type { Tag } from '../../types/tag';
import type { Pair } from '../../types/pair';

export const db = new Dexie('LogMyTradesDB') as Dexie & {
  users: EntityTable<UserDB, 'id'>;
  tradingSessions: EntityTable<TradingSession, 'id'>;
  trades: EntityTable<Trade, 'id'>;
  tags: EntityTable<Tag, 'id'>;
  pairs: EntityTable<Pair, 'id'>;
};

db.version(2).stores({
  users: '++id, name, email, isLoggedIn',
  tradingSessions: `++id, user, title, isMain`,
  trades: `++id, user, pair, result, direction, openDate, closeDate, *tags, tradingSession, [tradingSession+user]`,
  tags: '++id, user, title',
  pairs: '++id, pair',
});

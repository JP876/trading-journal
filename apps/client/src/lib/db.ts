import { Dexie, type EntityTable } from 'dexie';

import type { User } from '../types/user';

export const db = new Dexie('logMyTrades') as Dexie & {
  users: EntityTable<User, 'id'>;
};

db.version(2).stores({
  users: '++id, name, email, image',
});

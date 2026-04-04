import { z } from 'zod';

import type { TradingSession } from '../tradingSessions';
import type { Pair } from '../pair';
import { filesObject, type PaginationInfo } from '..';
import type { Tag } from '../tag';

export type Result = 'win' | 'loss' | 'be';
export type Direction = 'long' | 'short';
export type ClosedBy = 'tp/sl' | 'user';
export type OrderType = 'market_order' | 'buy_limit' | 'buy_stop' | 'sell_limit' | 'sell_stop';

export const TradeFormSchema = z.object({
  pairId: z.number('This field is required.').positive(),
  result: z.union([z.literal('win'), z.literal('loss'), z.literal('be')], { error: 'This field is required.' }),
  direction: z.union([z.literal('long'), z.literal('short')], { error: 'This field is required.' }),
  stopLoss: z.number().positive().optional(),
  takeProfit: z.number().positive().optional(),
  openDate: z.date().optional(),
  closeDate: z.date().optional(),
  closedBy: z.union([z.literal('tp/sl'), z.literal('user')]).optional(),
  closedAt: z.number().optional(),
  tags: z.array(z.number().max(10)).optional(),
  orderType: z
    .union([
      z.literal('market_order'),
      z.literal('buy_limit'),
      z.literal('buy_stop'),
      z.literal('sell_limit'),
      z.literal('sell_stop'),
    ])
    .optional(),
  comment: z.string().optional(),
  entryPrice: z.number().optional(),
});

export type TradeFormSchemaType = z.infer<typeof TradeFormSchema>;

export const EditTradeFormSchema = TradeFormSchema.extend({
  deleteFiles: z.array(filesObject).optional(),
});
export type EditTradeFormSchemaType = z.infer<typeof EditTradeFormSchema>;

export type Trade = {
  id: number;
  pair: Pair;
  tradingSession: TradingSession;
  result: Result;
  direction: Direction;
  tags: Tag[];
  openDate?: string;
  closeDate?: string;
} & Omit<
  TradeFormSchemaType,
  'pairId' | 'tradingSessionId' | 'result' | 'direction' | 'tags' | 'openDate' | 'closeDate'
>;

export type TradesResult = PaginationInfo<Trade[]>;

export type TradesCount = {
  tradingSession: number;
  count: number;
};

import { z } from 'zod';

export type Result = 'win' | 'loss' | 'be';
export type Direction = 'long' | 'short';
export type ClosedBy = 'tp/sl' | 'user';
export type OrderType = 'market_order' | 'buy_limit' | 'buy_stop' | 'sell_limit' | 'sell_stop';

export const TradeFormSchema = z.object({
  pairId: z.number().positive(),
  result: z.union([z.literal('win'), z.literal('loss'), z.literal('be')]),
  direction: z.union([z.literal('long'), z.literal('short')]),
  stopLoss: z.number().positive().nullable(),
  takeProfit: z.number().positive().nullable(),
  openDate: z.date().nullable(),
  closeDate: z.date().nullable(),
  closedBy: z.union([z.literal('tp/sl'), z.literal('user')]).nullable(),
  closedAt: z.number().positive().nullable(),
  orderType: z
    .union([
      z.literal('market_order'),
      z.literal('buy_limit'),
      z.literal('buy_stop'),
      z.literal('sell_limit'),
      z.literal('sell_stop'),
    ])
    .nullable(),
  comment: z.string().nullable(),
  entryPrice: z.number().nullable(),
});

export type TradeFormSchemaType = z.infer<typeof TradeFormSchema>;
export type Trade = {
  id: number;
  pairId: number;
  tradingSession: number;
  result: Result;
  direction: Direction;
} & Omit<TradeFormSchemaType, 'pairId' | 'tradingSessionId' | 'result' | 'direction'>;

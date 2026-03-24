import { z } from 'zod';

export enum ResultOptions {
  WIN = 'win',
  LOSS = 'loss',
  BE = 'be',
}

export enum DirectionOptions {
  LONG = 'long',
  SHORT = 'short',
}

export enum OrderTypeOptions {
  MARKET = 'market_order',
  BUY_LIMIT = 'buy_limit',
  BUY_STOP = 'buy_stop',
  SELL_LIMIT = 'sell_limit',
  SELL_STOP = 'sell_stop',
}

export enum ClosedByOptions {
  TP_SL = 'tp/sl',
  USER = 'user',
}

export const TradeFormSchema = z.object({
  pairId: z.number().positive(),
  tradingSessionId: z.number().positive(),
  result: z.enum(ResultOptions),
  direction: z.enum(DirectionOptions),
  stopLoss: z.number().positive().optional(),
  takeProfit: z.number().positive().optional(),
  openDate: z.date().optional(),
  closeDate: z.date().optional(),
  closedBy: z.enum(ClosedByOptions).optional(),
  closedAt: z.number().positive().optional(),
  orderType: z.enum(OrderTypeOptions).optional(),
  comment: z.string().optional(),
  entryPrice: z.number().optional(),
});

export type TradeFormSchemaType = z.infer<typeof TradeFormSchema>;
export type Trade = { id: number } & TradeFormSchemaType;

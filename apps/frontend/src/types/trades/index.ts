import { z } from 'zod';
import { TagType } from '../tags';

const filesObject = z.object({
  _id: z.string(),
  path: z.string(),
  name: z.string(),
  mime: z.string(),
  size: z.number(),
  originalName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type FilesType = z.infer<typeof filesObject>;

export enum TradeDirection {
  BUY = 'buy',
  SELL = 'sell',
}

export enum TradeResult {
  WIN = 'win',
  LOSS = 'loss',
  BE = 'be',
}

export enum OrderType {
  MARKET = 'market_order',
  BUY_LIMIT = 'buy_limit',
  BUY_STOP = 'buy_stop',
  SELL_LIMIT = 'sell_limit',
  SELL_STOP = 'sell_stop',
}

export enum ClosedBy {
  TP_SL = 'TP/SL',
  USER = 'user',
}

export const tradeFormSchema = z.object({
  openDate: z.date().optional(),
  closeDate: z.date().optional(),
  pair: z.string(),
  result: z.enum(TradeResult),
  stopLoss: z.number().positive(),
  takeProfit: z.number().positive(),
  direction: z.enum(TradeDirection),
  orderType: z.enum(OrderType).default(OrderType.MARKET),
  closedBy: z.enum(ClosedBy).default(ClosedBy.TP_SL),
  closedAt: z.number().optional(),
  pl: z.number().optional(),
  comment: z.string().optional(),
  files: z.array(z.union([z.instanceof(File), filesObject])).optional(),
  tags: z.array(z.string()).optional(),
});

export type TradeFormSchemaType = z.infer<typeof tradeFormSchema>;

export const editTradeFormSchema = tradeFormSchema.extend({
  deleteFiles: z.array(filesObject).optional(),
});

export type EditTradeFormSchemaType = z.infer<typeof editTradeFormSchema>;

export type TradeType = { id: string; _id: string; files?: FilesType[]; tags?: TagType[] } & Omit<
  TradeFormSchemaType,
  'files' | 'tags'
>;

export type TradeFilters = {
  pair?: string;
  direction?: string;
  result?: string;
  openDate?: string;
  closeDate?: string;
  tags?: string;
};
export type TradesResult = { results: TradeType[]; totalCount: number; count: number };

// Stats
export type NumOfTradesPerDate = {
  _id: string;
  count: number;
  list: {
    id: string;
    result: TradeResult;
    pair: string;
    direction: TradeDirection;
    closeDate: string;
    openDate: string;
    takeProfit: number;
    stopLoss: number;
  }[];
};

export type GroupedByResult = { _id: TradeResult; count: number };
export type GroupedByPair = { pair: string; results: { result: TradeResult; count: number }[] };
export type MostProfitablePair = { _id: number; pairs: { pair: string; count: number }[] };
export type WinRateByDirection = { _id: TradeDirection; win: number; loss: number; be: number };
export type GeneralStatsInfo = {
  avgTakeProfit: number;
  avgStopLoss: number;
  avgTradeDuration: number;
  consecutiveLosses: number;
  consecutiveWins: number;
  winRateByDirection: WinRateByDirection[];
  avgTradesPerWeek: number;
};

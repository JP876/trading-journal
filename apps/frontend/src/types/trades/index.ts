import { z } from 'zod';

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

export const tradeFormSchema = z.object({
  openDate: z.date().optional(),
  closeDate: z.date().optional(),
  pair: z.string(),
  result: z.nativeEnum(TradeResult),
  stopLoss: z.number().positive(),
  takeProfit: z.number().positive(),
  direction: z.nativeEnum(TradeDirection),
  pl: z.number().optional(),
  comment: z.string().optional(),
  files: z.array(z.union([z.instanceof(File), filesObject])).optional(),
});

export type TradeFormSchemaType = z.infer<typeof tradeFormSchema>;

export const editTradeFormSchema = tradeFormSchema.extend({
  deleteFiles: z.array(filesObject).optional(),
});

export type EditTradeFormSchemaType = z.infer<typeof editTradeFormSchema>;

export type TradeType = { id: string; _id: string; files?: FilesType[] } & Omit<TradeFormSchemaType, 'files'>;

export type TradeFilters = {
  pair?: string;
  direction?: string;
  result?: string;
  openDate?: string;
  closeDate?: string;
};
export type TradesResult = { results: TradeType[]; totalCount: number; count: number };

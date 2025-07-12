import { z } from 'zod';

export enum TradeDialogListIds {
  ADD_TRADE = 'addTrade',
  EDIT_TRADE = 'editTrade',
  DELETE_TRADE = 'deleteTrade',
  TRADE_DETAILS = 'tradeDetails',
  TRADE_FILES = 'tradeFiles',
}

const filesObject = z.object({ id: z.string(), url: z.string(), name: z.string() });
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
  deleteFiles: z.array(z.string()).optional(),
});

export type EditTradeFormSchemaType = z.infer<typeof editTradeFormSchema>;

export type TradeType = { _id: string; files?: FilesType[] } & Omit<TradeFormSchemaType, 'files'>;

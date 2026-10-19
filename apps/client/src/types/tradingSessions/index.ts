import { z } from 'zod';

import type { PaginationInfo } from '..';

export const TradingSessionFormSchema = z.object({
  title: z.string().nonempty('This field is required'),
  description: z.string().max(400).optional(),
  accountSize: z.number().positive(),
  isMain: z.boolean().optional(),
  defaultPairId: z.number().positive().optional(),
  defaultTakeProfit: z.number().int().positive().optional(),
  defaultStopLoss: z.number().positive().optional(),
  defaultOpenDate: z.date().optional(),
  defaultPositionSize: z.number().positive().optional(),
});

export type TradingSessionFormSchemaType = z.infer<typeof TradingSessionFormSchema>;
export type TradingSession = {
  id: number;
  isMain: number;
  defaultPair: number | null;
  createdAt: string;
  updatedAt: string;
  defaultOpenDate?: string;
} & Omit<TradingSessionFormSchemaType, 'isMain' | 'defaultPairId' | 'defaultOpenDate'>;

export type TradingSessionsResult = PaginationInfo<TradingSession[]>;

export type GetTradingSessionsOptions = {
  page?: number;
  rowsPerPage?: number;
  title?: string;
};

import { z } from 'zod';

import type { PaginationInfo } from '..';
import type { Pair } from '../pair';

export const TradingSessionFormSchema = z.object({
  title: z.string().nonempty('This field is required'),
  description: z.string().max(400).optional(),
  isMain: z.boolean().optional(),
  defaultPairId: z.number().positive().optional(),
  defaultTakeProfit: z.number().int().positive().optional(),
  defaultStopLoss: z.number().positive().optional(),
  defaultOpenDate: z.date().optional(),
});

export type TradingSessionFormSchemaType = z.infer<typeof TradingSessionFormSchema>;
export type TradingSession = {
  id: number;
  isMain: number;
  defaultPair: Pair;
  createdAt: string;
  updatedAt: string;
} & Omit<TradingSessionFormSchemaType, 'isMain' | 'defaultPairId'>;

export type TradingSessionsResult = PaginationInfo<TradingSession[]>;

import { z } from 'zod';

import type { PaginationInfo } from '..';

export const TradingSessionFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isMain: z.boolean().optional(),
});

export type TradingSessionFormSchemaType = z.infer<typeof TradingSessionFormSchema>;
export type TradingSession = { id: number; isMain: number; tradesCount: number } & Omit<
  TradingSessionFormSchemaType,
  'isMain'
>;

export type TradingSessionsResult = PaginationInfo<TradingSession[]>;

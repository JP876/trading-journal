import { z } from 'zod';

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

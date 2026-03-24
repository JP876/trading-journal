import { z } from 'zod';

export const TradingSessionFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isMain: z.number().min(0).max(1).optional(),
});

export type TradingSessionFormSchemaType = z.infer<typeof TradingSessionFormSchema>;
export type TradingSession = { id: number } & TradingSessionFormSchemaType;

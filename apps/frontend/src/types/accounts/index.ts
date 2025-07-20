import { z } from 'zod';

export const accountFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isMain: z.boolean().optional(),
  defaultStopLoss: z.number().positive().optional(),
  defaultTakeProfit: z.number().positive().optional(),
});

export type AccountFormSchemaType = z.infer<typeof accountFormSchema>;
export type AccountType = { _id: string } & AccountFormSchemaType;

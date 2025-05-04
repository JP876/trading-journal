import { z } from 'zod';

export const userFormSchema = z.object({
  userName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userSettings: z
    .object({
      tradesColumnVisibility: z.object({}).optional(),
      defaultStopLoss: z.number().positive().optional(),
      defaultTakeProfit: z.number().positive().optional(),
    })
    .optional(),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;

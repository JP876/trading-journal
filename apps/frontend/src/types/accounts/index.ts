import { z } from 'zod';

export const accountFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isMain: z.boolean().optional(),
});

export type AccountFormSchemaType = z.infer<typeof accountFormSchema>;
export type AccountType = { _id: string } & AccountFormSchemaType;

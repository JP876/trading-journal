import z from 'zod';

import type { User } from '../user';

export const TagFormSchema = z.object({
  title: z.string(),
  color: z.string(),
});

export type TagFormSchemaType = z.infer<typeof TagFormSchema>;
export type Tag = { id: number; user: User; createdAt: string; updatedAt: string } & TagFormSchemaType;

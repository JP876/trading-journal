import z from 'zod';

import type { User } from '../user';

export const TagFormSchema = z.object({
  title: z.string().min(2, 'This field is required.'),
  color: z.string().min(2, 'This field is required.'),
});

export type TagFormSchemaType = z.infer<typeof TagFormSchema>;
export type Tag = { id: number; user: User; createdAt: string; updatedAt: string } & TagFormSchemaType;

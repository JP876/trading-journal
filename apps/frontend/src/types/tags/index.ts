import z from 'zod';

export const tagFormSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export type TagFormSchemaType = z.infer<typeof tagFormSchema>;
export type TagType = { _id: string; user: string; createdAt: string; updatedAt: string } & TagFormSchemaType;

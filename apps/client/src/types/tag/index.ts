import z from 'zod';

export const TagFormSchema = z.object({
  title: z.string().min(2, 'This field is required.'),
  color: z.string().min(2, 'This field is required.'),
});

export type TagFormSchemaType = z.infer<typeof TagFormSchema>;
export type Tag = { id: number; createdAt: string; updatedAt: string } & TagFormSchemaType;

export type GetTagsOptions = {
  page?: number;
  rowsPerPage?: number;
  title?: string;
};

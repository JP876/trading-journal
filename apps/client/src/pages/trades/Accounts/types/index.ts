import { z } from 'zod';

export enum AccountDialogListIds {
  ADD_ACCOUNT = 'addAccount',
  EDIT_ACCOUNT = 'editAccount',
  DELETE_ACCOUNT = 'deleteAccount',
}

export const accountFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isMain: z.boolean().optional(),
});

export type AccountFormSchemaType = z.infer<typeof accountFormSchema>;
export type AccountType = { _id: string } & AccountFormSchemaType;

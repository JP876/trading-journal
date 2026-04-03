import { z } from 'zod';
import {
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormStateReturn,
} from 'react-hook-form';

export type APIError = { error: string; message: string; statusCode: number };

export type ModalInfo<T = {}> = {
  data?: T;
};
export type ModalAtom = Record<string, ModalInfo>;

export type SelectOption<T = string | number> = {
  value: T;
  label: string;
  chipBackground?: string;
};
export type AutocompleteOption<T = string | number> = SelectOption<T> & { groupBy?: string };

export type FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName>;

export type ControllerRenderOptions = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
};

export const filesObject = z.object({
  _id: z.string(),
  path: z.string(),
  name: z.string(),
  mime: z.string(),
  size: z.number(),
  originalName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Files = z.infer<typeof filesObject>;

export type PaginationInfo<T> = {
  results: T;
  totalItems: number;
  totalItemsExcludingQuery: number;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
};

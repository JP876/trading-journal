import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

export type ErrorResponse = {
  error: string;
  message: string | string[];
  statusCode: number;
};

export type SelectOptionType = {
  id: string;
  label: string;
};

export type FormFieldType<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName>;

export type TablePaginationType = {
  page: number;
  rowsPerPage?: number;
};

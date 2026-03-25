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

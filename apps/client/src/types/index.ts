export type APIError = { error: string; message: string; statusCode: number };

export type ModalInfo<T = {}> = {
  data: T;
};
export type ModalAtom = Record<string, ModalInfo>;

import { atom, createStore } from 'jotai';

type TDzStatusOptions = 'isDragging';
type TDzStatus = { [key in TDzStatusOptions]: boolean };

export type TDzFile = {
  fileId: string;
  file: File;
};

const INITIAL_STATUS: TDzStatus = {
  isDragging: false,
};

export const dzFilesAtom = atom<TDzFile[] | null>(null);

export const dzSetFilesAtom = atom(null, (_, set, value: File[]) => {
  let nextValue = value.map((file: File) => ({ file, fileId: crypto.randomUUID() }));
  set(dzFilesAtom, nextValue);
});

export const dzRemoveFileAtom = atom(null, (get, set, value: string) => {
  let prevFiles = get(dzFilesAtom);
  if (!prevFiles) return;
  let nextValue = prevFiles.filter((el) => el.fileId !== value);
  set(dzFilesAtom, nextValue);
});

export const dzIsDraggingAtom = atom<boolean>((get) => {
  return get(dzStatusAtom).isDragging;
});

export const dzStatusAtom = atom<TDzStatus>(INITIAL_STATUS);
export const dzUpateStatusAtom = atom(null, (get, set, value: TDzStatus) => {
  set(dzStatusAtom, { ...get(dzStatusAtom), ...value });
});

export const dzContianerElAtom = atom<HTMLElement | null>(null);
export const dzInputElAtom = atom<HTMLElement | null>(null);

export const dropzoneStore = createStore();

export const clearDropzoneStore = atom(null, () => {
  dropzoneStore.set(dzFilesAtom, null);
  dropzoneStore.set(dzStatusAtom, INITIAL_STATUS);
  dropzoneStore.set(dzContianerElAtom, null);
  dropzoneStore.set(dzInputElAtom, null);
});

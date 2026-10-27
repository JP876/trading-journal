import { atom, createStore } from 'jotai';

type TDzStatusOptions = 'isDragging';
type TDzStatus = { [key in TDzStatusOptions]: boolean };

const INITIAL_STATUS: TDzStatus = {
  isDragging: false,
};

export const dzFilesAtom = atom<{ fileId: string; file: File }[] | null>(null);

export const dzSetFilesAtom = atom(null, (_, __, value: File[]) => {
  let nextValue = value.map((file: File) => ({ file, fileId: crypto.randomUUID() }));
  dropzoneStore.set(dzFilesAtom, nextValue);
});

export const dzRemoveFileAtom = atom(null, (_, __, value: string) => {
  let prevFiles = dropzoneStore.get(dzFilesAtom);
  if (!prevFiles) return;
  let nextValue = prevFiles.filter((el) => el.fileId !== value);
  dropzoneStore.set(dzFilesAtom, nextValue);
});

export const dzIsDraggingAtom = atom<boolean>((get) => get(dzStatusAtom).isDragging);

export const dzStatusAtom = atom<TDzStatus>(INITIAL_STATUS);
export const dzUpateStatusAtom = atom(null, (_, __, value: TDzStatus) => {
  dropzoneStore.set(dzStatusAtom, { ...dropzoneStore.get(dzStatusAtom), ...value });
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

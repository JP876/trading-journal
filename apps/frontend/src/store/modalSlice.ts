import { StateCreator } from 'zustand';

type modalInfo = {
  open?: boolean;
  data?: any;
};

type ModalInfoById = Record<string, modalInfo>;

export interface IModalSlice {
  modalInfo: ModalInfoById;
  openModal: (info: modalInfo & { id: string }) => void;
  closeModal: (id: string) => void;
}

const createModalSlice: StateCreator<IModalSlice> = (set, get) => ({
  modalInfo: {},
  openModal: (info: modalInfo & { id: string }) => {
    return set(() => ({
      modalInfo: { ...get().modalInfo, [info.id]: { data: { ...info?.data }, open: true } },
    }));
  },
  closeModal: (id: string) => {
    const modalInfoCopy = { ...get().modalInfo };
    delete modalInfoCopy[id];
    return set(() => ({ modalInfo: modalInfoCopy }));
  },
});

export default createModalSlice;

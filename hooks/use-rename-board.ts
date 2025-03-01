import { create } from "zustand";

type defaultBoard = {
  id: string;
  title: string;
};

interface Props {
  id: string;
  title: string;
  isOpen: boolean;
  setTitle: (title: string) => void;
  onOpen: ({ id, title }: defaultBoard) => void;
  onClose: () => void;
}

const useRenameBoard = create<Props>((set) => ({
  id: "",
  title: "",
  isOpen: false,
  setTitle: (title: string) => set({ title }),
  onOpen: ({ id, title }: defaultBoard) => set({ isOpen: true, id, title }),
  onClose: () => set({ isOpen: false, id: "", title: "" }),
}));

export default useRenameBoard;

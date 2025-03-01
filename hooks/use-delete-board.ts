import { create } from "zustand";

type Variables = {
  id: string;
  title: string;
  description: string;
  disabled: boolean;
  onContinue: () => void;
};

interface Props {
  id: string;
  isOpen: boolean;
  title: string;
  description: string;
  disabled: boolean;
  onContinue: () => void;
  onOpen: ({ id, title, description, disabled, onContinue }: Variables) => void;
  onClose: () => void;
}

const useDeleteBoard = create<Props>((set) => ({
  id: "",
  title: "",
  description: "",
  isOpen: false,
  disabled: false,
  onContinue: () => {},
  onOpen: ({ id, title, description, disabled, onContinue }: Variables) =>
    set({ isOpen: true, id, title, description, disabled, onContinue }),
  onClose: () =>
    set({
      isOpen: false,
      id: "",
      title: "",
      description: "",
      disabled: false,
      onContinue: () => {},
    }),
}));

export default useDeleteBoard;

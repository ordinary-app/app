import { create } from "zustand";

interface IProfileSelectState {
  isProfileSelectModalOpen: boolean;
  setProfileSelectModalOpen: (isOpen: boolean) => void;
}

export const useProfileSelectStore = create<IProfileSelectState>((set) => ({
  isProfileSelectModalOpen: false,
  setProfileSelectModalOpen: (isOpen: boolean) => set({ isProfileSelectModalOpen: isOpen }),
}));

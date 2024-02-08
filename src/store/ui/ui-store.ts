import { create } from 'zustand';

interface State {
  isSideMenuOpen: boolean;
}

interface Action {
  openSideMenu: () => void;
  closeSideMenu: () => void;
}

export const useUIStore = create<State & Action>()((set) => ({
  isSideMenuOpen: false,

  openSideMenu: () => set({ isSideMenuOpen: true }),
  closeSideMenu: () => set({ isSideMenuOpen: false }),
}));

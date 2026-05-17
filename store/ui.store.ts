'use client';

import { create } from "zustand";

export type SharedDrawer = "mobile-nav" | "cart" | null;
export type SharedModal = "cart" | null;

type UIStoreState = {
  activeDrawer: SharedDrawer;
  activeModal: SharedModal;
  openDrawer: (drawer: Exclude<SharedDrawer, null>) => void;
  closeDrawer: () => void;
  openModal: (modal: Exclude<SharedModal, null>) => void;
  closeModal: () => void;
};

export const useUIStore = create<UIStoreState>()((set) => ({
  activeDrawer: null,
  activeModal: null,
  openDrawer: (drawer) => set({ activeDrawer: drawer }),
  closeDrawer: () => set({ activeDrawer: null }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));

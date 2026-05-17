'use client';

import { create } from "zustand";

import type { ISODateString } from "@/types/common.types";

export type ReservationPrefill = {
  date?: ISODateString;
  timeSlotId?: string;
  guestCount?: number;
};

type ReservationStoreState = ReservationPrefill & {
  setPrefill: (value: Partial<ReservationPrefill>) => void;
  clearPrefill: () => void;
};

export const useReservationStore = create<ReservationStoreState>()((set) => ({
  date: undefined,
  timeSlotId: undefined,
  guestCount: undefined,
  setPrefill: (value) => set((state) => ({ ...state, ...value })),
  clearPrefill: () =>
    set({
      date: undefined,
      timeSlotId: undefined,
      guestCount: undefined,
    }),
}));

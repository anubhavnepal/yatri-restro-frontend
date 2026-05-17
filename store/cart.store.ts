'use client';

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { OrderType } from "@/types/order.types";

export type CartSelectionItem = {
  menuItemId: string;
  quantity: number;
  variantId?: string;
  addonIds: string[];
};

type AddCartItemInput = {
  menuItemId: string;
  quantity?: number;
  variantId?: string;
  addonIds?: string[];
};

type CartStoreState = {
  items: CartSelectionItem[];
  orderType: OrderType;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (item: Pick<CartSelectionItem, "menuItemId" | "variantId" | "addonIds">) => void;
  updateQuantity: (
    item: Pick<CartSelectionItem, "menuItemId" | "variantId" | "addonIds">,
    quantity: number,
  ) => void;
  clearCart: () => void;
  setOrderType: (orderType: OrderType) => void;
};

function normalizeAddonIds(addonIds?: string[]) {
  return [...new Set(addonIds ?? [])].sort();
}

function getItemKey(item: Pick<CartSelectionItem, "menuItemId" | "variantId" | "addonIds">) {
  return JSON.stringify({
    menuItemId: item.menuItemId,
    variantId: item.variantId ?? null,
    addonIds: normalizeAddonIds(item.addonIds),
  });
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      items: [],
      orderType: "DINE_IN",
      addItem: (item) =>
        set((state) => {
          const normalizedItem: CartSelectionItem = {
            menuItemId: item.menuItemId,
            quantity: Math.max(1, item.quantity ?? 1),
            variantId: item.variantId,
            addonIds: normalizeAddonIds(item.addonIds),
          };

          const itemKey = getItemKey(normalizedItem);
          const existingIndex = state.items.findIndex(
            (currentItem) => getItemKey(currentItem) === itemKey,
          );

          if (existingIndex === -1) {
            return {
              items: [...state.items, normalizedItem],
            };
          }

          return {
            items: state.items.map((currentItem, index) =>
              index === existingIndex
                ? {
                    ...currentItem,
                    quantity: currentItem.quantity + normalizedItem.quantity,
                  }
                : currentItem,
            ),
          };
        }),
      removeItem: (item) =>
        set((state) => ({
          items: state.items.filter(
            (currentItem) => getItemKey(currentItem) !== getItemKey(item),
          ),
        })),
      updateQuantity: (item, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (currentItem) => getItemKey(currentItem) !== getItemKey(item),
              ),
            };
          }

          return {
            items: state.items.map((currentItem) =>
              getItemKey(currentItem) === getItemKey(item)
                ? { ...currentItem, quantity }
                : currentItem,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      setOrderType: (orderType) => set({ orderType }),
    }),
    {
      name: "yatri-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        orderType: state.orderType,
      }),
      version: 1,
    },
  ),
);

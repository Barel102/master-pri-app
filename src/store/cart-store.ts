"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  decreaseItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

function computeTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function computeItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.productId,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },

      decreaseItem: (productId) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === productId,
          );
          if (!existing) return state;

          if (existing.quantity <= 1) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            ),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "fresh-produce-cart",
    },
  ),
);

export function useCartItems() {
  return useCartStore(useShallow((s) => s.items));
}

export function useCartItemCount() {
  return useCartStore((s) => computeItemCount(s.items));
}

export function useCartTotal() {
  return useCartStore((s) => computeTotal(s.items));
}

export function useProductQuantity(productId: number) {
  return useCartStore(
    (s) => s.items.find((item) => item.productId === productId)?.quantity ?? 0,
  );
}

export function useCartActions() {
  return useCartStore(
    useShallow((s) => ({
      addItem: s.addItem,
      decreaseItem: s.decreaseItem,
      removeItem: s.removeItem,
      clearCart: s.clearCart,
    })),
  );
}

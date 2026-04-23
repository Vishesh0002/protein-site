import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  title: string;
  image: string;
  price: number;
  mrp: number;
}

interface WishlistState {
  items: WishlistItem[];

  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clear: () => void;

  // Queries
  has: (id: string) => boolean;
  count: () => number;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (get().items.some((i) => i.id === item.id)) return;
        set({ items: [...get().items, item] });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      clear: () => set({ items: [] }),

      has: (id) => get().items.some((i) => i.id === id),
      count: () => get().items.length,
    }),
    {
      name: "protein-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

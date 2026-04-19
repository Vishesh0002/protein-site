import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  mrp: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, qty: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      getTotal: () => get().getSubtotal(),
    }),
    {
      name: 'protein-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen
    }
  )
);

export function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

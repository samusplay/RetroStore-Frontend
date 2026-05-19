import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
  productIds: () => string[];
}
//logica para agregar varios productos acciones del carrito
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.find(i => i.id === item.id);
        if (exists) return;
        set(state => ({ items: [...state.items, item] }));
      },
      removeItem: (id) =>
        set(state => ({ items: state.items.filter(i => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + i.price, 0),
      productIds: () => get().items.map(i => i.id),
    }),
    { name: 'retrostore-cart' }
  )
);
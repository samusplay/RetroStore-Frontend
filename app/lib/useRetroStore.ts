import { create } from 'zustand';
// Importamos el Type que Zod generó por nosotros
import type { RetroProduct } from '@/app/catalogo/schemas/retro.schema';

interface RetroStore {
  activeProduct: RetroProduct | null;
  isDragging: boolean;
  setActiveProduct: (product: RetroProduct | null) => void;
  setIsDragging: (dragging: boolean) => void;
}
//usamos Zustand para guardar el estado a la hora que cambia
export const useRetroStore = create<RetroStore>((set) => ({
  activeProduct: null,
  isDragging: false,
  
  setActiveProduct: (product) => set({ activeProduct: product }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
}));
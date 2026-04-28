import { create } from 'zustand';
import type { ProductIdType } from '../catalogo/schemas/productId.schema';

interface ProductDetailStore {
    selectedProduct: ProductIdType | null;
    isLoadingDetail: boolean;

    // Acciones
    setSelectedProduct: (product: ProductIdType | null) => void;
    setIsLoadingDetail: (loading: boolean) => void;
    clearProductDetail: () => void;
}

export const useProductDetailStore = create<ProductDetailStore>((set) => ({
    selectedProduct: null,
    isLoadingDetail: true, // Por defecto cargando al entrar a la vista

    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setIsLoadingDetail: (loading) => set({ isLoadingDetail: loading }),

    // Función vital para limpiar el estado cuando le demos al botón "Regresar"
    clearProductDetail: () => set({ selectedProduct: null, isLoadingDetail: true }),
}));
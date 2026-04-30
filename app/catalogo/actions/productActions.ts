// app/actions/productActions.ts

import { apiClient } from '@/app/config/apiClient';
import { ProductsResponseSchema, type Product } from '../schemas/product.schema';

export async function getProductsAction(category?: string): Promise<Product[]> {
  try {
    // 1. Construimos el endpoint base
    let endpoint = 'products';

    // 2. Si hay una categoría y no es 'TODOS', la agregamos como query param
    // IMPORTANTE: El backend espera VIDEOJUEGO, VINILO o ROPA
    if (category && category !== 'TODOS') {
      endpoint = `products?category=${category}`;
    }

    // 3. Llamamos al api client con la ruta dinámica
    const data = await apiClient<Product[]>(endpoint, {
      method: 'GET',
      cache: 'no-store'
    });

    // 4. Validamos con Zod (esto te protege de datos corruptos del backend)
    return ProductsResponseSchema.parse(data);
  } catch (error) {
    console.error("Error fetching products with filter:", error);
    throw error;
  }
}
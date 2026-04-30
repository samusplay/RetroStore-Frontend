
import { apiClient } from '@/app/config/apiClient';
import { ProductIdSchema, type ProductIdType } from '../schemas/productId.schema';

export async function getProductByIdAction(id: string): Promise<ProductIdType> {
  try {
    // Consultamos el endpoint dinámico
    const data = await apiClient<ProductIdType>(`products/${id}`, {
      method: 'GET',
      cache: 'no-store'
    });

    // Validamos la respuesta con el nuevo esquema
    return ProductIdSchema.parse(data);
  } catch (error) {
    console.error(`[Error Action ID]: No se pudo obtener el producto ${id}`, error);
    throw error;
  }
}
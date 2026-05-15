import { apiClient } from "@/app/config/apiClient";
import { UpdateProductInput } from "../schemas/update-product.schema";

// 1. Obtener los productos del seller (Dashboard)
export async function getMyProductsAction(): Promise<any[]> {
  try {
    return await apiClient<any[]>("/products/inventory", {
      method: "GET",
      auth: true,
    });
  } catch (error: any) {
    throw new Error(error.message || "Error al cargar tu inventario");
  }
}

// 2. Actualizar producto
export async function updateProductAction(
  id: string,
  updateData: UpdateProductInput
): Promise<{ message: string }> {
  try {
    return await apiClient<{ message: string }>(`/products/${id}`, {
      method: "PATCH",
      body: updateData,
      auth: true,
    });
  } catch (error: any) {
    throw new Error(error.message || "Fallo crítico al intentar actualizar el producto");
  }
}

// 3. Desactivar producto
export async function deactivateProductAction(
  id: string
): Promise<{ message: string }> {
  try {
    return await apiClient<{ message: string }>(`/products/${id}/deactivate`, {
      method: "PATCH",
      auth: true,
    });
  } catch (error: any) {
    throw new Error(error.message || "Fallo crítico al intentar desactivar el producto");
  }
}

// 4. Reactivar producto
export async function activateProductAction(
  id: string
): Promise<{ message: string }> {
  try {
    return await apiClient<{ message: string }>(`/products/${id}/activate`, {
      method: "PATCH",
      auth: true,
    });
  } catch (error: any) {
    throw new Error(error.message || "Fallo crítico al intentar reactivar el producto");
  }
}
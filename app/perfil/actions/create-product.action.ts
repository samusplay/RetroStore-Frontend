
import { apiClient } from "@/app/config/apiClient";
import { CreateProductResponseDto } from "../schemas/create-product.schema";



/**
 * Función interna para generar un código único de producto
 * de forma que el usuario no tenga que gestionarlo manualmente.
 */
const generateInternalCode = (category: string): string => {
  const prefix = category.substring(0, 3).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${randomSuffix}`;
};

export async function createProductAction(formData: FormData): Promise<CreateProductResponseDto> {
  try {
    // 1. Extraemos la categoría para generar el código acorde al tipo de producto
    const category = formData.get("category") as string || "GEN";
    
    // 2. Inyectamos el código aleatorio "por debajo"
    const randomCode = generateInternalCode(category);
    formData.set("code", randomCode);

    // 3. Realizamos la petición usando el apiClient
    // El cliente detectará que es FormData y no pondrá el Content-Type: application/json
    return await apiClient<CreateProductResponseDto>("/products", {
      method: "POST",
      body: formData,
      auth: true, 
    });
    
  } catch (error: any) {
    // Re-lanzamos el error para que el componente (LoginForm/ProductForm) lo atrape y lo muestre con toast
    throw new Error(error.message || "Fallo crítico al intentar crear el producto");
  }
}
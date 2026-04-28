import { z } from 'zod';

// 1. Esquema para un solo producto basado en tu JSON
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "El nombre es obligatorio"),
  imageUrl: z.string().url("Debe ser una URL válida"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  seller: z.string().min(1, "El vendedor es obligatorio")
});

// 2. Esquema para la lista de productos (la respuesta del GET)
export const ProductsResponseSchema = z.array(ProductSchema);

// 3. Tipos inferidos para TypeScript
export type Product = z.infer<typeof ProductSchema>;
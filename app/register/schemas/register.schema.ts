import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  email: z.email("El formato del email es incorrecto"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  // Lo que espera el backend
  role: z.enum(['COLLECTOR', 'SELLER']), 
  favoriteConsole: z.string().min(1, "La consola favorita es requerida"),
  storeName: z.string().optional(),
}).refine((data) => {
  // Regla de negocio: Si es Seller, la tienda no puede estar vacía
  if (data.role === 'SELLER' && (!data.storeName || data.storeName.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "El nombre de la tienda es requerido para un vendedor",
  path: ["storeName"], // Dispara el error directamente en el input de la tienda
});

export type RegisterInput = z.infer<typeof registerSchema>;
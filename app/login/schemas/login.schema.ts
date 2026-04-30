import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email("El formato del email es incorrecto"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Inferimos el tipo para usarlo en react-hook-form y en el Action
export type LoginInput = z.infer<typeof loginSchema>;
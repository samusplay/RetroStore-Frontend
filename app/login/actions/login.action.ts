'use server';

import { apiClient } from '@/app/config/apiClient';
import { loginSchema, type LoginInput } from '../schemas/login.schema';

export async function loginAction(data: LoginInput) {
  // 1. Validación estricta en el servidor con Zod
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    //accede al arreglo de erores
    throw new Error(parsed.error.issues[0].message);
  }

  // 2. Consumo de la API con tu cliente personalizado
  // El endpoint 'auth/login' devuelve el JWT y el objeto User
  const response = await apiClient<{ accessToken: string; user: any }>('auth/login', {
    method: 'POST',
    body: parsed.data,
  });

  // 3. Retornamos la respuesta al cliente
  return response;
}
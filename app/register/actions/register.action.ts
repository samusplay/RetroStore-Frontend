'use server';

import { apiClient } from '@/app/config/apiClient';
import { registerSchema, type RegisterInput } from '../schemas/register.schema';


export async function registerAction(data: RegisterInput) {
  // 1. Doble validación estricta en el servidor
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  // 2. Ensamblamos el payload limpio
  const payload: Record<string, string> = {
    username: parsed.data.username,
    email: parsed.data.email,
    password: parsed.data.password,
    role: parsed.data.role,
    favoriteConsole: parsed.data.favoriteConsole,
  };

  // Solo enviamos storeName si realmente es SELLER
  if (parsed.data.role === 'SELLER' && parsed.data.storeName) {
    payload.storeName = parsed.data.storeName;
  }

  
  // No necesitamos try/catch porque si falla, tu apiClient lanza el Error 
  // y lo capturaremos en el frontend con React Hot Toast.
  const response = await apiClient<any>('auth/register', {
    method: 'POST',
    body: payload,
  });

  return response;
}
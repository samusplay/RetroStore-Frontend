'use server';

import { apiClient } from '@/app/config/apiClient';
import { registerSchema, type RegisterInput } from '../schemas/register.schema';

export async function registerAction(data: RegisterInput) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const payload: Record<string, string> = {
    username: parsed.data.username,
    email: parsed.data.email,
    password: parsed.data.password,
    role: parsed.data.role,
    favoriteConsole: parsed.data.favoriteConsole,
  };

  if (parsed.data.role === 'SELLER' && parsed.data.storeName) {
    payload.storeName = parsed.data.storeName;
  }

  const response = await apiClient<any>('auth/register', {
    method: 'POST',
    body: payload,
  });

  return response;
}
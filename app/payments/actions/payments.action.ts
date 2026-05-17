'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function getToken(): string {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value ?? '';
}

function authHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function createPayment(data: {
  amount: number;
  method: 'card' | 'transfer';
  productId: string;
}) {
  const res = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? 'Error al crear el pago');
  }

  return res.json();
}

export async function getMyPayments() {
  const res = await fetch(`${API_URL}/payments/my-payments`, {
    headers: authHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Error al obtener tus pagos');
  return res.json();
}

export async function getPaymentStatus(id: string) {
  const res = await fetch(`${API_URL}/payments/${id}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Pago no encontrado');
  return res.json();
}

import { apiClient } from '@/app/config/apiClient';
import { createPaymentSchema, type CreatePaymentInput } from '../schemas/payment.schema';

export interface CreatePaymentResponse {
  payment: {
    id: string;
    amount: number;
    status: string;
    method: string;
    productIds: string[];
    buyerId: string;
    stripePaymentIntentId: string;
    createdAt: string;
  };
  clientSecret: string;
}

export async function createPayment(
  data: CreatePaymentInput,
): Promise<CreatePaymentResponse> {
  const validated = createPaymentSchema.parse(data);
  return await apiClient<CreatePaymentResponse>('/payments', {
    method: 'POST',
    body: validated,
    auth: true,
  });
}

export async function getMyPayments(): Promise<any[]> {
  return await apiClient<any[]>('/payments/my-payments', {
    method: 'GET',
    auth: true,
  });
}

export async function getPaymentStatus(id: string): Promise<any> {
  return await apiClient<any>(`/payments/${id}`, {
    method: 'GET',
    auth: true,
  });
}

//funciones para manejrar la logica de venta del Vendedor
export async function getAllPayments(): Promise<any[]> {
  return await apiClient<any[]>('/payments', {
    method: 'GET',
    auth: true,
  });
}

export async function updatePaymentStatus(
  id: string,
  status: 'completed' | 'failed' | 'pending',
): Promise<any> {
  return await apiClient<any>(`/payments/${id}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true,
  });
}
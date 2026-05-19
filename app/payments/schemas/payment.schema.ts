import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a 0'),
  method: z.enum(['card', 'transfer'], {
    message: 'Método debe ser card o transfer',
  }),
  productIds: z.array(z.string().min(1)).min(1, 'Debe incluir al menos un producto'),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
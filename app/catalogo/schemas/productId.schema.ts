import { z } from 'zod';

export const ProductIdSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  platform: z.string(),
  condition: z.string(),
  imageUrl: z.string().url(),
  trivia: z.string(),
  seller: z.string(),
  //buevos campos
  category: z.string(), // ¡Vital para saber si es vinilo!
  youtubeUrl: z.string().nullable().optional(), // La nueva URL
});

export type ProductIdType = z.infer<typeof ProductIdSchema>;
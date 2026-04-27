// app/catalogo/types/retro.schema.ts
import { z } from 'zod';

export const retroProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  platform: z.string(),
  condition: z.string(),
  imageUrl: z.string().url(),
  trivia: z.string(),
  seller: z.string(),
});

// Y aquí extraes el tipo para que Zustand lo pueda usar sin problemas
export type RetroProduct = z.infer<typeof retroProductSchema>;
import { z } from "zod";

export const Condition = {
  NUEVO: "NUEVO",
  USADO: "USADO"
} as const;

export const Category = {
  VINILO: "VINILO",
  VIDEO: "VIDEO",
  ROPA: "ROPA"
} as const;

export const createProductSchema = z.object({
  name: z.string({ message: 'El nombre del producto es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre es demasiado largo'),

  code: z.string().optional(),

  description: z.string({ message: 'La descripción es obligatoria' })
    .min(5, 'La descripción debe ser más detallada')
    .max(1000),


 price: z.coerce
    .number({ message: "El precio es obligatorio y debe ser un número" })
    .min(0.01, "El precio debe ser mayor a cero"),

  platform: z.string({ message: 'La plataforma es obligatoria' })
    .min(1, 'La plataforma es obligatoria'),

  condition: z.enum(["NUEVO", "USADO"], { 
    message: "Selecciona una condición válida" 
  }),

  category: z.enum(["VINILO", "VIDEO", "ROPA"], { 
    message: "Selecciona una categoría válida" 
  }),

  //  dejamos preprocess pero TIPADO correctamente
  youtubeUrl: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url("Debe ser una URL válida").optional()
  ),

  //  tipamos correctamente el custom
  image: z.custom<FileList>()
    .refine((files) => files?.length > 0, "La imagen del producto es obligatoria"),
})
.refine((data) => {
  if (data.category === "VINILO") {
    return !!data.youtubeUrl && data.youtubeUrl.trim() !== "";
  }
  return true;
}, {
  message: "El link de YouTube es obligatorio para los Vinilos.",
  path: ["youtubeUrl"] 
})
.refine((data) => {
  if (data.category !== "VINILO" && data.youtubeUrl) {
    return false;
  }
  return true;
}, {
  message: "Solo la categoría VINILO puede tener una URL de YouTube.",
  path: ["youtubeUrl"]
});
//Respuesta
export const createProductResponseSchema = z.object({
  message: z.string(),
  productId: z.string(),
});

export type CreateProductResponseDto = z.infer<typeof createProductResponseSchema>;


export type CreateProductFormValues = z.input<typeof createProductSchema>; 
export type CreateProductInput = z.output<typeof createProductSchema>;     
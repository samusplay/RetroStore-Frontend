import { z } from "zod";

export const updateProductSchema = z.object({
  price: z.coerce
    .number({ message: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a cero")
    .optional(),

  description: z
    .string({ message: "La descripción es obligatoria" })
    .min(5, "La descripción debe ser más detallada")
    .max(1000)
    .optional(),

  condition: z
    .enum(["NUEVO", "USADO"], {
      message: "Selecciona una condición válida",
    })
    .optional(),

  // ✅ string en el input, string | null en el output — RHF puede inferir ambos
  youtubeUrl: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal(""))       // acepta string vacío como valor válido del form
    .transform((val) => val === "" ? null : val)  // convierte "" → null al hacer submit
    .nullable(),
});

export type UpdateProductFormValues = z.input<typeof updateProductSchema>;
export type UpdateProductInput = z.output<typeof updateProductSchema>;
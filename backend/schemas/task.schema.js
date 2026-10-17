import z from "zod";

export const taskSchema = z.object({
  title: z
          .string({
            error: "El título es requerido y no puede estar vacío",
          })
          .trim()
          .min(1, { message: "El título es requerido y no puede estar vacío" }),
  description: z
                .string({
                  error: "La descripción es requerida y no puede estar vacía",
                })
                .trim()
                .min(1, { message: "La descripción es requerida y no puede estar vacía" }),
  date: z
          .iso.datetime({offset: true})
          .optional()
})
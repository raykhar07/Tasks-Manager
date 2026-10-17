import z from "zod";

export const taskSchema = z.object({
  title: z
          .string({
            error: "El título es requerido y no puede estar vacío",
          })
          .trim()
          .min(1, { message: "El título es requerido y no puede estar vacío" })
          .max(200, { message: "El título no puede superar los 200 caracteres" }),
  description: z
                .string({
                  error: "La descripción es requerida y no puede estar vacía",
                })
                .trim()
                .min(1, { message: "La descripción es requerida y no puede estar vacía" })
                .max(2000, { message: "La descripción no puede superar los 2000 caracteres" }),
  date: z
          .iso.datetime({offset: true})
          .optional()
})
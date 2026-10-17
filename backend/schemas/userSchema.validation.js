import z from "zod";

const email = z
  .string({
    error: "El email es requerido"
  })
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: "El email es inválido" }));

export const registerSchema = z.object({
  username: z
              .string({
                error: "El username es requerido",
              })
              .min(1, { message: "el username no puede estar vacío" })
              .max(50, { message: "el username no puede superar los 50 caracteres" })
              .trim(),
  email,
  password: z
            .string({
              error: "La contraseña es requerida",
            })
            .min(8, { message: "Password debe tener como mínimo 8 caracteres" })
            .max(128, { message: "Password no puede superar los 128 caracteres" })
})

export const loginSchema = z.object({
  email,
  password: z
            .string({
              error: "La contraseña es requerida",
            })
            .min(8, { message: "Password debe tener como mínimo 8 caracteres" })
            .max(128, { message: "Password no puede superar los 128 caracteres" }),
})

export const updateProfileSchema = z.object({
  username: z
              .string({
                error: "El username es requerido",
              })
              .min(1, { message: "el username no puede estar vacío" })
              .max(50, { message: "el username no puede superar los 50 caracteres" })
              .trim(),
  email,
})

export const updatePasswordSchema = z.object({
  currentPassword: z
                    .string({
                      error: "La contraseña actual es requerida",
                    })
                    .min(8, { message: "La contraseña actual debe tener como mínimo 8 caracteres" })
                    .max(128, { message: "La contraseña no puede superar los 128 caracteres" }),
  newPassword: z
                .string({
                  error: "La nueva contraseña es requerida",
                })
                .min(8, { message: "La nueva contraseña debe tener como mínimo 8 caracteres" })
                .max(128, { message: "La nueva contraseña no puede superar los 128 caracteres" })
})

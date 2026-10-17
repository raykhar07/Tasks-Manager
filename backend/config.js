import 'dotenv/config'

for (const key of ['JWT_SECRET', 'MONGODB_URI']) {
  if (!process.env[key]) throw new Error(`Falta la variable de entorno ${key}`)
}

// Un secreto corto se puede romper por fuerza bruta y permite falsificar
// tokens (suplantar a cualquier usuario). Exigimos una longitud mínima.
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET es demasiado corto: usa al menos 32 caracteres aleatorios')
}

const isProduction = process.env.NODE_ENV === 'production'

// SameSite de la cookie de sesión, configurable por entorno:
//   'lax'  (por defecto): cuando frontend y backend comparten sitio.
//   'none': cuando están en dominios distintos (exige HTTPS => Secure).
const cookieSameSite = (process.env.COOKIE_SAMESITE ?? 'lax').toLowerCase()
if (!['lax', 'strict', 'none'].includes(cookieSameSite)) {
  throw new Error("COOKIE_SAMESITE debe ser 'lax', 'strict' o 'none'")
}
if (cookieSameSite === 'none' && !isProduction) {
  throw new Error("COOKIE_SAMESITE=none exige NODE_ENV=production (cookie Secure)")
}

export const config = {
  PORT: process.env.PORT ?? 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET_KEY: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  COOKIE_SAMESITE: cookieSameSite,
  isProduction
}
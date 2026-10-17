import 'dotenv/config'

for (const key of ['JWT_SECRET', 'MONGODB_URI']) {
  if (!process.env[key]) throw new Error(`Falta la variable de entorno ${key}`)
}

// Un secreto corto se puede romper por fuerza bruta y permite falsificar
// tokens (suplantar a cualquier usuario). Exigimos una longitud mínima.
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET es demasiado corto: usa al menos 32 caracteres aleatorios')
}

export const config = {
  PORT: process.env.PORT ?? 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET_KEY: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production'
}
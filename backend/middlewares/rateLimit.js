import rateLimit from "express-rate-limit";

// Los tests automatizados lanzan muchas peticiones seguidas desde la misma IP;
// se desactiva el límite en el entorno de test para no volverlos frágiles.
const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

const build = (options) =>
  rateLimit({
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => isTest,
    validate: {
      // Si se despliega detrás de un proxy (nginx, balanceador), hay que
      // activar "trust proxy" en Express. Desactivamos solo el aviso para no
      // provocar errores en tiempo de ejecución cuando llega X-Forwarded-For.
      xForwardedForHeader: false
    },
    ...options
  });

// Límite general para toda la API.
export const apiLimiter = build({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  message: { message: "Demasiadas solicitudes, inténtalo de nuevo más tarde" }
});

// Límite estricto para autenticación: frena la fuerza bruta y el
// "credential stuffing" contra el login y el registro.
export const authLimiter = build({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Demasiados intentos, inténtalo de nuevo más tarde" }
});

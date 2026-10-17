# 🚀 Guía de despliegue

Esta guía lleva el proyecto desde el repositorio local hasta producción con:

| Componente | Plataforma |
|---|---|
| Base de datos | **MongoDB Atlas** |
| Backend (Express + JWT) | **Render** |
| Frontend (React + Vite) | **Vercel** |

> ⚠️ Los límites de los planes gratuitos y la interfaz de cada plataforma **cambian con el tiempo**. Verifica los límites actuales en la web de cada servicio.

---

## Arquitectura

```
┌─────────────┐        ┌──────────────────┐        ┌────────────────────┐
│  MongoDB    │  ◄───  │  Backend         │  ◄───  │  Frontend          │
│  Atlas (M0) │  URI   │  Render          │  API   │  Vercel (SPA)      │
└─────────────┘        │  Express + JWT   │        │  React + Vite      │
                       └──────────────────┘        └────────────────────┘
```

El **orden importa**: primero la base de datos (aporta la URI), luego el backend (aporta su URL) y por último el frontend (necesita la URL del backend *en tiempo de build*). Al final se cierra el círculo configurando el CORS del backend con la URL del frontend.

---

## Requisitos previos

- [ ] El proyecto está **subido a GitHub** (Render y Vercel leen del repositorio).
- [ ] El archivo `.env` **no** está versionado (solo `.env.example`). Ya está resuelto en este repo.
- [ ] Tienes un **secreto JWT nuevo** (no el de desarrollo). Genéralo con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] (Opcional, recomendado) Un **dominio propio** para evitar problemas de cookies (ver [Anexo A](#anexo-a--dominio-propio-recomendado)).

**Ramas**: la guía asume que la rama de producción es `main`. Render y Vercel desplegarán producción desde `main`; la rama `dev` puede usarse como *preview* en Vercel.

---

## Fase 1 — Base de datos en MongoDB Atlas

### 1.1 Crear la cuenta
Entra en `https://www.mongodb.com/cloud/atlas/register` y regístrate (puedes usar tu cuenta de Google).

### 1.2 Crear el cluster
1. Pulsa **Build a Database** / **Create**.
2. Elige el plan **M0 (Free)**.
3. **Provider**: AWS (o el que prefieras).
4. **Region**: la **más cercana a la región de Render** que usarás (ej. si Render está en *Oregon / US West*, elige Atlas `us-west`). Menos latencia = mejor.
5. **Cluster Name**: por ejemplo `mern-cluster` → **Create Deployment**.

### 1.3 Crear el usuario de base de datos
1. Te pedirá un **username** y un **password**. Pulsa *Autogenerate Secure Password* y **cópiala** (la necesitarás en la URI).
2. **Create User**.

### 1.4 Permitir acceso de red
1. En el paso de IP Access List, **no** uses *Add My Current IP* (no sirve para la nube).
2. Pulsa **Add a Different IP Address** → escribe `0.0.0.0/0` → **Add Entry**.
   - Permite conexión desde cualquier IP. Es lo práctico en el plan gratis porque Render no tiene IP fija. Se compensa con usuario y contraseña fuertes.

> ⚠️ Nunca uses `0.0.0.0/0` con un usuario de contraseña débil.

### 1.5 Obtener la cadena de conexión
1. En el cluster, pulsa **Connect** → **Drivers** → **Node.js**.
2. Copia la cadena:
   ```
   mongodb+srv://USUARIO:<db_password>@mern-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. **Edítala** antes de usarla:
   - Sustituye `<db_password>` por la contraseña real.
   - Añade el nombre de la base de datos **antes** del `?`:
     ```
     mongodb+srv://USUARIO:PASSWORD@mern-cluster.xxxxx.mongodb.net/merndb?retryWrites=true&w=majority
     ```
4. Si la contraseña contiene caracteres especiales (`@ : / ? # [ ] %`), **codifícalos** (ej. `@` → `%40`).

✅ **Resultado**: la `MONGODB_URI`. Guárdala.

---

## Fase 2 — Backend en Render

### 2.1 Crear la cuenta
`https://render.com` → **Get Started** → regístrate con **GitHub**.

### 2.2 Crear el Web Service
1. Dashboard → **New +** → **Web Service**.
2. **Connect a repository**: autoriza Render y elige tu repositorio.
3. Rellena:

| Campo | Valor |
|---|---|
| **Name** | `mern-backend` (el que quieras) |
| **Region** | la misma/cercana a la de Atlas |
| **Branch** | `main` |
| **Root Directory** | `backend` ← **clave en un monorepo** |
| **Runtime / Language** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

4. *(Opcional)* En **Advanced**, **Health Check Path**: `/api/health`.

### 2.3 Variables de entorno
Antes de crear, baja a **Environment Variables** y añade una por una:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | *(la cadena de la Fase 1)* |
| `JWT_SECRET` | *(tu secreto nuevo, ≥ 32 caracteres)* |
| `COOKIE_SAMESITE` | `none` ← porque Vercel y Render son dominios distintos |
| `CLIENT_URL` | *(se completa en la Fase 4; puedes poner `https://placeholder.com` provisional)* |

> **No definas `PORT`**: Render lo inyecta automáticamente y `config.js` ya lo respeta.

### 2.4 Desplegar
1. **Create Web Service**.
2. Revisa los **Logs**: deben aparecer `>>> Connected to MongoDB` y `>>> Server running on port ...`.
3. Copia tu URL: `https://mern-backend-xxxx.onrender.com`.

### 2.5 Verificar
Abre en el navegador:
```
https://mern-backend-xxxx.onrender.com/api/health
```
Debe responder `{"status":"ok"}`. Si tarda ~50 s la primera vez, es que el plan free estaba dormido (normal).

✅ **Resultado**: la URL del backend.

---

## Fase 3 — Frontend en Vercel

### 3.1 Crear la cuenta
`https://vercel.com` → **Sign Up** → con **GitHub**.

### 3.2 Importar el proyecto
1. **Add New…** → **Project**.
2. En *Import Git Repository*, elige tu repositorio → **Import**.

### 3.3 Configurar el proyecto
En la pantalla de configuración:

| Campo | Valor |
|---|---|
| **Root Directory** | `frontend` ← pulsa *Edit* y selecciónala |
| **Framework Preset** | `Vite` (lo detecta solo) |
| **Build Command** | `npm run build` (por defecto) |
| **Output Directory** | `dist` (por defecto) |

### 3.4 Variable de entorno
En **Environment Variables**, añade:

| Name | Value | Environments |
|---|---|---|
| `VITE_API_URL` | `https://mern-backend-xxxx.onrender.com/api` | Production |

> ⚠️ `VITE_API_URL` se **incrusta durante el build**. Si luego cambia la URL del backend, hay que **volver a desplegar** el frontend.

### 3.5 Desplegar
**Deploy** → espera → copia tu URL: `https://tu-app.vercel.app`.

✅ **Resultado**: la URL del frontend.

---

## Fase 4 — Cerrar el círculo (CORS + cookies)

### 4.1 CORS en Render
1. Render → tu Web Service → **Environment**.
2. Edita `CLIENT_URL` y pon **exactamente** la URL del frontend:
   ```
   https://tu-app.vercel.app
   ```
   - Sin barra final. Con `https` (no `http`).
3. **Save Changes** → Render redespliega solo.

### 4.2 Cookies
Ya definiste `COOKIE_SAMESITE=none` en la Fase 2.3. Como `NODE_ENV=production`, el código marca la cookie como `Secure` automáticamente y Render sirve por HTTPS → combinación válida para dominios distintos.

> **Alternativa más robusta**: con un **dominio propio y subdominios** (`app.tudominio.com` + `api.tudominio.com`) ambos son el mismo sitio, así que puedes dejar `COOKIE_SAMESITE=lax`. Ver [Anexo A](#anexo-a--dominio-propio-recomendado).

### 4.3 Redesplegar Vercel (solo si cambiaste `VITE_API_URL`)
Vercel → tu proyecto → **Deployments** → **Redeploy**.

---

## Fase 5 — Verificación end-to-end

En tu URL de Vercel:

1. **Registro** de un usuario nuevo → debe entrar al dashboard.
2. **Crear**, **editar** y **borrar** una tarea.
3. **Recargar** la página (F5) → **la sesión debe persistir**.
   - Si al recargar te manda al login → problema de cookies (ver tabla de problemas).
4. **Cambiar contraseña** → no debe desloguearte.
5. **Logout** → vuelve al login y ya no puedes entrar a `/tasks`.
6. Abre **DevTools (F12) → Network**: cada llamada a `/api/...` debe devolver `200`/`400`, **sin errores CORS** en la consola.

---

## Actualizaciones posteriores

- **Backend**: al hacer `git push` a `main`, Render **redespliega automáticamente**.
- **Frontend**: al hacer `git push` a `main`, Vercel **redesplega automáticamente**.
- Recuerda: si cambia `VITE_API_URL`, hay que forzar un **Redeploy** en Vercel.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| Error **CORS** en consola | `CLIENT_URL` no coincide con el origen del frontend | Revisa que sea idéntico (sin `/` final, protocolo correcto) y redeploy |
| Login "funciona" pero **la sesión se pierde al recargar** | Cookie bloqueada (dominios distintos + `lax`) | Pon `COOKIE_SAMESITE=none` en Render, o usa subdominios del mismo dominio |
| `500` / `Error interno` en todas las llamadas | No conecta a Mongo | Revisa `MONGODB_URI` (usuario/contraseña codificados) y que Atlas tenga `0.0.0.0/0` en Network Access |
| Primer acceso **muy lento (~50 s)** | Render free dormido | Normal; se despierta solo. Es el coste del plan gratis |
| Recargar `/tasks` (o cualquier ruta interna) da **404 en Vercel** | Falta el fallback de SPA | Ver [Anexo C](#anexo-c--fallback-de-spa-en-vercel) |
| Render falla el deploy | Build/Start incorrectos | Revisa los logs; Start debe ser `npm start`, Root Directory `backend` |
| No arranca: *"JWT_SECRET es demasiado corto"* | Secreto < 32 caracteres | Genera uno nuevo con el comando del checklist |
| La cookie no aparece en Network | `COOKIE_SAMESITE=none` sin HTTPS | Render/Vercel ya son HTTPS; revisa que `NODE_ENV=production` |

---

## Anexo A — Dominio propio (recomendado)

Evita por completo los problemas de cookies entre sitios.

1. Compra/usa un dominio, por ejemplo `tudominio.com`.
2. En **Vercel** → tu proyecto → **Settings → Domains** → añade `app.tudominio.com` (crea el registro `CNAME` que te indique).
3. En **Render** → tu servicio → **Settings → Custom Domains** → añade `api.tudominio.com` (crea el `CNAME` que te indique).
4. Actualiza:
   - Render `CLIENT_URL` = `https://app.tudominio.com`
   - Render `COOKIE_SAMESITE` = `lax` *(mismo sitio)*
   - Vercel `VITE_API_URL` = `https://api.tudominio.com/api` → **Redeploy**
5. Verifica igual que la Fase 5.

---

## Anexo B — Alternativa de mismo origen (proxy en Vercel)

Vercel puede actuar de **proxy inverso** hacia Render, de modo que el navegador hable **solo con el dominio de Vercel** (mismo origen). Así las cookies son de primera parte y desaparecen los problemas de CORS/cookies.

En `frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://mern-backend-xxxx.onrender.com/api/:path*" }
  ]
}
```

Y en Vercel, `VITE_API_URL=/api` (relativo). Entonces podrías usar `COOKIE_SAMESITE=lax`.

> ⚠️ **Contrapartida**: el backend verá la IP del proxy de Vercel, no la del visitante, lo que afecta al *rate limiting* por IP. Vercel envía `x-real-ip` / `x-forwarded-for`, pero habría que habilitar `trust proxy` en Express y ajustarlo con cuidado. Es una opción avanzada.

---

## Anexo C — Fallback de SPA en Vercel

Vercel suele detectar Vite y manejar las rutas del SPA, pero **si al recargar una ruta interna** (p. ej. `https://tu-app.vercel.app/tasks`) recibes un **404**, añade un `frontend/vercel.json` que primero respeta los archivos reales y luego cae a `index.html`:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

El `"handle": "filesystem"` es importante: garantiza que los assets (`/assets/*.js`, `/favicon.svg`, …) se sirvan tal cual y solo las rutas del SPA vayan a `index.html`. **No** uses un rewrite genérico sin este manejador, o romperías los archivos estáticos.

---

## Notas de seguridad

- **Secretos**: viven únicamente en el panel de cada plataforma (Render/Vercel). Nunca en el repositorio.
- **`nginx.conf` no se usa en Vercel**: Vercel sirve los estáticos con su propia infraestructura; las cabeceras de seguridad + CSP que añadimos a `frontend/nginx.conf` aplican solo al despliegue con Docker/Nginx. En Vercel se configurarían con un `vercel.json` (`headers`).
- **Preview deployments de Vercel**: cada rama/PR genera una URL distinta que **no** estará en `CLIENT_URL`, por lo que esas previews no podrán autenticarse. Es esperado.
- **HTTPS**: Render y Vercel lo dan por defecto. Si algún día usas un servidor propio, añade HTTPS y `Strict-Transport-Security`.

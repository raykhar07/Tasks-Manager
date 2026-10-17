# 📝 Task Manager — MERN Stack + Autenticación

Aplicación fullstack de **gestión de tareas** con autenticación por **JWT en cookie httpOnly**. Cada usuario ve y administra únicamente sus propias tareas. Construida con **MongoDB, Express, React y Node.js** (MERN), con validación de datos, tests automatizados, Docker y un sistema de diseño propio con tema claro/oscuro.

> Estado: **funcional y auditado en seguridad**. Ver [Seguridad](#-seguridad).

---

## 📋 Tabla de contenidos

- [Características](#-características)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Puesta en marcha](#-puesta-en-marcha)
- [Variables de entorno](#-variables-de-entorno)
- [API REST](#-api-rest)
- [Tests](#-tests)
- [Docker](#-docker)
- [Despliegue](#-despliegue)
- [Seguridad](#-seguridad)
- [Sistema de diseño](#-sistema-de-diseño)
- [Scripts disponibles](#-scripts-disponibles)
- [Mejoras futuras](#-mejoras-futuras)

---

## ✨ Características

### Autenticación y sesión
- Registro e inicio de sesión con contraseña hasheada (**bcrypt**, 10 rondas).
- Sesión mediante **JWT firmado (HS256)** almacenado en **cookie `httpOnly`**, `SameSite` configurable (`lax` por defecto / `none` para dominios distintos) y `Secure` en producción.
- Verificación de sesión al cargar la app con restauración automática del usuario.
- Cierre de sesión y **revocación de sesiones anteriores** al cambiar la contraseña.
- Rutas protegidas en el frontend (`ProtectedRoute`) y en el backend (`authRequired`).

### Gestión de tareas (CRUD)
- Crear, listar, editar y eliminar tareas.
- Cada tarea pertenece a un usuario; **aislamiento de datos por usuario** en todas las consultas.
- Fechas con `dayjs` y formato relativo (*Hoy*, *Mañana*, *Ayer*), aviso visual de fechas pasadas.
- Confirmación y animación al eliminar tareas.

### Perfil de usuario
- Ver y editar `username` y `email`.
- Cambiar contraseña (con verificación de la actual).
- Eliminar la cuenta con **borrado en cascada** de todas sus tareas.

### Interfaz
- Diseño responsivo con **Tailwind CSS v4**.
- **Tema claro / oscuro** con persistencia en `localStorage` y sin parpadeo al recargar (script anti-FOUC).
- Animaciones de entrada escalonadas, respetando `prefers-reduced-motion`.
- Página 404.

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Context API, Axios, React Hook Form, dayjs |
| **Estilos** | Tailwind CSS v4, IBM Plex Sans / IBM Plex Serif (self-hosted) |
| **Backend** | Node.js 20, Express 5, Mongoose 9, JSON Web Token (jsonwebtoken 9), bcryptjs, Zod 4 |
| **Seguridad** | Helmet, CORS restringido, cookie-parser, express-rate-limit |
| **Base de datos** | MongoDB 7 |
| **Testing** | Vitest 5, Supertest, mongodb-memory-server |
| **Infra** | Docker (multi-stage), Docker Compose, Nginx |

> La gestión de estado global se hace con **React Context + hooks** (`AuthContext`, `TasksContext`), sin librerías adicionales.

---

## 🗂 Arquitectura

```
Mern-stack-auth/
├── backend/
│   ├── controllers/      # Lógica de los endpoints (auth, tasks)
│   ├── middlewares/      # authRequired (JWT), validación Zod, rate limit, errores
│   ├── models/           # Esquemas Mongoose: User, Task
│   ├── routes/           # Definición de rutas de la API
│   ├── schemas/          # Validación de entrada con Zod
│   ├── libs/             # Firma de JWT y opciones de cookie
│   ├── tests/            # Tests de integración (Vitest + Supertest)
│   ├── app.js            # Configuración de Express (middlewares y rutas)
│   ├── index.js          # Arranque del servidor
│   ├── config.js         # Carga y validación de variables de entorno
│   └── Dockerfile        # Etapas dev / prod
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Instancia de Axios + llamadas por recurso
│   │   ├── components/   # Navbar, ProtectedRoute, TaskCard
│   │   ├── context/      # AuthContext y TasksContext (+ Provider)
│   │   ├── hooks/        # useAuth, useTasks, useTheme
│   │   ├── pages/        # Home, Login, Register, Tasks, TaskForm, Profile
│   │   ├── utils/        # Utilidades de fecha (dayjs)
│   │   ├── App.jsx       # Rutas y layout principal
│   │   └── index.css     # Sistema de diseño "Campo" (tokens + temas)
│   ├── nginx.conf        # Config del servidor de producción
│   └── Dockerfile        # Etapas build / dev / prod
│
├── docker-compose.yml        # Entorno de desarrollo
├── docker-compose.prod.yml   # Entorno de producción
├── DEPLOY.md                 # Guía de despliegue paso a paso
└── .gitignore
```

### Modelo de datos

```
User                                  Task
──────────────────────────────       ──────────────────────────────
username        String (req)         title        String (req)
email           String (req, único)  description  String (req)
password        String (req)         date         Date
tokenVersion    Number (default 0)   user         ObjectId → User (req, indexado)
createdAt/updatedAt (timestamps)     createdAt/updatedAt (timestamps)
```

---

## 🚀 Puesta en marcha

### Requisitos previos
- **Node.js 20+**
- **MongoDB 7** (local o [MongoDB Atlas](https://www.mongodb.com/atlas))
- *(Opcional)* Docker + Docker Compose

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Mern-stack-auth
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
# Edita .env y define un JWT_SECRET largo y aleatorio
npm run dev                 # http://localhost:3000
```

Genera un secreto seguro, por ejemplo:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev                 # http://localhost:5173
```

Con ambos servicios en marcha, abre **http://localhost:5173**.

---

## 🔐 Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://localhost:27017/merndb` |
| `JWT_SECRET` | Secreto para firmar JWT (**mínimo 32 caracteres**) | `d8aa21…` |
| `CLIENT_URL` | Origen permitido por CORS | `http://localhost:5173` |
| `NODE_ENV` | Entorno (`development` / `production`) | `development` |
| `COOKIE_SAMESITE` | SameSite de la cookie (`lax` mismo sitio / `none` dominios distintos) | `lax` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api` |

> ⚠️ Los archivos `.env` **no se versionan** (ver `.gitignore`). Usa siempre las plantillas `.env.example`.

---

## 🌐 API REST

Base URL: `http://localhost:3000/api`. La autenticación se envía automáticamente en la cookie `token`.

| Método | Ruta | Auth | Descripción |
|---|---|:---:|---|
| `GET` | `/health` | — | Estado del servicio |
| `POST` | `/register` | — | Crea un usuario y abre sesión |
| `POST` | `/login` | — | Autentica y abre sesión |
| `POST` | `/logout` | — | Cierra sesión (borra la cookie) |
| `GET` | `/verify` | 🍪 | Verifica la sesión actual; devuelve el usuario o `null` |
| `GET` | `/profile` | ✅ | Datos del usuario autenticado |
| `PUT` | `/profile` | ✅ | Actualiza `username` y `email` |
| `PUT` | `/profile/password` | ✅ | Cambia la contraseña y revoca sesiones previas |
| `DELETE` | `/profile` | ✅ | Elimina la cuenta y todas sus tareas |
| `GET` | `/tasks` | ✅ | Lista las tareas del usuario |
| `GET` | `/tasks/:id` | ✅ | Obtiene una tarea del usuario |
| `POST` | `/tasks` | ✅ | Crea una tarea |
| `PUT` | `/tasks/:id` | ✅ | Actualiza una tarea |
| `DELETE` | `/tasks/:id` | ✅ | Elimina una tarea |

**Ejemplo — registro**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"ana","email":"ana@example.com","password":"unaClave123"}'
```

**Ejemplo — listar tareas (reutilizando la cookie)**
```bash
curl http://localhost:3000/api/tasks -b cookies.txt
```

Errores de validación: `400` con un array de mensajes. Errores de autenticación: `401`. Demasiadas peticiones: `429`.

---

## 🧪 Tests

El backend incluye tests de integración con **Vitest + Supertest** sobre una base de datos **en memoria** (`mongodb-memory-server`), por lo que **no necesitan MongoDB instalado**.

```bash
cd backend
npm test             # ejecuta la suite
npm run test:watch   # modo watch
npm run test:coverage # reporte de cobertura
```

Cobertura actual: **~85 %** de sentencias. Se cubren los flujos de autenticación (registro, login, logout, perfil, cambio de contraseña), el CRUD de tareas, el aislamiento entre usuarios y las medidas de seguridad (mensaje de login genérico, invalidación de sesiones).

---

## 🐳 Docker

### Desarrollo
Levanta MongoDB + backend (nodemon) + frontend (Vite) con recarga en caliente:
```bash
docker compose up --build
```
- Frontend: http://localhost:5173 · Backend: http://localhost:3000 · MongoDB: `127.0.0.1:27017`

### Producción
```bash
# Define las variables en el entorno del host
export JWT_SECRET="<secreto-largo>"
export CLIENT_URL="https://tu-dominio.com"

docker compose -f docker-compose.prod.yml up --build -d
```
- El frontend se sirve como estáticos con **Nginx** en el puerto **80**.
- El backend **no publica puerto** al exterior (solo red interna).
- MongoDB **no expone puerto**.

> 💡 Como el backend queda en la red interna, para que el navegador alcance la API debes enrutar `/api` hacia el backend (por ejemplo con un proxy inverso delante de Nginx) y compilar el frontend con el `VITE_API_URL` correspondiente a ese dominio público.

---

## ☁️ Despliegue

La guía completa, paso a paso, está en **[DEPLOY.md](./DEPLOY.md)**. Configuración recomendada:

| Componente | Plataforma | Notas |
|---|---|---|
| **Base de datos** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Cluster gratuito **M0**; permite `0.0.0.0/0` en Network Access |
| **Backend** | [Render](https://render.com) | Web Service con *Root Directory* `backend`, `npm start` |
| **Frontend** | [Vercel](https://vercel.com) | *Root Directory* `frontend`, preset **Vite** |

**Resumen de variables en producción:**

- **Render** (backend): `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET` (≥ 32 caracteres), `CLIENT_URL` (URL de Vercel, sin barra final) y `COOKIE_SAMESITE=none`. **No** definas `PORT`.
- **Vercel** (frontend): `VITE_API_URL` = URL del backend terminada en `/api` (se incrusta en el **build**; si cambia, hay que **redesplegar**).

> 🔗 Por defecto el frontend (`*.vercel.app`) y el backend (`*.onrender.com`) son **dominios distintos**, por eso se usa `COOKIE_SAMESITE=none`. Con un dominio propio en subdominios (`app.` + `api.`) puedes usar `lax`. Ver anexos de [DEPLOY.md](./DEPLOY.md).

---

## 🛡 Seguridad

El proyecto pasó por una auditoría de seguridad completa. Controles implementados:

**Sesiones y contraseñas**
- JWT firmado con **HS256** (algoritmo fijado en firma y verificación).
- Cookie **`httpOnly` + `SameSite`** (configurable con `COOKIE_SAMESITE`) y `Secure` en producción.
- Contraseña hasheada con bcrypt; el hash tiene `select: false` y nunca se expone.
- Política de contraseñas: **mínimo 8 y máximo 128 caracteres**.
- **`tokenVersion`**: al cambiar la contraseña se revocan todos los tokens anteriores.
- **Anti-enumeración** en login: mismo mensaje y mismo tiempo de respuesta exista o no la cuenta.

**API**
- Validación de todas las entradas con **Zod** (evita inyección de operadores/NoSQL y masas de asignación).
- Consultas siempre filtradas por el usuario del token (aislamiento de datos).
- **Rate limiting**: límite estricto en autenticación y límite general en toda la API.
- **Helmet** para cabeceras HTTP y **CORS** restringido a `CLIENT_URL`.

**Repositorio y despliegue**
- Los `.env` con secretos **no se versionan**; solo las plantillas `.env.example`.
- `JWT_SECRET` de longitud mínima validada al arrancar.
- Cabeceras de seguridad en Nginx, incluida **Content-Security-Policy** con hash del script inline.
- Dependencias de **producción sin vulnerabilidades conocidas** (`npm audit` limpio); los avisos restantes pertenecen a herramientas de desarrollo (`nodemon`).

---

## 🎨 Sistema de diseño

Sistema propio llamado **"Campo"**: un cuaderno de trabajo donde el color nunca decora, informa.

- **Tipografía:** IBM Plex Serif (títulos) + IBM Plex Sans (interfaz), self-hosted.
- **Paleta semántica:** `paper`, `surface`, `ink`, `line`, `pine` (acción), `ochre` (atención), `brick` (corrección).
- **Dos temas, un sistema:** los componentes usan tokens (`bg-paper`, `text-ink`, `bg-pine`…), nunca valores fijos; el tema claro/oscuro solo redefine las variables CSS en `:root` / `.dark`.
- **Movimiento:** transiciones sutiles y animaciones de entrada escalonadas, respetando `prefers-reduced-motion`.

---

## 📜 Scripts disponibles

### Backend
| Script | Descripción |
|---|---|
| `npm run dev` | Servidor con recarga (nodemon) |
| `npm start` | Servidor en producción |
| `npm test` | Tests de integración |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con cobertura |

### Frontend
| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Ejecuta ESLint |

---

## 🛣 Mejoras futuras

- Verificación de email para eliminar la enumeración de cuentas en el registro.
- HTTPS + HSTS en el despliegue de producción.
- Paginación y búsqueda/filtros en el listado de tareas.
- Refresh tokens con rotación y *blacklist* distribuida.
- Tests end-to-end (Playwright) e integración continua (GitHub Actions).
- Panel de administración y etiquetas/prioridades en tareas.

---

## 📄 Licencia

Este proyecto se distribuye con fines educativos. Añade aquí la licencia que prefieras (por ejemplo, MIT).

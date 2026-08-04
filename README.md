# Hunterrd

**Hunterrd** es un portal tipo Product Hunt para descubrir, votar y compartir los mejores proyectos creados por estudiantes de todo el mundo. Diseño inspirado en DevTop — vitrina de talento estudiantil.

- `apps/api` — Backend **NestJS 10** + **Prisma** + **PostgreSQL** (auth JWT con cookies httpOnly)
- `apps/web` — Frontend **React 18** + **Vite** + **Tailwind CSS** + **React Router v6**

## Características

- Hero con cards apiladas, sección **Top del día** con sidebar (categorías, top semanal, CTA), **Proyectos destacados** en 3 columnas, **Cómo funciona** en 3 pasos, testimonio y footer ink con newsletter.
- Auth email/password (JWT + bcrypt) con **cookies httpOnly** y CORS `credentials: true` — el front React nunca toca el token.
- Productos con `name`, `tagline`, `description`, `url`, `logoUrl`, `techStack[]`, `category`.
- Votos (toggle, únicos por usuario), comentarios, ranking, búsqueda y filtrado por categoría.
- Perfil de usuario con bio + institución.

## Requisitos

- Node.js >= 18.18
- PostgreSQL 14+ corriendo local o en Docker
- npm 9+

## Setup rápido

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# editar apps/api/.env (DATABASE_URL + JWT_SECRET)
npm run prisma:migrate -- --name init
npm run dev
```

- API → http://localhost:3001/api/v1
- Web → http://localhost:4321 (Vite con proxy a la API)

## Estructura

```
hunterrd/
├── apps/
│   ├── api/          # NestJS
│   │   ├── prisma/   # schema.prisma
│   │   └── src/
│   │       ├── auth/         # JWT + bcrypt + cookie httpOnly
│   │       ├── users/
│   │       ├── products/     # CRUD de proyectos
│   │       ├── categories/
│   │       ├── votes/        # upvotes
│   │       └── comments/
│   └── web/          # React + Vite
│       └── src/
│           ├── components/   # Navbar, Footer, ProductRow, etc.
│           ├── context/      # AuthContext
│           ├── lib/          # cliente API
│           └── pages/        # Home, Login, Register, Submit, ProductDetail, Categories, Profile, About, NotFound
├── package.json
└── README.md
```

## Despliegue en Vercel

Este monorepo se deploya como **dos proyectos separados en Vercel**, ambos apuntando al mismo repo de GitHub pero con distintos Root Directories.

### Proyecto 1 — Frontend (apps/web)

- **Root Directory**: `apps/web`
- **Framework Preset**: Vite
- **Build / Output / Install**: dejar los defaults (Vite los auto-detecta)

Variables de entorno:
- `VITE_API_BASE_URL` = `https://<tu-backend>.vercel.app/api/v1`

### Proyecto 2 — Backend (apps/api)

- **Root Directory**: `apps/api`
- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build` (definido en `apps/api/vercel.json`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Variables de entorno (requeridas):
- `DATABASE_URL` = `postgresql://...` (Vercel Postgres, Neon, Supabase, Railway, etc.)
- `JWT_SECRET` = string aleatorio de 32+ chars
- `JWT_EXPIRES_IN` = `7d`
- `CORS_ORIGIN` = `https://<tu-frontend>.vercel.app` (dominio del proyecto 1)
- `API_PREFIX` = `api/v1`
- `NODE_ENV` = `production`

> **Importante**: ejecuta las migraciones de Prisma antes del primer deploy. La forma más fácil es usar **Vercel Postgres** o **Neon** y correr `npx prisma migrate deploy` localmente apuntando a esa DB. Para automatizarlo en Vercel, puedes añadir un `prebuild` que corra `prisma migrate deploy` (cuidado con locks en deploys concurrentes).

> El endpoint serverless vive en `apps/api/api/index.ts` y maneja todas las rutas bajo `/api/v1/*`. El `vercel.json` del backend configura `buildCommand`, `outputDirectory` y la función serverless con `maxDuration: 30s` y `memory: 1024MB`.

### Alternativa más simple para el backend

Si la configuración serverless te da problemas, deploya el backend en **Railway**, **Render** o **Fly.io** sin cambios. Vercel solo para el frontend, y `VITE_API_BASE_URL` apuntando a la URL del servicio externo.

## Scripts útiles

| Comando                  | Descripción                                |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | API + Web en paralelo                      |
| `npm run dev:api`        | Solo NestJS                                |
| `npm run dev:web`        | Solo Vite/React                            |
| `npm run build`          | Build de ambos                             |
| `npm run prisma:studio`  | GUI para inspeccionar la DB                |

## Modelo de datos (resumen)

- **User**: id, email, username, passwordHash, bio, avatarUrl, institution, createdAt
- **Category**: id, name, slug, color
- **Product**: id, name, tagline, description, url, logoUrl, techStack[], hunterId, categoryId, createdAt
- **Vote**: (userId, productId) — upvote
- **Comment**: id, productId, userId, body, createdAt

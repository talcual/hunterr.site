# Hunterrd

**Hunterrd** es un portal tipo Product Hunt para descubrir, votar y compartir los mejores proyectos creados por estudiantes de todo el mundo. Diseño inspirado en DevTop — vitrina de talento estudiantil.

- `apps/api` — Backend **NestJS 10** + **Prisma** + **PostgreSQL** (auth JWT)
- `apps/web` — Frontend **Astro 4** (SSR) + **Tailwind CSS** con la paleta/páginas de DevTop

## Características

- Hero con cards apiladas, sección **Top del día** con sidebar (categorías, top semanal, CTA), **Proyectos destacados** en 3 columnas, **Cómo funciona** en 3 pasos, testimonio y footer ink con newsletter.
- Auth email/password (JWT + bcrypt), perfil de usuario con bio + institución.
- Productos con `name`, `tagline`, `description`, `url`, `logoUrl`, `techStack[]`, `category`.
- Votos (toggle, únicos por usuario), comentarios, ranking semanal, búsqueda por texto y filtrado por categoría.

## Requisitos

- Node.js >= 18.18
- PostgreSQL 14+ corriendo local o en Docker
- npm 9+

## Setup rápido

```bash
# 1. Instalar dependencias del monorepo
npm install

# 2. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# edita apps/api/.env con tu DATABASE_URL y JWT_SECRET

# 3. Crear DB y aplicar esquema Prisma
npm run prisma:migrate -- --name init

# 4. Levantar API + Web en paralelo
npm run dev
```

- API: http://localhost:3001/api/v1
- Web: http://localhost:4321

## Estructura

```
hunterrd/
├── apps/
│   ├── api/          # NestJS
│   │   ├── prisma/   # schema.prisma
│   │   └── src/
│   │       ├── auth/         # JWT + bcrypt
│   │       ├── users/
│   │       ├── products/     # CRUD de productos
│   │       ├── categories/
│   │       ├── votes/        # upvotes
│   │       └── comments/
│   └── web/          # Astro
│       └── src/
│           ├── components/
│           ├── layouts/
│           ├── pages/
│           └── lib/          # cliente API + helpers
└── package.json      # workspace root
```

## Despliegue en Vercel

El frontend está listo para Vercel con `@astrojs/vercel`. Configura el proyecto con:

- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: dejar vacío (lo detecta el adapter)
- **Install Command**: `npm install`
- **Framework Preset**: Other

Variables de entorno en Vercel (Project Settings → Environment Variables):

- `PUBLIC_API_BASE_URL` = `https://<tu-api>.onrender.com/api/v1` o tu URL del backend

> La API NestJS no se despliega en Vercel; usa Railway, Render, Fly.io, etc. y expón `POSTGRES_URL` + `JWT_SECRET`.

## Scripts útiles

| Comando                  | Descripción                                |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | API + Web en paralelo                      |
| `npm run dev:api`        | Solo NestJS                                |
| `npm run dev:web`        | Solo Astro                                 |
| `npm run build`          | Build de ambos                             |
| `npm run prisma:studio`  | GUI para inspeccionar la DB                |

## Modelo de datos (resumen)

- **User**: id, email, username, passwordHash, avatarUrl, createdAt
- **Category**: id, name, slug, color
- **Product**: id, name, tagline, description, url, logoUrl, hunterId, categoryId, createdAt
- **Vote**: (userId, productId) — upvote
- **Comment**: id, productId, userId, body, createdAt

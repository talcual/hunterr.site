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

## Despliegue en Vercel (frontend)

Vercel detecta Vite automáticamente. Configura el proyecto:

- **Root Directory**: `apps/web`
- **Framework Preset**: Other (o Vite)
- **Build Command**: `npm run build` (deja el default)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Variables de entorno:
- `VITE_API_BASE_URL` = `https://<tu-api>.onrender.com/api/v1` (la URL del backend)

> La API NestJS no se despliega en Vercel; usa Railway, Render, Fly.io, etc. y expone `DATABASE_URL` + `JWT_SECRET`. En el backend, configura `CORS_ORIGIN` con el dominio de Vercel (ej. `https://hunterrd.vercel.app`).

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

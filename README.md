# Aula Viva

Plataforma **white-label** de clases en vivo (streaming + grabación + notas por rol) para **colegios y universidades**. Arquitectura **desacoplada**:

- `apps/api` — Backend **NestJS + Prisma + PostgreSQL** (se despliega en **Railway**).
- `apps/frontend` — Frontend **React + Vite + PWA** (se despliega aparte; solo consume la API, sin secretos).
- `prototipo/aula-viva.html` — Maqueta navegable (referencia visual/UX).

## Requisitos
- Node.js 20+

## Instalar
```bash
npm install   # instala dependencias de todos los workspaces
```

## Conectar la base de datos  ← lo único que falta
1. Crea una base **PostgreSQL** (en Railway: *New → Database → PostgreSQL*).
2. Copia su *connection string*.
3. En `apps/api/`, copia `.env.example` a `.env` y pega la cadena en `DATABASE_URL`. Define también un `JWT_SECRET`.
4. Crea las tablas y datos de ejemplo:
```bash
npm run prisma:migrate    # crea las tablas
npm run prisma:seed       # institución demo + usuarios (clave: demo1234)
```

## Correr en local
```bash
npm run dev:api    # http://localhost:3000/api/v1
npm run dev:front    # http://localhost:5173
```
En `apps/frontend/.env` define `VITE_API_URL` (por defecto apunta a localhost:3000).

## Desplegar
- **API en Railway:** conecta el repo con root `apps/api`, agrega el add-on PostgreSQL (Railway inyecta `DATABASE_URL`). Build: `npm install && npm run build && npm run prisma:deploy`. Start: `npm run start:prod`.
- **Web aparte** (Vercel/Netlify/Cloudflare Pages): root `apps/frontend`, build `npm run build`, con `VITE_API_URL` apuntando a la URL pública de la API.

## Pensado para escalar
- **Multi-tenant:** `Institution` es el tenant raíz; todo cuelga de una institución.
- **Módulos por dominio** en `apps/api/src/modules/*` (agrega uno copiando el patrón de `institutions`).
- **API versionada** en `/api/v1` para evolucionar sin romper clientes.
- **Roles/permisos** con `@Roles()` + `RolesGuard`.
- **Video en vivo:** el modelo ya trae `ClassSession.roomName` y `Recording.provider` (agnóstico de proveedor — LiveKit u otro — para enchufar sin migrar el esquema).

Usuarios demo (tras el seed) — contraseña `demo1234`:
`admin@institucion.edu`, `docente@institucion.edu`, `estudiante@institucion.edu`, `acudiente@institucion.edu`.

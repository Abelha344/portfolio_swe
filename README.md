# Full-Stack Portfolio

Modern portfolio with a public site and authenticated admin dashboard.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- PostgreSQL + Prisma
- Auth.js (Credentials) for a single admin user
- Server Actions + Zod for CRUD

## Setup

1. Copy env and fill values:

```bash
cp .env.example .env
```

2. Install deps and generate Prisma client:

```bash
npm install
npm run db:generate
```

3. Push schema and seed demo data:

```bash
npm run db:push
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login  
  Email: `abelhailu0427@gmail.com` (set via `ADMIN_EMAIL`)  
  Password: value of `ADMIN_PASSWORD` in `.env` (set this in Vercel for production)

## Deploying to Vercel

Set these Environment Variables in the Vercel project:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Postgres connection string (Neon, Supabase, etc.) |
| `AUTH_SECRET` | Long random secret |
| `AUTH_URL` | Your production URL, e.g. `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | `abelhailu0427@gmail.com` |
| `ADMIN_PASSWORD` | Choose your production password |

After the first deploy, run the seed once against production (or use a one-off script) so the admin user is created with that password:

```bash
ADMIN_EMAIL=abelhailu0427@gmail.com ADMIN_PASSWORD='your-secure-password' npm run db:seed
```

## Key paths

| Path | Purpose |
|------|---------|
| `prisma/schema.prisma` | Data models |
| `middleware.ts` | Protect `/admin/*` |
| `lib/actions/` | Server Actions (CRUD) |
| `app/(public)/` | Public portfolio |
| `app/(admin)/admin/` | Admin dashboard |

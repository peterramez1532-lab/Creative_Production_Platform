# Database operations
PostgreSQL is required in development and production. `prisma/schema.prisma` and `prisma/migrations/` are source controlled. Set `DATABASE_URL` and `DIRECT_URL`; this schema uses Prisma 6's `directUrl` for migration connectivity.

- Generate: `npm run db:generate`
- Apply committed migrations: `npm run db:deploy`
- Create a development migration: `npm run db:migrate -- --name descriptive_name`
- Seed local demo data: `npm run db:seed`
- Destructive local reset: `npm run db:reset:local` (localhost-only guard)

Production should only use `migrate deploy`; never run reset or seed. Keep production backups and review migration SQL before applying. Integration tests in CI use a dedicated ephemeral PostgreSQL service.

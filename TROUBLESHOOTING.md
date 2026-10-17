# Troubleshooting
- Database unavailable: confirm host, TLS, firewall, port and credentials; inspect server logs for the safe underlying error.
- Migration errors: compare migration history with deployed schema and run `npm run db:deploy` against the correct database. Do not reset production.
- 401 after refresh: check browser cookie settings, domain/HTTPS, database sessions and session expiry.
- 503 login: check database connectivity and applied migrations.
- 429 login: current rate limit is in-memory per Node instance; for multi-instance production, add a shared rate limiter such as Upstash Redis.
- Upload 503: add `BLOB_READ_WRITE_TOKEN`; the app will not write private files to ephemeral disk.
- Build/type errors: run `npm ci`, `npm run db:generate`, `npm run typecheck`, then `npm run build`.


## Prisma P1012: enum validation error

Prisma schema enum values must be listed on separate lines. If `prisma generate` reports `This line is not an enum value definition` at an `enum` declaration, update `prisma/schema.prisma` to the multiline enum format included in this release, then run:

```powershell
npm run db:generate
npm run db:deploy
npm run db:seed
```

The `@prisma/client did not initialize yet` error from the seed command is a downstream effect when `prisma generate` fails; fix the schema error first. Ensure `.env` points to a reachable PostgreSQL database before deploying migrations or seeding.

# Architecture
- Next.js App Router UI and Node.js route handlers.
- PostgreSQL is the only supported database; Prisma 6 schema and committed SQL migration.
- Passwords are bcrypt hashes. Session bearer values are random, stored as SHA-256 hashes in PostgreSQL, and sent only in HttpOnly SameSite=Lax cookies. Production cookies are Secure.
- Server handlers call `getUser()` and enforce role checks. Client-provided role/organization fields are never trusted.
- Upload data is stored in Vercel Blob and metadata in PostgreSQL. No permanent local filesystem fallback.
- UI calls typed/validated API endpoints; Zod validates request payloads.
- Audit records track login/logout and project/task/workflow events without credentials.

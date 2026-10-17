# Frameflow — Creative Production Platform

A Next.js App Router MVP for creative project intake, task assignment, talent submissions, QA decisions, and audit events. PostgreSQL is the source of truth; Prisma migrations are committed. Production uploads use Vercel Blob and fail safely if storage is not configured. See [BUILD_STATUS.md](./BUILD_STATUS.md): this packaged snapshot could not be dependency/build verified because the environment could not reach npm registry. Run `npm install` once on a network-enabled machine and commit the generated lockfile before CI/deployment.

## Requirements
- Node.js 22 LTS (20.11+ supported by package engine)
- npm 10+
- PostgreSQL 15+ (local Docker or hosted PostgreSQL)

## Local setup — Windows PowerShell
```powershell
Expand-Archive .\Creative_Production_Platform.zip -DestinationPath .\Creative_Production_Platform
Set-Location .\Creative_Production_Platform
Copy-Item .env.example .env
# Edit .env and set DATABASE_URL, DIRECT_URL, AUTH_SECRET, APP_URL
npm install
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```
Open http://localhost:3000. If the archive was already extracted, skip `Expand-Archive` and `Set-Location` as appropriate.

## Local setup — macOS/Linux
```bash
unzip Creative_Production_Platform.zip
cd Creative_Production_Platform
cp .env.example .env
# Edit .env with your PostgreSQL connection and a random AUTH_SECRET
npm install
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

### PostgreSQL
For a local Docker database:
```bash
docker run --name frameflow-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=frameflow -p 5432:5432 -d postgres:16
```
Set both `DATABASE_URL` and `DIRECT_URL` to `postgresql://postgres:postgres@localhost:5432/frameflow`. Use a dedicated local database only. Hosted providers may recommend a pooled `DATABASE_URL` and direct `DIRECT_URL` for migrations.

### Environment variables
- `DATABASE_URL` — required PostgreSQL runtime connection string.
- `DIRECT_URL` — required direct PostgreSQL connection for Prisma migrations in this configuration; can match `DATABASE_URL` if provider supports it.
- `AUTH_SECRET` — set a cryptographically random secret (32+ bytes); session tokens are random and hashed in PostgreSQL. This secret is reserved for future signed integrations and should still be configured.
- `APP_URL` — canonical app origin (`http://localhost:3000` locally, your HTTPS domain in production).
- `BLOB_READ_WRITE_TOKEN` — optional for startup, required for real persistent uploads. Create a private Vercel Blob store and configure its token. The upload endpoint never writes permanent files to the app filesystem.
- `DEMO_PASSWORD` — optional seed-only override for demo accounts; do not use demo accounts in production.

Generate a secret with PowerShell: `-join ((1..48) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) )` (or use a trusted cryptographic generator). macOS/Linux: `openssl rand -base64 48`.

## Demo accounts (local development only)
The seed script creates these accounts and sets all their passwords to `DEMO_PASSWORD` if supplied, otherwise `ChangeMe123!`:
- `admin@frameflow.local` — Admin
- `manager@frameflow.local` — Production manager
- `talent@frameflow.local` — Talent
- `client@frameflow.local` — Client

Do not seed demo users into a production database. Do not use these credentials on a public deployment. Seed is repeatable and resets the listed demo users' password to the selected demo password.

## Commands
| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Generate Prisma Client and production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint checks |
| `npm run typecheck` | TypeScript strict checks |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright UI smoke test (requires browser install) |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply a development migration interactively |
| `npm run db:deploy` | Apply committed migrations; use for deployment |
| `npm run db:seed` | Insert local demonstration records |
| `npm run db:reset:local` | Destructive reset, blocked unless DATABASE_URL points at localhost and not Vercel |
| `npm run setup` | Generate, migrate deploy, seed; intended for local setup only |

Install Playwright browser for E2E: `npx playwright install chromium` (Linux CI may need `npx playwright install --with-deps chromium`).

## GitHub
Create an empty repository, then from this folder:
```bash
git init
git add .
git commit -m "Initial Frameflow platform"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
Replace the placeholder with your repository's actual URL. `.gitignore` excludes private env files, dependencies, build output, and local databases. CI uses an isolated PostgreSQL service and does not access production credentials.

## Vercel deployment
1. Provision hosted PostgreSQL with Neon, Supabase, or another compatible provider. Create separate production credentials; use the provider's pooled URL for `DATABASE_URL` and direct URL for `DIRECT_URL` when recommended.
2. Create a private Vercel Blob store and obtain `BLOB_READ_WRITE_TOKEN` for production uploads.
3. Push to GitHub and import the repository in Vercel. Framework should be detected as Next.js; use the repository root, default build command, and npm install.
4. Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (cryptographically random), `APP_URL` (final HTTPS origin), and `BLOB_READ_WRITE_TOKEN` in Vercel Production environment settings. Never prefix secrets with `NEXT_PUBLIC_`.
5. Deploy. Apply committed schema changes from a trusted local/CI environment using `DATABASE_URL`/`DIRECT_URL` for the intended production database and `npm run db:deploy`. Do not run destructive reset or seed against production.
6. Provision the first production administrator securely. The MVP intentionally has no public administrator registration route; use a controlled one-off script or direct trusted administrative provisioning process with a bcrypt hash. Never expose a public bootstrap endpoint.
7. Verify sign in/out, role restrictions, project/task creation, submission/QA, and a real upload/download flow. Inspect Vercel function logs for server-side diagnostics.

**Important:** the MVP does not provide an administrator provisioning command or a private-file download route yet; these must be completed before handling production client deliverables. Upload metadata and private Blob storage are implemented, but user-facing retrieval is deferred. Do not deploy this as a finished production system until these gaps are addressed.

## Troubleshooting
- `Can't reach database server`: verify the host, port, firewall/IP allowlist, TLS parameters, and that the database is running. Check both runtime and direct URLs.
- `Prisma Client did not initialize`: run `npm run db:generate` and reinstall dependencies if the generated client is stale.
- Login returns 503: check server logs for safe diagnostic messages and verify PostgreSQL is reachable and migrations are applied.
- Login rejects seeded account: run `npm run db:seed` only against a local database; check `DEMO_PASSWORD` if set.
- Upload returns 503: configure `BLOB_READ_WRITE_TOKEN`; the route intentionally does not fall back to ephemeral disk.
- Migration drift: inspect committed migration state and apply `npm run db:deploy` against the intended database; do not reset production.

## Current scope
Implemented: database-backed sessions, password hashing, role-gated APIs, project and task creation/listing, task submission, QA approve/revision, audit events, Vercel Blob upload with authorization and limits, demo seed, dashboard, tests and CI. Deferred/partial: secure private-file download, formal first-admin bootstrap, full organization membership management, messages/notifications, financial UI, talent assessments/training, full analytics, robust distributed rate limiting, and complete e2e/integration tests. In-memory login rate limiting is per server instance and is not sufficient as a distributed production control.

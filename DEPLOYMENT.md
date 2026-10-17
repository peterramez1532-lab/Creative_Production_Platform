# Deployment guide
1. Create a PostgreSQL database (Neon/Supabase or equivalent) and collect pooled/runtime plus direct migration URLs.
2. Create a private Vercel Blob store and token.
3. Push source to GitHub and import into Vercel as a Next.js project.
4. Configure `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `APP_URL`, `BLOB_READ_WRITE_TOKEN` in Vercel environment settings. No secret belongs in `NEXT_PUBLIC_*`.
5. Deploy using standard Next.js build. Build generates Prisma Client; it does not run production migrations.
6. From a trusted environment connected to the intended production database, review and run `npm run db:deploy`.
7. Provision a production admin through a controlled private process (not implemented as a public route); do not seed demo users.
8. Smoke-test authentication, authorization, workflows, storage credentials and Vercel logs. A private-file download endpoint is still required before using uploads as a delivery channel.

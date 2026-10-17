import { execFileSync } from 'node:child_process';import { readFileSync,existsSync } from 'node:fs';
if(process.env.NODE_ENV==='production'||process.env.VERCEL==='1')throw new Error('Refusing to reset data in production/Vercel.');
if(!process.env.DATABASE_URL&&existsSync('.env')){for(const line of readFileSync('.env','utf8').split(/\r?\n/)){const m=line.match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\s]+)["']?\s*$/);if(m)process.env.DATABASE_URL=m[1];}}
if(!process.env.DATABASE_URL||!/^postgres(ql)?:\/\/(?:[^@/]+@)?(?:localhost|127\.0\.0\.1)(?::\d+)?\//.test(process.env.DATABASE_URL))throw new Error('Safety check: DATABASE_URL must point to localhost or 127.0.0.1.');
execFileSync('npx',['prisma','migrate','reset','--force'],{stdio:'inherit',env:process.env});

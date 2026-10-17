import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from './db';
import type { Role } from '@prisma/client';
export const COOKIE_NAME = 'cpp_session';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export async function createSession(userId: string) {
 const token = randomBytes(32).toString('base64url');
 await db.session.create({ data: { tokenHash: hash(token), userId, expiresAt: new Date(Date.now()+7*24*60*60*1000) } });
 (await cookies()).set(COOKIE_NAME, token, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', path:'/', expires:new Date(Date.now()+7*24*60*60*1000) });
}
export async function getUser() {
 try { const token=(await cookies()).get(COOKIE_NAME)?.value; if(!token) return null;
 const session=await db.session.findUnique({where:{tokenHash:hash(token)},include:{user:true}});
 if(!session || session.expiresAt < new Date() || !session.user.active) return null;
 return session.user;
 } catch (e) { console.error('Session validation failed:', e instanceof Error ? e.message : 'unknown error'); return null; }
}
export async function destroySession() { const jar=await cookies(); const token=jar.get(COOKIE_NAME)?.value; if(token) await db.session.deleteMany({where:{tokenHash:hash(token)}}); jar.delete(COOKIE_NAME); }
export async function verifyPassword(password:string, passwordHash:string) { return bcrypt.compare(password,passwordHash); }
export async function requireRole(roles:Role[]) { const user=await getUser(); if(!user || !roles.includes(user.role)) return {user:null as null, response:Response.json({error:'Forbidden'},{status:user?403:401})}; return {user,response:null}; }

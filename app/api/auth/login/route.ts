import { NextRequest } from 'next/server';
import { db } from '@/lib/db'; import { createSession, verifyPassword } from '@/lib/auth'; import { loginSchema } from '@/lib/validation';
export const runtime='nodejs';
const attempts=new Map<string,{count:number;reset:number}>();
export async function POST(req:NextRequest) {
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown'; const now=Date.now(); const state=attempts.get(ip);
 if(state&&state.reset>now&&state.count>=10)return Response.json({error:'Too many attempts. Try again later.'},{status:429});
 if(!state||state.reset<now)attempts.set(ip,{count:1,reset:now+15*60*1000});else state.count++;
 try { const parsed=loginSchema.safeParse(await req.json()); if(!parsed.success)return Response.json({error:'Invalid email or password.'},{status:400});
 const email=parsed.data.email.toLowerCase(); const user=await db.user.findUnique({where:{email}});
 if(!user||!user.active||!(await verifyPassword(parsed.data.password,user.passwordHash)))return Response.json({error:'Invalid email or password.'},{status:401});
 await createSession(user.id); attempts.delete(ip); await db.auditLog.create({data:{actorId:user.id,action:'LOGIN',entityType:'Session'}});
 return Response.json({user:{id:user.id,name:user.name,email:user.email,role:user.role}});
 } catch(e) { console.error('Login failed:',e instanceof Error?e.message:'unknown error'); return Response.json({error:'Authentication service is temporarily unavailable.'},{status:503}); }
}

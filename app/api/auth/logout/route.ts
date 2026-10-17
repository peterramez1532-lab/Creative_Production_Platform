import { destroySession,getUser } from '@/lib/auth'; import { db } from '@/lib/db';
export const runtime='nodejs';
export async function POST(){try{const user=await getUser(); await destroySession(); if(user)await db.auditLog.create({data:{actorId:user.id,action:'LOGOUT',entityType:'Session'}}); return Response.json({ok:true});}catch(e){console.error('Logout failed:',e instanceof Error?e.message:'unknown error');return Response.json({error:'Unable to complete logout.'},{status:500});}}

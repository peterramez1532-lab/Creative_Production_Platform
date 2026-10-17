import type { Role, User, Project } from '@prisma/client';
export function canViewProject(user:Pick<User,'role'|'organizationId'|'id'>, project:Pick<Project,'organizationId'|'createdById'>) {
 if(user.role==='ADMIN'||user.role==='MANAGER') return true;
 if(user.role==='CLIENT') return Boolean(user.organizationId && user.organizationId===project.organizationId);
 return false;
}
export function canManageProduction(role:Role) { return role==='ADMIN'||role==='MANAGER'; }
export function canSubmitTask(user:Pick<User,'role'|'id'>, task:{assigneeId:string|null}) { return user.role==='TALENT' && task.assigneeId===user.id; }
export function talentMatchScore(skills:string[], required:string[]) { if(!required.length)return 100; const have=new Set(skills.map(s=>s.toLowerCase())); return Math.round(required.filter(s=>have.has(s.toLowerCase())).length/required.length*100); }
export function deadlineRisk(deadline:Date|null,status:string,now=new Date()) { if(!deadline||['COMPLETED','APPROVED'].includes(status))return 'low'; const days=(deadline.getTime()-now.getTime())/86400000; return days<0?'high':days<2?'medium':'low'; }
export function profitCents(revenueCents:number,costCents:number) { if(revenueCents<0||costCents<0) throw new Error('Amounts must be non-negative'); return revenueCents-costCents; }

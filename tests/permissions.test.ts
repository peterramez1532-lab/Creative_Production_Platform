import {describe,it,expect} from 'vitest';import {canViewProject,canManageProduction,canSubmitTask,talentMatchScore,deadlineRisk,profitCents} from '../lib/permissions';
const user=(role:string,id='u1',organizationId:string|null='org')=>({id,role,organizationId} as never);
describe('authorization and production calculations',()=>{
it('limits clients to their own organization',()=>{expect(canViewProject(user('CLIENT'),{organizationId:'org',createdById:'u2'})).toBe(true);expect(canViewProject(user('CLIENT'),{organizationId:'other',createdById:'u2'})).toBe(false)});
it('allows only managers/admins to manage production',()=>{expect(canManageProduction('MANAGER')).toBe(true);expect(canManageProduction('ADMIN')).toBe(true);expect(canManageProduction('TALENT')).toBe(false)});
it('allows only assigned talent to submit',()=>{expect(canSubmitTask(user('TALENT','u1'),{assigneeId:'u1'})).toBe(true);expect(canSubmitTask(user('TALENT','u1'),{assigneeId:'u2'})).toBe(false)});
it('scores talent skill matches case-insensitively',()=>{expect(talentMatchScore(['Editing','Motion'],['editing','color','motion'])).toBe(67);expect(talentMatchScore([],[])).toBe(100)});
it('marks overdue tasks as high risk',()=>{expect(deadlineRisk(new Date('2020-01-01'),'IN_PROGRESS',new Date('2021-01-01'))).toBe('high');expect(deadlineRisk(null,'IN_PROGRESS')).toBe('low')});
it('calculates profit and rejects negative amounts',()=>{expect(profitCents(10000,6500)).toBe(3500);expect(()=>profitCents(-1,2)).toThrow()});
});

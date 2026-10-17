import { z } from 'zod';
export const loginSchema=z.object({email:z.string().email().max(254),password:z.string().min(1).max(128)});
export const projectSchema=z.object({name:z.string().trim().min(2).max(120),brief:z.string().trim().min(10).max(10000),deadline:z.string().datetime().optional(),budgetCents:z.number().int().min(0).max(1000000000).optional()});
export const taskSchema=z.object({projectId:z.string().min(1),title:z.string().trim().min(2).max(120),description:z.string().trim().min(1).max(5000),assigneeId:z.string().optional(),dueDate:z.string().datetime().optional()});
export const submissionSchema=z.object({note:z.string().trim().min(1).max(5000)});
export const reviewSchema=z.object({decision:z.enum(['approve','revise']),note:z.string().trim().max(2000).optional()});

// apps/web/src/api/plans.ts
import { apiFetch } from './api';

export const getPlans = () => apiFetch('/plans');

export const savePlan = (plan: any) => 
  apiFetch('/plans', {
    method: 'POST',
    body: JSON.stringify(plan), // ✅ Stringify here once
  });

export const loadPlan = (id: number) => apiFetch(`/plans/${id}`);

export const updatePlan = (id: number, plan: any) => 
  apiFetch(`/plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(plan),
  });

export const deletePlan = (id: number) => 
  apiFetch(`/plans/${id}`, {
    method: 'DELETE',
  });


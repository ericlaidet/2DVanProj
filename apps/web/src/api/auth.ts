import { apiFetch } from './api';

export const login = (email: string, password: string) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (name: string, email: string, password: string) =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const checkAvailability = (field: 'username' | 'email', value: string) =>
  apiFetch(`/auth/check-${field}/${value}`);

export const getProfile = () => apiFetch('/auth/profile');

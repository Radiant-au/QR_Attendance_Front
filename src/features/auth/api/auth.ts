import { type AuthResponse, type User } from '../../../types';
import { apiFetch } from '../../../lib/apiClient';

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/auth/user', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const loginAdmin = async (username: string, password: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/auth/admin', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const logout = async (): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  return apiFetch<{ user: User }>('/auth/me');
};

export const updateProfile = async (id: string, data: Partial<User>): Promise<User> => {
  return apiFetch<User>(`/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const authApi = {
  loginUser,
  loginAdmin,
  logout,
  getCurrentUser,
  updateProfile,
};

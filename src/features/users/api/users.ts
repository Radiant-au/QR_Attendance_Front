
import { type User, type CreateUserRequest, type UpdateUserRequest } from '../../../types';
import { apiFetch } from '../../../lib/apiClient';

export const getUsers = async (): Promise<User[]> => {
  return apiFetch<User[]>('/user');
};

export const getUserById = async (id: string): Promise<User> => {
  return apiFetch<User>(`/user/${id}`);
};

export const createUser = async (data: CreateUserRequest): Promise<User> => {
  return apiFetch<User>('/user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<User> => {
  return apiFetch<User>(`/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  return apiFetch<void>(`/user/${id}`, {
    method: 'DELETE',
  });
};

export const getQR = async (id: string): Promise<{ qrToken: string }> => {
  return apiFetch<{ qrToken: string }>(`/user/getQR/${id}`);
};

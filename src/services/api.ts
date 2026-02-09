
import {
  type User,
  type Activity,
  type AuthResponse,
  type CreateUserRequest,
  type UpdateUserRequest,
  type CreateActivityRequest
} from '../types';
import { apiFetch } from '../lib/apiClient';

export const authApi = {
  loginUser: async (username: string, password: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/auth/user', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  loginAdmin: async (username: string, password: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/auth/admin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

export const userApi = {
  getUsers: async (): Promise<User[]> => apiFetch<User[]>('/user'),
  getUser: async (id: string): Promise<User> => apiFetch<User>(`/user/${id}`),
  createUser: async (data: CreateUserRequest): Promise<User> => {
    return apiFetch<User>('/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  deleteUser: async (id: string): Promise<void> => {
    return apiFetch<void>(`/user/${id}`, {
      method: 'DELETE',
    });
  },
  updateProfile: async (id: string, data: UpdateUserRequest): Promise<User> => {
    return apiFetch<User>(`/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  getQR: async (id: string): Promise<{ qrToken: string }> => {
    return apiFetch<{ qrToken: string }>(`/user/getQR/${id}`);
  },
};

export const activityApi = {
  getActivities: async (isAdmin: boolean = false): Promise<Activity[]> => {
    const path = isAdmin ? '/activity' : '/activity/user';
    return apiFetch<Activity[]>(path);
  },
  getActivity: async (id: string): Promise<Activity | undefined> => {
    const activities = await apiFetch<Activity[]>('/activity');
    return activities.find(a => a.id === id);
  },
  createActivity: async (data: CreateActivityRequest): Promise<Activity> => {
    return apiFetch<Activity>('/activity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateActivity: async (id: string, data: Partial<CreateActivityRequest>): Promise<Activity> => {
    return apiFetch<Activity>(`/activity/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteActivity: async (id: string): Promise<void> => {
    return apiFetch<void>(`/activity/${id}`, {
      method: 'DELETE',
    });
  },
  updateStatus: async (activityId: string, status: string): Promise<Activity> => {
    return apiFetch<Activity>('/activity/status/change', {
      method: 'PUT',
      body: JSON.stringify({ activityId, status }),
    });
  },
};

export const registrationApi = {
  register: async (userId: string, activityId: string): Promise<any> => {
    return apiFetch<any>('/activity-registration', {
      method: 'POST',
      body: JSON.stringify({ userId, activityId }),
    });
  },
  cancel: async (activityId: string, cancellationReason: string): Promise<any> => {
    return apiFetch<any>('/activity-registration/cancel', {
      method: 'PUT',
      body: JSON.stringify({ activityId, cancellationReason }),
    });
  },
};

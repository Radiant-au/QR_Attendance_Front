
import { type Activity, type CreateActivityRequest } from '../../../types';
import { apiFetch } from '../../../lib/apiClient';

export const getActivities = async (): Promise<Activity[]> => {
  return apiFetch<Activity[]>('/activity');
};

export const getActivity = async (id: string): Promise<Activity | undefined> => {
  // Documentation doesn't show GET /activity/:id, so we'll fetch all and filter for now
  // or try to guess if the endpoint exists. For now, let's just get all.
  const activities = await getActivities();
  return activities.find(a => a.id === id);
};

export const createActivity = async (data: CreateActivityRequest): Promise<Activity> => {
  return apiFetch<Activity>('/activity', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateActivity = async (id: string, data: Partial<CreateActivityRequest>): Promise<Activity> => {
  return apiFetch<Activity>(`/activity/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteActivity = async (id: string): Promise<void> => {
  return apiFetch<void>(`/activity/${id}`, {
    method: 'DELETE',
  });
};

export const updateStatus = async (activityId: string, status: string): Promise<Activity> => {
  return apiFetch<Activity>('/activity/status/change', {
    method: 'PATCH',
    body: JSON.stringify({ activityId, status }),
  });
};

export const registerForActivity = async (userId: string, activityId: string): Promise<any> => {
  return apiFetch<any>('/activity-registration', {
    method: 'POST',
    body: JSON.stringify({ userId, activityId }),
  });
};

export const submitLeaveRequest = async (activityId: string, cancellationReason: string): Promise<any> => {
  return apiFetch<any>('/activity-registration/cancel', {
    method: 'PUT',
    body: JSON.stringify({ activityId, cancellationReason }),
  });
};

export const getActivityAttendance = async (activityId: string): Promise<any> => {
  return apiFetch<any>(`/activity/${activityId}/attendance`);
};

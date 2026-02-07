
import { Activity, ActivityStatus } from '../../../types';
import { DB_KEYS } from '../../../config';
import { getFromDB, saveToDB } from '../../../lib/db';

export const getActivities = async (): Promise<Activity[]> => getFromDB<Activity>(DB_KEYS.ACTIVITIES);

export const getActivity = async (id: string): Promise<Activity | undefined> => 
  getFromDB<Activity>(DB_KEYS.ACTIVITIES).find(a => a.id === id);

export const createActivity = async (data: Partial<Activity>): Promise<Activity> => {
  const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
  const newAct = { ...data, id: Math.random().toString(36).substr(2, 9), registeredCount: 0 } as Activity;
  saveToDB(DB_KEYS.ACTIVITIES, [...activities, newAct]);
  return newAct;
};

export const updateActivity = async (id: string, data: Partial<Activity>): Promise<Activity> => {
  const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
  const index = activities.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Activity not found');
  activities[index] = { ...activities[index], ...data };
  saveToDB(DB_KEYS.ACTIVITIES, activities);
  return activities[index];
};

export const deleteActivity = async (id: string): Promise<void> => {
  const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES).filter(a => a.id !== id);
  saveToDB(DB_KEYS.ACTIVITIES, activities);
};

export const updateStatus = async (id: string, status: ActivityStatus): Promise<void> => {
  const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
  const index = activities.findIndex(a => a.id === id);
  if (index !== -1) {
    activities[index].status = status;
    saveToDB(DB_KEYS.ACTIVITIES, activities);
  }
};

export const registerForActivity = async (activityId: string): Promise<void> => {
  const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
  const index = activities.findIndex(a => a.id === activityId);
  if (index !== -1) {
    activities[index].registeredCount += 1;
    saveToDB(DB_KEYS.ACTIVITIES, activities);
  }
};

export const submitLeaveRequest = async (activityId: string, reason: string): Promise<void> => {
  console.log(`Submitting leave for ${activityId} with reason: ${reason}`);
  const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
  const index = activities.findIndex(a => a.id === activityId);
  if (index !== -1) {
    activities[index].registeredCount -= 1;
    saveToDB(DB_KEYS.ACTIVITIES, activities);
  }
};

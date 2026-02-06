
import { User, Activity, ActivityStatus, AuthResponse, Role } from '../types';
import { STORAGE_KEYS } from '../constants';

const DB_KEYS = {
  USERS: 'tech_db_users',
  ACTIVITIES: 'tech_db_activities',
  REGISTRATIONS: 'tech_db_registrations'
};

// Initialize DB if empty
const initDB = () => {
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
      { id: 'u1', email: 'student@uni.edu', fullName: 'John Doe', major: 'CS', year: '3rd Year', isProfileCompleted: true, role: Role.USER },
      { id: 'a1', email: 'admin@uni.edu', isProfileCompleted: true, role: Role.ADMIN }
    ]));
  }
  if (!localStorage.getItem(DB_KEYS.ACTIVITIES)) {
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify([
      { id: '1', title: 'Python Workshop', description: 'Deep dive into Python.', date: '2024-05-20', time: '14:00', location: 'Hall A', status: ActivityStatus.UPCOMING, registeredCount: 45 },
      { id: '2', title: 'Hackathon 2024', description: '24-hour coding.', date: '2024-06-15', time: '09:00', location: 'Main Lab', status: ActivityStatus.ONGOING, registeredCount: 120 }
    ]));
  }
};

initDB();

const getFromDB = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const saveToDB = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const authApi = {
  loginUser: async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getFromDB<User>(DB_KEYS.USERS);
        const user = users.find(u => u.email === email && u.role === Role.USER);
        if (user) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-user');
          resolve({ token: 'mock-jwt-token-user', user });
        } else {
          reject('Invalid credentials');
        }
      }, 500);
    });
  },
  loginAdmin: async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getFromDB<User>(DB_KEYS.USERS);
        const user = users.find(u => u.email === email && u.role === Role.ADMIN);
        if (user) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-admin');
          resolve({ token: 'mock-jwt-token-admin', user });
        } else {
          reject('Invalid credentials');
        }
      }, 500);
    });
  },
};

export const userApi = {
  getUsers: async (): Promise<User[]> => getFromDB<User>(DB_KEYS.USERS),
  createUser: async (user: Partial<User>): Promise<User> => {
    const users = getFromDB<User>(DB_KEYS.USERS);
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9), isProfileCompleted: false } as User;
    saveToDB(DB_KEYS.USERS, [...users, newUser]);
    return newUser;
  },
  deleteUser: async (id: string): Promise<void> => {
    const users = getFromDB<User>(DB_KEYS.USERS).filter(u => u.id !== id);
    saveToDB(DB_KEYS.USERS, users);
  },
  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    const users = getFromDB<User>(DB_KEYS.USERS);
    const index = users.findIndex(u => u.id === id);
    users[index] = { ...users[index], ...data, isProfileCompleted: true };
    saveToDB(DB_KEYS.USERS, users);
    return users[index];
  },
  getQR: async (id: string): Promise<string> => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=USER_${id}_${Date.now()}`;
  },
};

export const activityApi = {
  getActivities: async (): Promise<Activity[]> => getFromDB<Activity>(DB_KEYS.ACTIVITIES),
  getActivity: async (id: string): Promise<Activity | undefined> => getFromDB<Activity>(DB_KEYS.ACTIVITIES).find(a => a.id === id),
  createActivity: async (data: Partial<Activity>): Promise<Activity> => {
    const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
    const newAct = { ...data, id: Math.random().toString(36).substr(2, 9), registeredCount: 0 } as Activity;
    saveToDB(DB_KEYS.ACTIVITIES, [...activities, newAct]);
    return newAct;
  },
  updateActivity: async (id: string, data: Partial<Activity>): Promise<Activity> => {
    const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
    const index = activities.findIndex(a => a.id === id);
    activities[index] = { ...activities[index], ...data };
    saveToDB(DB_KEYS.ACTIVITIES, activities);
    return activities[index];
  },
  deleteActivity: async (id: string): Promise<void> => {
    const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES).filter(a => a.id !== id);
    saveToDB(DB_KEYS.ACTIVITIES, activities);
  },
  updateStatus: async (id: string, status: ActivityStatus): Promise<void> => {
    const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) {
      activities[index].status = status;
      saveToDB(DB_KEYS.ACTIVITIES, activities);
    }
  },
};

export const registrationApi = {
  register: async (activityId: string): Promise<void> => {
    const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
    const index = activities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      activities[index].registeredCount += 1;
      saveToDB(DB_KEYS.ACTIVITIES, activities);
    }
  },
  cancel: async (activityId: string, reason: string): Promise<void> => {
    const activities = getFromDB<Activity>(DB_KEYS.ACTIVITIES);
    const index = activities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      activities[index].registeredCount -= 1;
      saveToDB(DB_KEYS.ACTIVITIES, activities);
    }
  },
};

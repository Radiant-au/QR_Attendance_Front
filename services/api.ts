
import { User, Activity, ActivityStatus, AuthResponse } from '../types';
import { STORAGE_KEYS } from '../constants';

// Simulated storage for demo purposes
const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// In a real app, these would be fetch calls to the specified REST API.
// I will simulate the logic for the sake of functionality in the preview.

export const authApi = {
  loginUser: async (email: string, password: string): Promise<AuthResponse> => {
    // Mock POST /auth/user
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: 'u1',
          email,
          fullName: '',
          isProfileCompleted: false,
          role: 'USER' as any,
        };
        localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-user');
        resolve({ token: 'mock-jwt-token-user', user });
      }, 1000);
    });
  },
  loginAdmin: async (email: string, password: string): Promise<AuthResponse> => {
    // Mock POST /auth/admin
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: 'a1',
          email,
          isProfileCompleted: true,
          role: 'ADMIN' as any,
        };
        localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-admin');
        resolve({ token: 'mock-jwt-token-admin', user });
      }, 1000);
    });
  },
};

export const userApi = {
  getProfile: async (id: string): Promise<User> => {
    // GET /user/:id
    return {
      id,
      email: 'user@example.com',
      fullName: 'John Doe',
      major: 'Computer Science',
      year: '3rd Year',
      isProfileCompleted: true,
      role: 'USER' as any,
    };
  },
  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    // PUT /user/:id
    return { id, ...data, isProfileCompleted: true, role: 'USER' as any } as User;
  },
  getQR: async (id: string): Promise<string> => {
    // GET /user/getQR/:id
    // Returning a placeholder image URL representing a QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${id}_${Date.now()}`;
  },
};

export const activityApi = {
  getActivities: async (): Promise<Activity[]> => {
    // GET /activity/user
    return [
      {
        id: '1',
        title: 'Python Workshop',
        description: 'Deep dive into Python fundamentals and data science.',
        date: '2024-05-20',
        time: '14:00',
        location: 'Hall A',
        status: ActivityStatus.UPCOMING,
        registeredCount: 45,
      },
      {
        id: '2',
        title: 'Hackathon 2024',
        description: '24-hour coding challenge for innovation.',
        date: '2024-06-15',
        time: '09:00',
        location: 'Main Lab',
        status: ActivityStatus.ONGOING,
        registeredCount: 120,
      },
    ];
  },
  createActivity: async (data: any): Promise<Activity> => {
    // POST /activity
    return { id: Math.random().toString(), ...data, registeredCount: 0 };
  },
  updateStatus: async (id: string, status: ActivityStatus): Promise<void> => {
    // PUT /activity/status/change
    console.log(`Status of ${id} changed to ${status}`);
  },
};

export const registrationApi = {
  register: async (activityId: string): Promise<void> => {
    // POST /activity-registration
    console.log(`Registered for ${activityId}`);
  },
  cancel: async (activityId: string, reason: string): Promise<void> => {
    // PUT /activity-registration/cancel
    console.log(`Cancelled ${activityId} because ${reason}`);
  },
};

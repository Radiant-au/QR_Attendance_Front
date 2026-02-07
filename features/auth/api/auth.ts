
import { AuthResponse, User, Role } from '../../../types';
import { STORAGE_KEYS, DB_KEYS } from '../../../config';
import { getFromDB, saveToDB } from '../../../lib/db';

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
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
};

export const loginAdmin = async (email: string, password: string): Promise<AuthResponse> => {
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
};

export const updateProfile = async (id: string, data: Partial<User>): Promise<User> => {
  const users = getFromDB<User>(DB_KEYS.USERS);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...data, isProfileCompleted: true };
  saveToDB(DB_KEYS.USERS, users);
  return users[index];
};

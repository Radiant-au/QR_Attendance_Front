
import { User, Role } from '../../../types';
import { DB_KEYS } from '../../../config';
import { getFromDB, saveToDB } from '../../../lib/db';

export const getUsers = async (): Promise<User[]> => getFromDB<User>(DB_KEYS.USERS);

export const createUser = async (user: Partial<User>): Promise<User> => {
  const users = getFromDB<User>(DB_KEYS.USERS);
  const newUser = { ...user, id: Math.random().toString(36).substr(2, 9), isProfileCompleted: false } as User;
  saveToDB(DB_KEYS.USERS, [...users, newUser]);
  return newUser;
};

export const deleteUser = async (id: string): Promise<void> => {
  const users = getFromDB<User>(DB_KEYS.USERS).filter(u => u.id !== id);
  saveToDB(DB_KEYS.USERS, users);
};

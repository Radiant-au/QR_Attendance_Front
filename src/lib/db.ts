
import { DB_KEYS } from '../config';
import { Role, ActivityStatus, User, Activity } from '../types';

export const initDB = () => {
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
      { id: 'u1', email: 'student@uni.edu', fullName: 'John Doe', major: 'CS', year: '3rd Year', isProfileCompleted: true, role: Role.USER },
      { id: 'a1', email: 'admin@uni.edu', isProfileCompleted: true, role: Role.ADMIN }
    ]));
  }
  if (!localStorage.getItem(DB_KEYS.ACTIVITIES)) {
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify([
      { id: '1', title: 'Python Workshop', description: 'Deep dive into Python for data science and web development.', date: '2024-05-20', time: '14:00', location: 'Hall A, Floor 2', status: ActivityStatus.UPCOMING, registeredCount: 45 },
      { id: '2', title: 'Hackathon 2024', description: 'Our annual 24-hour coding competition with great prizes.', date: '2024-06-15', time: '09:00', location: 'Main Computing Lab', status: ActivityStatus.ONGOING, registeredCount: 120 },
      { id: '3', title: 'UI/UX Design Session', description: 'Learning Figma and responsive design principles.', date: '2024-05-18', time: '10:00', location: 'Room 302', status: ActivityStatus.REGISTRATION_CLOSED, registeredCount: 32 }
    ]));
  }
};

export const getFromDB = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
export const saveToDB = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

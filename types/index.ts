
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ActivityStatus {
  UPCOMING = 'Upcoming',
  REGISTRATION_CLOSED = 'Registration Closed',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed'
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  major?: string;
  year?: string;
  isProfileCompleted: boolean;
  role: Role;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: ActivityStatus;
  registeredCount: number;
}

export interface Registration {
  id: string;
  activityId: string;
  userId: string;
  status: 'registered' | 'attended' | 'cancelled';
  cancelReason?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

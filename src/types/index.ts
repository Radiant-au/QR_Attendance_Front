
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
  username: string;
  fullName?: string;
  major?: string;
  year?: string;
  isProfileCompleted: boolean | string;
  role: Role;
  createdAt?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  status: ActivityStatus | string;
  registeredCount?: number;
}

export interface Registration {
  id: string;
  activityId: string;
  userId: string;
  status: 'registered' | 'attended' | 'cancelled';
  cancellationReason?: string;
  cancelReason?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

// Request DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  fullName: string;
  major: string;
  year: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  status: string;
}

export interface UpdateActivityStatusRequest {
  activityId: string;
  status: string;
}

export interface RegisterActivityRequest {
  userId: string;
  activityId: string;
}

export interface CancelActivityRequest {
  cancellationReason: string;
  activityId: string;
}

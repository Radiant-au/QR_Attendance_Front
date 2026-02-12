
export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

export enum ActivityStatus {
  UPCOMING = 'upcoming',
  REGISTRATION_CLOSED = 'closed',
  ONGOING = 'ongoing',
  COMPLETED = 'completed'
}

export type Major = 'IS' | 'CE' | 'EcE' | 'PrE' | 'AME';
export type Year = '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th';

export interface UserAttendance {
  actvityName: string;
  isPresent: boolean;
  scanMethod: string;
}

export interface User {
  id: string;
  username: string;
  fullName?: string;
  major?: Major;
  year?: Year;
  isProfileCompleted: boolean | string;
  role: Role;
  createdAt?: string;
}

export interface OneUser extends User {
  registrations: string[];
  attendances: UserAttendance[];
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
  isRegistered?: boolean;
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
  user: User;
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
  major: Major;
  year: Year;
  isProfileCompleted?: boolean;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  startDateTime: Date;
  endDateTime?: Date;
  location: string;
  status?: string;
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

export interface MarkAttendanceRequest {
  activityId: string;
  qrToken: string;
  scanMethod: string;
}

export interface AttendanceResponse {
  userName: string;
  attendanceType: string;
  message: string;
}

export interface ActivityRegistrationResponse {
  username: string;
  fullName: string;
  major: string;
  year: string;
  registeredAt: Date;
}

export interface AttendanceRecord {
  id: string;
  userName: string;
  major: string;
  year: string;
  attendanceType: string;
  isPresent: boolean;
  notes: string;
}


export interface RegisterAttendanceResponseDTO {
  registration: ActivityRegistrationResponse[];
  attendance: AttendanceRecord[];
}

export interface LeaveRequest {
  activityId: string;
  notes: string;
}

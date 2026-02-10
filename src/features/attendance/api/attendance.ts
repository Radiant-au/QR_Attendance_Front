import { apiFetch } from "../../../lib/apiClient";
import { type AttendanceResponse, type MarkAttendanceRequest } from "../../../types";

export const getQR = async (id: string): Promise<string> => {
  return apiFetch<string>(`/user/getQR/${id}`);
};

export const markAttendance = async (data: MarkAttendanceRequest): Promise<AttendanceResponse> => {
  return apiFetch<AttendanceResponse>('/attendance/mark', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

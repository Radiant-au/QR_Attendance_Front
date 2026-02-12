
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from './attendance';
import { type LeaveRequest, type MarkAttendanceRequest } from '../../../types';

export const useMarkAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: MarkAttendanceRequest) => attendanceApi.markAttendance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            // invalidate other queries if needed, e.g. user attendance
        },
    });
};

export const useSubmitLeave = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LeaveRequest) => attendanceApi.submitLeave(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
    });
};

export const useQR = (id: string) => {
    return useQuery({
        queryKey: ['users', 'qr', id],
        queryFn: () => attendanceApi.getQR(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

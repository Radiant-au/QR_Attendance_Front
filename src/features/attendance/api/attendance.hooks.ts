import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQR, markAttendance } from './attendance';
import { type MarkAttendanceRequest } from '../../../types';

export const useQR = (id: string) => {
    return useQuery({
        queryKey: ['users', 'qr', id],
        queryFn: () => getQR(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useMarkAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: MarkAttendanceRequest) => markAttendance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
    });
};

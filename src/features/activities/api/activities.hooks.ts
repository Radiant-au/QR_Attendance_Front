import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as activitiesApi from './activities';
import { type CreateActivityRequest } from '../../../types';

export const useActivities = () => {
    return useQuery({
        queryKey: ['activities'],
        queryFn: () => activitiesApi.getActivities(),
    });
};

export const useActivity = (id: string) => {
    return useQuery({
        queryKey: ['activities', id],
        queryFn: () => activitiesApi.getActivity(id),
        enabled: !!id,
    });
};

export const useCreateActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateActivityRequest) => activitiesApi.createActivity(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
    });
};

export const useUpdateActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateActivityRequest> }) =>
            activitiesApi.updateActivity(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            queryClient.invalidateQueries({ queryKey: ['activities', id] });
        },
    });
};

export const useDeleteActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => activitiesApi.deleteActivity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
    });
};

export const useUpdateActivityStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ activityId, status }: { activityId: string; status: string }) =>
            activitiesApi.updateStatus(activityId, status),
        onSuccess: (_, { activityId }) => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            queryClient.invalidateQueries({ queryKey: ['activities', activityId] });
        },
    });
};

export const useRegisterActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, activityId }: { userId: string; activityId: string }) =>
            activitiesApi.registerForActivity(userId, activityId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
    });
};

export const useCancelRegistration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ activityId, cancellationReason }: { activityId: string; cancellationReason: string }) =>
            activitiesApi.submitLeaveRequest(activityId, cancellationReason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
    });
};

export const useActivityAttendance = (activityId: string) => {
    return useQuery({
        queryKey: ['activities', activityId, 'attendance'],
        queryFn: () => activitiesApi.getActivityAttendance(activityId),
        enabled: !!activityId,
    });
};

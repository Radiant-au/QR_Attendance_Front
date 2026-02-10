import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as usersApi from './users';
import { type CreateUserRequest, type UpdateUserRequest } from '../../../types';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => usersApi.getUsers(),
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => usersApi.getUserById(id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
            usersApi.updateUser(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', id] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usersApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
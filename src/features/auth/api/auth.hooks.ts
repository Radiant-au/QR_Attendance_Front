import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './auth';
import { STORAGE_KEYS } from '../../../config';
import { type LoginRequest, type AuthResponse, type User } from '../../../types';

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginRequest) =>
            authApi.loginUser(credentials.username, credentials.password),
        onSuccess: (data: AuthResponse) => {
            if (data.user) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
                queryClient.setQueryData(['me'], { user: data.user });
            }
        },
    });
};

export const useAdminLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginRequest) =>
            authApi.loginAdmin(credentials.username, credentials.password),
        onSuccess: (data: AuthResponse) => {
            if (data.user) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
                queryClient.setQueryData(['me'], { user: data.user });
            }
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            queryClient.setQueryData(['me'], null);
            queryClient.clear();
        },
    });
};

export const useMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => authApi.getCurrentUser(),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
            authApi.updateProfile(id, data),
        onSuccess: (updatedUser) => {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            queryClient.setQueryData(['me'], { user: updatedUser });
        },
    });
};

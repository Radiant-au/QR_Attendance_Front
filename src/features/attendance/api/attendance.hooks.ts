import { useQuery } from '@tanstack/react-query';
import { getQR } from './attendance';

export const useQR = (id: string) => {
    return useQuery({
        queryKey: ['users', 'qr', id],
        queryFn: () => getQR(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

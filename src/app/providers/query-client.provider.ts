import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
        retry: 2,
        retryDelay: (failureCount: number, error: unknown | Error): number => {
            return 2000;
        },
        networkMode: 'offlineFirst',
        },
    },
});
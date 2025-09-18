// services/helpers/swrHelper.ts

import useSWR, {SWRConfiguration, SWRResponse} from 'swr';
import {useAuth} from '@/feature/auth/context/AuthProvider';

/**
 * Crée un hook SWR réutilisable pour les appels API authentifiés
 * @param endpoint Le point de terminaison API
 * @param fetcher La fonction qui effectue l'appel API
 * @param config Configuration SWR optionnelle
 */
export function useAuthenticatedSWR<T>(
    key: [string, Record<string, unknown>] | null,
    fetcher: (endpoint: string, token: string, params?: Record<string, unknown>) => Promise<T>,
    config?: SWRConfiguration
): SWRResponse<T, Error> & { isAuthenticated: boolean } {
    const {user, isAuthenticated} = useAuth();
    const token = user?.token;

    const {data, error, isLoading, mutate} = useSWR(
        isAuthenticated && token && key ? key : null,
        ([endpoint, params]) => fetcher(endpoint, token ?? "", params),
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000,
            ...config
        }
    );

    return {
        data,
        error,
        isLoading,
        isValidating: isLoading,
        mutate,
        isAuthenticated
    };
}



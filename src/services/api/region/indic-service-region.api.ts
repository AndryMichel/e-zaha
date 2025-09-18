import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurRegionParams,
    RegionAccesAssainissementResponse,
    RegionAccesEauResponse,
    RegionAccesElectriciteResponse
} from "@/services/types/indic-region.type";

// Service API pour les indicateurs des services de base régionaux
export const indicServiceRegionApi = {
    // Taux d'accès au service d'eau de base
    getTauxAccesServiceEauBase: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionAccesEauResponse> => {
        return await apiClient.get<RegionAccesEauResponse>(
            "/api/indicateur-region/taux-acces-service-eau-base",
            params,
            token
        );
    },

    // Taux d'accès à l'assainissement de base
    getTauxAccesAssainissementBase: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionAccesAssainissementResponse> => {
        return await apiClient.get<RegionAccesAssainissementResponse>(
            "/api/indicateur-region/taux-acces-assainissement-base",
            params,
            token
        );
    },

    // Taux d'accès à l'électricité
    getTauxAccesElectricite: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionAccesElectriciteResponse> => {
        return await apiClient.get<RegionAccesElectriciteResponse>(
            "/api/indicateur-region/taux-acces-electricite",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des APIs
export const useGetTauxAccesServiceEauBase = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionAccesEauResponse>(
        ["/api/indicateur-region/taux-acces-service-eau-base", params],
        (endpoint, token, params) => indicServiceRegionApi.getTauxAccesServiceEauBase(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetTauxAccesAssainissementBase = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionAccesAssainissementResponse>(
        ["/api/indicateur-region/taux-acces-assainissement-base", params],
        (endpoint, token, params) => indicServiceRegionApi.getTauxAccesAssainissementBase(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetTauxAccesElectricite = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionAccesElectriciteResponse>(
        ["/api/indicateur-region/taux-acces-electricite", params],
        (endpoint, token, params) => indicServiceRegionApi.getTauxAccesElectricite(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
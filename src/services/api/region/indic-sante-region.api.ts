import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurRegionParams,
    RegionRatioFsPopulationResponse,
    RegionRatioPersonnelSanteResponse,
    RegionTauxInsecuriteAlimentaireResponse,
    RegionTauxMalnutritionResponse
} from "@/services/types/indic-region.type";

// Service API pour les indicateurs de santé et sécurité régionaux
export const indicSanteRegionApi = {
    // Ratio formations sanitaires fonctionnelles/population
    getRatioFsPopulation: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionRatioFsPopulationResponse> => {
        return await apiClient.get<RegionRatioFsPopulationResponse>(
            "/api/indicateur-region/ratio-fs-fonctionnel-population",
            params,
            token
        );
    },

    // Ratio personnel de santé/population
    getRatioPersonnelSantePopulation: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionRatioPersonnelSanteResponse> => {
        return await apiClient.get<RegionRatioPersonnelSanteResponse>(
            "/api/indicateur-region/ratio-personnel-sante-population",
            params,
            token
        );
    },

    // Taux de malnutrition aiguë
    getTauxMalnutritionAigue: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionTauxMalnutritionResponse> => {
        return await apiClient.get<RegionTauxMalnutritionResponse>(
            "/api/indicateur-region/taux-malnutrition-aigue",
            params,
            token
        );
    },

    // Taux d'insécurité alimentaire
    getTauxInsecuriteAlimentaire: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionTauxInsecuriteAlimentaireResponse> => {
        return await apiClient.get<RegionTauxInsecuriteAlimentaireResponse>(
            "/api/indicateur-region/taux-insecurite-alimentaire",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des APIs
export const useGetRatioFsPopulation = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionRatioFsPopulationResponse>(
        ["/api/indicateur-region/ratio-fs-fonctionnel-population", params],
        (endpoint, token, params) => indicSanteRegionApi.getRatioFsPopulation(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetRatioPersonnelSantePopulation = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionRatioPersonnelSanteResponse>(
        ["/api/indicateur-region/ratio-personnel-sante-population", params],
        (endpoint, token, params) => indicSanteRegionApi.getRatioPersonnelSantePopulation(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetTauxMalnutritionAigue = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionTauxMalnutritionResponse>(
        ["/api/indicateur-region/taux-malnutrition-aigue", params],
        (endpoint, token, params) => indicSanteRegionApi.getTauxMalnutritionAigue(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetTauxInsecuriteAlimentaire = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionTauxInsecuriteAlimentaireResponse>(
        ["/api/indicateur-region/taux-insecurite-alimentaire", params],
        (endpoint, token, params) => indicSanteRegionApi.getTauxInsecuriteAlimentaire(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
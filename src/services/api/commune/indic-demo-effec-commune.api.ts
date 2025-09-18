import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {EffectifPopulationCommuneResponse, GetIndicateurCommuneParams} from "@/services/types/indic-commune.type";

// Service API pour les indicateurs démographiques des communes
export const indicDemoCommuneApi = {
    // Effectif total de la population
    getEffectifTotalPopulation: async (
        token: string,
        params?: GetIndicateurCommuneParams
    ): Promise<EffectifPopulationCommuneResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/effectif-total-population",
            params,
            token
        );
    }
};

// Hook personnalisé pour faciliter l'utilisation de l'API
export const useGetEffectifTotalPopulation = (params: GetIndicateurCommuneParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/effectif-total-population", params],
        (endpoint, token, params) => indicDemoCommuneApi.getEffectifTotalPopulation(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
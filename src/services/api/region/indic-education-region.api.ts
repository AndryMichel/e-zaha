import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurRegionParams,
    RegionTauxAbandonScolairePrimaireResponse,
    RegionTauxScolarisationPrimaireResponse
} from "@/services/types/indic-region.type";

// Service API pour les indicateurs d'éducation régionaux
export const indicEducationRegionApi = {
    // Taux brut de scolarisation au primaire
    getTauxBrutScolarisationPrimaire: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionTauxScolarisationPrimaireResponse> => {
        return await apiClient.get<RegionTauxScolarisationPrimaireResponse>(
            "/api/indicateur-region/taux-brut-scolarisation-primaire",
            params,
            token
        );
    },

    // Taux d'abandon scolaire au primaire
    getTauxAbandonScolairePrimaire: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionTauxAbandonScolairePrimaireResponse> => {
        return await apiClient.get<RegionTauxAbandonScolairePrimaireResponse>(
            "/api/indicateur-region/taux-abandon-scolaire-primaire",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des APIs
export const useGetTauxBrutScolarisationPrimaire = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionTauxScolarisationPrimaireResponse>(
        ["/api/indicateur-region/taux-brut-scolarisation-primaire", params],
        (endpoint, token, params) => indicEducationRegionApi.getTauxBrutScolarisationPrimaire(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetTauxAbandonScolairePrimaire = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionTauxAbandonScolairePrimaireResponse>(
        ["/api/indicateur-region/taux-abandon-scolaire-primaire", params],
        (endpoint, token, params) => indicEducationRegionApi.getTauxAbandonScolairePrimaire(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
// @/services/api/commune/indic-env.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {GetIndicateurCommuneParams} from "@/services/types/indic-commune.type";
import {ConservationCommuneResponse, GRCCommuneResponse} from "@/services/types/indic-envi.type";

// Service API pour les indicateurs environnementaux des communes
export const indicEnvCommuneApi = {
    // Pourcentage des communes avec GRC opérationnel
    getPourcentageCommunesGRC: async (
        token: string,
        params?: GetIndicateurCommuneParams
    ): Promise<GRCCommuneResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/pourcentage-communes-grc",
            params,
            token
        );
    },

    // Pourcentage des communes avec actions de conservation environnementale
    getPourcentageCommunesConservation: async (
        token: string,
        params?: GetIndicateurCommuneParams
    ): Promise<ConservationCommuneResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/pourcentage-communes-conservation-environnement",
            params,
            token
        );
    }
};

// Hook personnalisé pour récupérer les données GRC
export const useGetPourcentageCommunesGRC = (params: GetIndicateurCommuneParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/pourcentage-communes-grc", params],
        (endpoint, token, params) => indicEnvCommuneApi.getPourcentageCommunesGRC(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook personnalisé pour récupérer les données de conservation environnementale
export const useGetPourcentageCommunesConservation = (params: GetIndicateurCommuneParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/pourcentage-communes-conservation-environnement", params],
        (endpoint, token, params) => indicEnvCommuneApi.getPourcentageCommunesConservation(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
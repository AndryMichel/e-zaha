import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurGouvernanceParams,
    GouvernanceCommuneResponse,
    PourcentageCommunesActesResponse,
    PourcentageCommunesBIFResponse
} from "@/services/types/indic-Gouv.type";

// Service API pour les indicateurs de gouvernance des communes
export const indicGouverCommuneApi = {
    // Pourcentage des communes avec Système Local de Coordination (SLC)
    getPourcentageCommunesSLC: async (
        token: string,
        params?: GetIndicateurGouvernanceParams
    ): Promise<GouvernanceCommuneResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-gouv/pourcentage-communes-slc",
            params,
            token
        );
    },

    // Proportion des communes avec Système d'Appui Communal (SAC)
    getProportionCommunesSAC: async (
        token: string,
        params?: GetIndicateurGouvernanceParams
    ): Promise<GouvernanceCommuneResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-gouv/proportion-communes-sac",
            params,
            token
        );
    },

    // Pourcentage des communes avec Plan de Développement Local Intégré et Inclusif (PDLII)
    getPourcentageCommunesPDLII: async (
        token: string,
        params?: GetIndicateurGouvernanceParams
    ): Promise<GouvernanceCommuneResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-gouv/pourcentage-communes-pdlii",
            params,
            token
        );
    }
};

// Hooks personnalisés pour chaque indicateur de gouvernance

export const useGetPourcentageCommunesSLC = (params: GetIndicateurGouvernanceParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-gouv/pourcentage-communes-slc", params],
        (endpoint, token, params) => indicGouverCommuneApi.getPourcentageCommunesSLC(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const indicGouvernanceCommuneApiExtended = {
    // Pourcentage des communes ayant un BIF fonctionnel
    getPourcentageCommunesBIF: async (
        token: string,
        params?: GetIndicateurGouvernanceParams
    ): Promise<PourcentageCommunesBIFResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/pourcentage-communes-bif",
            params,
            token
        );
    },

    // Pourcentage des communes ayant soumis des actes administratifs
    getPourcentageCommunesActes: async (
        token: string,
        params?: GetIndicateurGouvernanceParams
    ): Promise<PourcentageCommunesActesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-gouv/pourcentage-communes-actes-administratifs",
            params,
            token
        );
    }
};

export const useGetProportionCommunesSAC = (params: GetIndicateurGouvernanceParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-gouv/proportion-communes-sac", params],
        (endpoint, token, params) => indicGouverCommuneApi.getProportionCommunesSAC(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageCommunesPDLII = (params: GetIndicateurGouvernanceParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-gouv/pourcentage-communes-pdlii", params],
        (endpoint, token, params) => indicGouverCommuneApi.getPourcentageCommunesPDLII(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageCommunesBIF = (params?: GetIndicateurGouvernanceParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune/pourcentage-communes-bif", params] : null,
        (endpoint, token, params) => indicGouvernanceCommuneApiExtended.getPourcentageCommunesBIF(token, params)
    );


    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le pourcentage des communes ayant soumis des actes administratifs
export const useGetPourcentageCommunesActes = (params?: GetIndicateurGouvernanceParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-gouv/pourcentage-communes-actes-administratifs", params] : null,
        (endpoint, token, params) => indicGouvernanceCommuneApiExtended.getPourcentageCommunesActes(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurRegionParams,
    RegionAccesPlateformeResponse,
    RegionGestionRisquesResponse,
    RegionPrdAJourResponse,
    RegionPresentationBudgetResponse,
    RegionSratClimatResponse,
    RegionSrcOperationnelleResponse
} from "@/services/types/indic-region.type";

// Service API pour les indicateurs de gouvernance régionale
export const indicGouvRegionApi = {
    // Pourcentage de régions avec système de gestion des risques
    getPourcentageRegionsGestionRisques: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionGestionRisquesResponse> => {
        return await apiClient.get<RegionGestionRisquesResponse>(
            "/api/indicateur-region/pourcentage-regions-gestion-risques",
            params,
            token
        );
    },

    // Pourcentage de régions avec SRC opérationnelle
    getPourcentageRegionsSrcOperationnelle: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionSrcOperationnelleResponse> => {
        return await apiClient.get<RegionSrcOperationnelleResponse>(
            "/api/indicateur-region/pourcentage-regions-src-operationnelle",
            params,
            token
        );
    },

    // Pourcentage de régions avec SRAT intégrant le climat
    getPourcentageRegionsSratClimat: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionSratClimatResponse> => {
        return await apiClient.get<RegionSratClimatResponse>(
            "/api/indicateur-region/pourcentage-regions-srat-climat",
            params,
            token
        );
    },

    // Pourcentage de régions avec PRD à jour
    getPourcentageRegionsPrdAJour: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionPrdAJourResponse> => {
        return await apiClient.get<RegionPrdAJourResponse>(
            "/api/indicateur-region/pourcentage-regions-prd-a-jour",
            params,
            token
        );
    },

    // Pourcentage de régions avec accès à la plateforme
    getPourcentageRegionsAccesPlateforme: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionAccesPlateformeResponse> => {
        return await apiClient.get<RegionAccesPlateformeResponse>(
            "/api/indicateur-region/pourcentage-regions-acces-plateforme",
            params,
            token
        );
    },

    // Pourcentage de régions avec présentation du budget
    getPourcentageRegionsPresentationBudget: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionPresentationBudgetResponse> => {
        return await apiClient.get<RegionPresentationBudgetResponse>(
            "/api/indicateur-region/pourcentage-regions-presentation-budget",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des APIs
export const useGetPourcentageRegionsGestionRisques = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionGestionRisquesResponse>(
        ["/api/indicateur-region/pourcentage-regions-gestion-risques", params],
        (endpoint, token, params) => indicGouvRegionApi.getPourcentageRegionsGestionRisques(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageRegionsSrcOperationnelle = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionSrcOperationnelleResponse>(
        ["/api/indicateur-region/pourcentage-regions-src-operationnelle", params],
        (endpoint, token, params) => indicGouvRegionApi.getPourcentageRegionsSrcOperationnelle(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageRegionsSratClimat = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionSratClimatResponse>(
        ["/api/indicateur-region/pourcentage-regions-srat-climat", params],
        (endpoint, token, params) => indicGouvRegionApi.getPourcentageRegionsSratClimat(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageRegionsPrdAJour = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionPrdAJourResponse>(
        ["/api/indicateur-region/pourcentage-regions-prd-a-jour", params],
        (endpoint, token, params) => indicGouvRegionApi.getPourcentageRegionsPrdAJour(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageRegionsAccesPlateforme = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionAccesPlateformeResponse>(
        ["/api/indicateur-region/pourcentage-regions-acces-plateforme", params],
        (endpoint, token, params) => indicGouvRegionApi.getPourcentageRegionsAccesPlateforme(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageRegionsPresentationBudget = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionPresentationBudgetResponse>(
        ["/api/indicateur-region/pourcentage-regions-presentation-budget", params],
        (endpoint, token, params) => indicGouvRegionApi.getPourcentageRegionsPresentationBudget(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
// indic-invest-oddl.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurParams,
    PoidsRecettesFiscalesSurRecettesPropresResponse,
    PourcentageCommunesIndependanceFinanciereResponse,
    PourcentageCommunesInvestissementSurRecettesPropresResponse,
    RatioIndependanceFinanciereResponse,
    RatioInvestissementsHorsSubventionsResponse
} from "@/services/types/indic.type";

// Service API pour les indicateurs d'Investissement et Autonomie Financière
export const indicInvestApi = {
    // Pourcentage des communes qui investissent au moins 15% de leurs recettes propres
    getPourcentageCommunesInvestissement: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesInvestissementSurRecettesPropresResponse> => {
        return await apiClient.get<PourcentageCommunesInvestissementSurRecettesPropresResponse>(
            "/api/indicateur-oddl/pourcentage-communes-investissement-sur-recettes-propres",
            params,
            token
        );
    },

    // Ratio des investissements hors subventions
    getRatioInvestissementsHorsSubventions: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<RatioInvestissementsHorsSubventionsResponse> => {
        return await apiClient.get<RatioInvestissementsHorsSubventionsResponse>(
            "/api/indicateur-oddl/ratio-investissements-hors-subventions",
            params,
            token
        );
    },

    // Ratio d'indépendance financière
    getRatioIndependanceFinanciere: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<RatioIndependanceFinanciereResponse> => {
        return await apiClient.get<RatioIndependanceFinanciereResponse>(
            "/api/indicateur-oddl/ratio-independance-financiere",
            params,
            token
        );
    },

    // Pourcentage des communes avec indépendance financière > 50%
    getPourcentageCommunesIndependanceFinanciere: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesIndependanceFinanciereResponse> => {
        return await apiClient.get<PourcentageCommunesIndependanceFinanciereResponse>(
            "/api/indicateur-oddl/pourcentage-communes-independance-financiere",
            params,
            token
        );
    },

    // Poids des recettes fiscales sur les recettes propres
    getPoidsRecettesFiscalesSurRecettesPropres: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PoidsRecettesFiscalesSurRecettesPropresResponse> => {
        return await apiClient.get<PoidsRecettesFiscalesSurRecettesPropresResponse>(
            "/api/indicateur-oddl/poids-recettes-fiscales-sur-recettes-propres",
            params,
            token
        );
    },
};

// Hooks personnalisés pour faciliter l'utilisation des APIs

// Pourcentage des communes qui investissent au moins 15% de leurs recettes propres
export const useGetPourcentageCommunesInvestissement = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesInvestissementSurRecettesPropresResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-investissement-sur-recettes-propres", params],
        (endpoint, token, params) => indicInvestApi.getPourcentageCommunesInvestissement(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Ratio des investissements hors subventions
export const useGetRatioInvestissementsHorsSubventions = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RatioInvestissementsHorsSubventionsResponse>(
        ["/api/indicateur-oddl/ratio-investissements-hors-subventions", params],
        (endpoint, token, params) => indicInvestApi.getRatioInvestissementsHorsSubventions(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Ratio d'indépendance financière
export const useGetRatioIndependanceFinanciere = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RatioIndependanceFinanciereResponse>(
        ["/api/indicateur-oddl/ratio-independance-financiere", params],
        (endpoint, token, params) => indicInvestApi.getRatioIndependanceFinanciere(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage des communes avec indépendance financière > 50%
export const useGetPourcentageCommunesIndependanceFinanciere = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesIndependanceFinanciereResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-independance-financiere", params],
        (endpoint, token, params) => indicInvestApi.getPourcentageCommunesIndependanceFinanciere(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Poids des recettes fiscales sur les recettes propres
export const useGetPoidsRecettesFiscalesSurRecettesPropres = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PoidsRecettesFiscalesSurRecettesPropresResponse>(
        ["/api/indicateur-oddl/poids-recettes-fiscales-sur-recettes-propres", params],
        (endpoint, token, params) => indicInvestApi.getPoidsRecettesFiscalesSurRecettesPropres(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
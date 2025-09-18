// indic-plan-oddl.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurParams,
    PourcentageCommunesAvecComptesResponse,
    PourcentageCommunesAvecPlanificationResponse,
    PourcentageCommunesEfficacitePrevisionBudgetsResponse,
    PourcentageCommunesMaitriseOuvrageEffectiveResponse,
    PourcentageCommunesStabiliteFinanciereResponse
} from "@/services/types/indic.type";


// Service API pour les indicateurs de planification et Comptabilité
export const indicPlanificationApi = {
    // Pourcentage des communes avec planification
    getPourcentageCommunesAvecPlanification: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesAvecPlanificationResponse> => {
        return await apiClient.get<PourcentageCommunesAvecPlanificationResponse>(
            "/api/indicateur-oddl/pourcentage-communes-avec-planification",
            params,
            token
        );
    },

    // Pourcentage des communes avec comptes
    getPourcentageCommunesAvecComptes: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesAvecComptesResponse> => {
        return await apiClient.get<PourcentageCommunesAvecComptesResponse>(
            "/api/indicateur-oddl/pourcentage-communes-avec-comptes",
            params,
            token
        );
    },

    // Pourcentage des communes avec maîtrise d'ouvrage effective
    getPourcentageCommunesMaitriseOuvrageEffective: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesMaitriseOuvrageEffectiveResponse> => {
        return await apiClient.get<PourcentageCommunesMaitriseOuvrageEffectiveResponse>(
            "/api/indicateur-oddl/pourcentage-communes-maitrise-ouvrage-effective",
            params,
            token
        );
    },

    // Pourcentage des communes avec efficacité de prévision des budgets
    getPourcentageCommunesEfficacitePrevisionBudgets: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesEfficacitePrevisionBudgetsResponse> => {
        return await apiClient.get<PourcentageCommunesEfficacitePrevisionBudgetsResponse>(
            "/api/indicateur-oddl/pourcentage-communes-efficacite-prevision-budgets",
            params,
            token
        );
    },

    // Pourcentage des communes avec stabilité financière
    getPourcentageCommunesStabiliteFinanciere: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesStabiliteFinanciereResponse> => {
        return await apiClient.get<PourcentageCommunesStabiliteFinanciereResponse>(
            "/api/indicateur-oddl/pourcentage-communes-stabilite-financiere",
            params,
            token
        );
    },
};

// Hooks personnalisés pour faciliter l'utilisation des APIs

// Pourcentage des communes avec planification
export const useGetPourcentageCommunesAvecPlanification = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesAvecPlanificationResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-avec-planification", params],
        (endpoint, token, params) => indicPlanificationApi.getPourcentageCommunesAvecPlanification(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage des communes avec comptes
export const useGetPourcentageCommunesAvecComptes = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesAvecComptesResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-avec-comptes", params],
        (endpoint, token, params) => indicPlanificationApi.getPourcentageCommunesAvecComptes(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage des communes avec maîtrise d'ouvrage effective
export const useGetPourcentageCommunesMaitriseOuvrageEffective = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesMaitriseOuvrageEffectiveResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-maitrise-ouvrage-effective", params],
        (endpoint, token, params) => indicPlanificationApi.getPourcentageCommunesMaitriseOuvrageEffective(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage des communes avec efficacité de prévision des budgets
export const useGetPourcentageCommunesEfficacitePrevisionBudgets = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesEfficacitePrevisionBudgetsResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-efficacite-prevision-budgets", params],
        (endpoint, token, params) => indicPlanificationApi.getPourcentageCommunesEfficacitePrevisionBudgets(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage des communes avec stabilité financière
export const useGetPourcentageCommunesStabiliteFinanciere = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesStabiliteFinanciereResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-stabilite-financiere", params],
        (endpoint, token, params) => indicPlanificationApi.getPourcentageCommunesStabiliteFinanciere(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
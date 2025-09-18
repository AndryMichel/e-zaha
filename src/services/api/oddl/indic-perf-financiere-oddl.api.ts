// indic-perf-financiere-oddl.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurParams,
    NiveauRealisationRessourcesCommuneResponse,
    PourcentageCommunesMobilisationRessourcesResponse,
    PourcentageCommunesProgrammationBudgetaireResponse,
    TauxExecutionDepensesObligatoiresResponse,
    TauxProgrammationBudgetaireResponse,
    TauxRealisationBudgetFonctionnementResponse,
    TauxRealisationRecettesFiscalesResponse,
    TauxRealisationRecettesNonFiscalesResponse
} from "@/services/types/indic.type";

// Service API pour les indicateurs de Performance Financière et Budgétaire
export const indicPerfFinanciereApi = {
    // Taux de réalisation des recettes fiscales
    getTauxRealisationRecettesFiscales: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<TauxRealisationRecettesFiscalesResponse> => {
        return await apiClient.get<TauxRealisationRecettesFiscalesResponse>(
            "/api/indicateur-oddl/taux-realisation-recettes-fiscales",
            params,
            token
        );
    },

    // Taux de réalisation des recettes non fiscales
    getTauxRealisationRecettesNonFiscales: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<TauxRealisationRecettesNonFiscalesResponse> => {
        return await apiClient.get<TauxRealisationRecettesNonFiscalesResponse>(
            "/api/indicateur-oddl/taux-realisation-recettes-non-fiscales",
            params,
            token
        );
    },

    // Taux de réalisation du budget de fonctionnement
    getTauxRealisationBudgetFonctionnement: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<TauxRealisationBudgetFonctionnementResponse> => {
        return await apiClient.get<TauxRealisationBudgetFonctionnementResponse>(
            "/api/indicateur-oddl/taux-realisation-budget-fonctionnement",
            params,
            token
        );
    },

    // Taux d'exécution des dépenses obligatoires
    getTauxExecutionDepensesObligatoires: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<TauxExecutionDepensesObligatoiresResponse> => {
        return await apiClient.get<TauxExecutionDepensesObligatoiresResponse>(
            "/api/indicateur-oddl/taux-execution-depenses-obligatoires",
            params,
            token
        );
    },

    // Taux de programmation budgétaire
    getTauxProgrammationBudgetaire: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<TauxProgrammationBudgetaireResponse> => {
        return await apiClient.get<TauxProgrammationBudgetaireResponse>(
            "/api/indicateur-oddl/taux-programmation-budgetaire",
            params,
            token
        );
    },

    // Pourcentage de communes avec programmation budgétaire
    getPourcentageCommunesProgrammationBudgetaire: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesProgrammationBudgetaireResponse> => {
        return await apiClient.get<PourcentageCommunesProgrammationBudgetaireResponse>(
            "/api/indicateur-oddl/pourcentage-communes-programmation-budgetaire",
            params,
            token
        );
    },

    // Niveau de réalisation des ressources de la commune
    getNiveauRealisationRessourcesCommune: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<NiveauRealisationRessourcesCommuneResponse> => {
        return await apiClient.get<NiveauRealisationRessourcesCommuneResponse>(
            "/api/indicateur-oddl/niveau-realisation-ressources-commune",
            params,
            token
        );
    },

    // Pourcentage de communes avec mobilisation de ressources
    getPourcentageCommunesMobilisationRessources: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesMobilisationRessourcesResponse> => {
        return await apiClient.get<PourcentageCommunesMobilisationRessourcesResponse>(
            "/api/indicateur-oddl/pourcentage-communes-mobilisation-ressources",
            params,
            token
        );
    },
};

// Hooks personnalisés pour faciliter l'utilisation des APIs

// Taux de réalisation des recettes fiscales
export const useGetTauxRealisationRecettesFiscales = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<TauxRealisationRecettesFiscalesResponse>(
        ["/api/indicateur-oddl/taux-realisation-recettes-fiscales", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getTauxRealisationRecettesFiscales(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Taux de réalisation des recettes non fiscales
export const useGetTauxRealisationRecettesNonFiscales = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<TauxRealisationRecettesNonFiscalesResponse>(
        ["/api/indicateur-oddl/taux-realisation-recettes-non-fiscales", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getTauxRealisationRecettesNonFiscales(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Taux de réalisation du budget de fonctionnement
export const useGetTauxRealisationBudgetFonctionnement = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<TauxRealisationBudgetFonctionnementResponse>(
        ["/api/indicateur-oddl/taux-realisation-budget-fonctionnement", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getTauxRealisationBudgetFonctionnement(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Taux d'exécution des dépenses obligatoires
export const useGetTauxExecutionDepensesObligatoires = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<TauxExecutionDepensesObligatoiresResponse>(
        ["/api/indicateur-oddl/taux-execution-depenses-obligatoires", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getTauxExecutionDepensesObligatoires(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Taux de programmation budgétaire
export const useGetTauxProgrammationBudgetaire = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<TauxProgrammationBudgetaireResponse>(
        ["/api/indicateur-oddl/taux-programmation-budgetaire", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getTauxProgrammationBudgetaire(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage de communes avec programmation budgétaire
export const useGetPourcentageCommunesProgrammationBudgetaire = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesProgrammationBudgetaireResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-programmation-budgetaire", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getPourcentageCommunesProgrammationBudgetaire(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Niveau de réalisation des ressources de la commune
export const useGetNiveauRealisationRessourcesCommune = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<NiveauRealisationRessourcesCommuneResponse>(
        ["/api/indicateur-oddl/niveau-realisation-ressources-commune", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getNiveauRealisationRessourcesCommune(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage de communes avec mobilisation de ressources
export const useGetPourcentageCommunesMobilisationRessources = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesMobilisationRessourcesResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-mobilisation-ressources", params],
        (endpoint, token, params) => indicPerfFinanciereApi.getPourcentageCommunesMobilisationRessources(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
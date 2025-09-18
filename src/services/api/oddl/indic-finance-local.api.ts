// indic-finance-local.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import useSWR from "swr";
import {
    GetIndicateurParams,
    PourcentageCommunesEfficienceRhResponse,
    PourcentageCommunesInvestissementSurRecettesPropresResponse
} from "@/services/types/indic.type";

// Service API pour les indicateurs financiers locaux - version publique
export const indicFinanceLocalApi = {
    // Pourcentage de communes avec investissement ≥ 15% - Public
    getPourcentageCommunesInvestissementPublic: async (
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesInvestissementSurRecettesPropresResponse> => {
        return await apiClient.get<PourcentageCommunesInvestissementSurRecettesPropresResponse>(
            "/api/indicateur-oddl/pourcentage-communes-investissement-sur-recettes-propres",
            params
        );
    },

    // Pourcentage de communes avec efficience RH ≥ 50% - Public
    getPourcentageCommunesEfficienceRhPublic: async (
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesEfficienceRhResponse> => {
        return await apiClient.get<PourcentageCommunesEfficienceRhResponse>(
            "/api/indicateur-oddl/pourcentage-communes-efficience-rh-superieur-50",
            params
        );
    }
};

// Hooks personnalisés publics (sans token d'authentification)

// Pourcentage de communes avec investissement ≥ 15% - Hook public
export const useGetPourcentageCommunesInvestissementPublic = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-oddl/pourcentage-communes-investissement-sur-recettes-propres", params],
        () => indicFinanceLocalApi.getPourcentageCommunesInvestissementPublic(params)
    );

    return {
        data: data || null,
        isLoading,
        isError: error,
        mutate
    };
};

// Pourcentage de communes avec efficience RH ≥ 50% - Hook public
export const useGetPourcentageCommunesEfficienceRhPublic = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-oddl/pourcentage-communes-efficience-rh-superieur-50", params],
        () => indicFinanceLocalApi.getPourcentageCommunesEfficienceRhPublic(params)
    );

    return {
        data: data || null,
        isLoading,
        isError: error,
        mutate
    };
};
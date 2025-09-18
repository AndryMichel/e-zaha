// indic-mobil-oddl.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {GetIndicateurParams} from "@/services/types/indic.type";

// Interface pour la réponse de l'API pour le pourcentage de communes mobilisant le secteur privé et les citoyens
export interface PourcentageCommunesMobilisationSecteurPriveCitoyensResponse {
    success: boolean[];
    data: {
        pourcentage_communes_mobilisation_secteur_prive: number[];
        total_communes: number[];
        communes_mobilisation_suffisante: number[];
        annee: number[];
    };
}

// Interface pour la réponse de l'API concernant le pourcentage de communes avec efficience RH ≥ 50%
export interface PourcentageCommunesEfficienceRhResponse {
    success: boolean[];
    data: {
        pourcentage_communes_efficience_rh_sup_50: number[];
        total_communes: number[];
        communes_efficience_rh_sup_50: number[];
        annee: number[];
    };
}

// Service API pour les indicateurs de Mobilisation et Ressources Humaines
export const indicMobilRhApi = {
    // Pourcentage de communes mobilisant le secteur privé et les citoyens
    getPourcentageCommunesMobilisationSecteurPrive: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesMobilisationSecteurPriveCitoyensResponse> => {
        return await apiClient.get<PourcentageCommunesMobilisationSecteurPriveCitoyensResponse>(
            "/api/indicateur-oddl/pourcentage-communes-mobilisation-secteur-prive-citoyens",
            params,
            token
        );
    },

    // Pourcentage de communes avec efficience RH ≥ 50%
    getPourcentageCommunesEfficienceRh: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesEfficienceRhResponse> => {
        return await apiClient.get<PourcentageCommunesEfficienceRhResponse>(
            "/api/indicateur-oddl/pourcentage-communes-efficience-rh-superieur-50",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des APIs

// Pourcentage de communes mobilisant le secteur privé et les citoyens
export const useGetPourcentageCommunesMobilisationSecteurPrive = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesMobilisationSecteurPriveCitoyensResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-mobilisation-secteur-prive-citoyens", params],
        (endpoint, token, params) => indicMobilRhApi.getPourcentageCommunesMobilisationSecteurPrive(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Pourcentage de communes avec efficience RH ≥ 50%
export const useGetPourcentageCommunesEfficienceRh = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesEfficienceRhResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-efficience-rh-superieur-50", params],
        (endpoint, token, params) => indicMobilRhApi.getPourcentageCommunesEfficienceRh(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
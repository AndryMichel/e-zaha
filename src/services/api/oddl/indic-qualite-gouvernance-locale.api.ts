// indic-qualite-gouvernance-locale.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import useSWR from "swr";
import {
    GetIndicateurParams,
    MoyenneNationaleNoteIglResponse,
    PourcentageCommunesIglEnLigneResponse,
    PourcentageCommunesIglSuperieur6Response,
    PourcentageCommunesPopulationSatisfaiteResponse,
    StatistiquesSatisfactionPopulationResponse
} from "@/services/types/indic.type";

// Service API pour les indicateurs ODDL
export const indicODDLApi = {
    // Qualité de la Gouvernance Locale - Avec Authentication
    getPourcentageCommunesIglSuperieur6: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesIglSuperieur6Response> => {
        return await apiClient.get<PourcentageCommunesIglSuperieur6Response>(
            "/api/indicateur-oddl/pourcentage-communes-igl-superieur-6",
            params,
            token
        );
    },

    getMoyenneNationaleNoteIgl: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<MoyenneNationaleNoteIglResponse> => {
        return await apiClient.get<MoyenneNationaleNoteIglResponse>(
            "/api/indicateur-oddl/moyenne-nationale-note-igl",
            params,
            token
        );
    },

    getPourcentageCommunesIglEnLigne: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesIglEnLigneResponse> => {
        return await apiClient.get<PourcentageCommunesIglEnLigneResponse>(
            "/api/indicateur-oddl/pourcentage-communes-igl-en-ligne",
            params,
            token
        );
    },

    getPourcentageCommunesPopulationSatisfaite: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesPopulationSatisfaiteResponse> => {
        return await apiClient.get<PourcentageCommunesPopulationSatisfaiteResponse>(
            "/api/indicateur-oddl/pourcentage-communes-population-satisfaite",
            params,
            token
        );
    },

    getStatistiquesSatisfactionPopulation: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<StatistiquesSatisfactionPopulationResponse> => {
        return await apiClient.get<StatistiquesSatisfactionPopulationResponse>(
            "/api/indicateur-oddl/statistiques-satisfaction-population",
            params,
            token
        );
    },

    // Qualité de la Gouvernance Locale - Méthodes Publiques (Sans Authentication)
    getPourcentageCommunesIglSuperieur6Public: async (
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesIglSuperieur6Response> => {
        return await apiClient.get<PourcentageCommunesIglSuperieur6Response>(
            "/api/indicateur-oddl/pourcentage-communes-igl-superieur-6",
            params
        );
    },

    getMoyenneNationaleNoteIglPublic: async (
        params?: GetIndicateurParams
    ): Promise<MoyenneNationaleNoteIglResponse> => {
        return await apiClient.get<MoyenneNationaleNoteIglResponse>(
            "/api/indicateur-oddl/moyenne-nationale-note-igl",
            params
        );
    },

    getPourcentageCommunesIglEnLignePublic: async (
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesIglEnLigneResponse> => {
        return await apiClient.get<PourcentageCommunesIglEnLigneResponse>(
            "/api/indicateur-oddl/pourcentage-communes-igl-en-ligne",
            params
        );
    },

    getPourcentageCommunesPopulationSatisfaitePublic: async (
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesPopulationSatisfaiteResponse> => {
        return await apiClient.get<PourcentageCommunesPopulationSatisfaiteResponse>(
            "/api/indicateur-oddl/pourcentage-communes-population-satisfaite",
            params
        );
    },

    getStatistiquesSatisfactionPopulationPublic: async (
        params?: GetIndicateurParams
    ): Promise<StatistiquesSatisfactionPopulationResponse> => {
        return await apiClient.get<StatistiquesSatisfactionPopulationResponse>(
            "/api/indicateur-oddl/statistiques-satisfaction-population",
            params
        );
    },

    // Les autres catégories seraient ajoutées ici de la même manière
};

// Hooks personnalisés pour faciliter l'utilisation des APIs avec authentification

// Qualité de la Gouvernance Locale
export const useGetPourcentageCommunesIglSuperieur6 = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesIglSuperieur6Response>(
        ["/api/indicateur-oddl/pourcentage-communes-igl-superieur-6", params],
        (endpoint, token, params) => indicODDLApi.getPourcentageCommunesIglSuperieur6(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetMoyenneNationaleNoteIgl = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<MoyenneNationaleNoteIglResponse>(
        ["/api/indicateur-oddl/moyenne-nationale-note-igl", params],
        (endpoint, token, params) => indicODDLApi.getMoyenneNationaleNoteIgl(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
//
// export const useGetPourcentageCommunesIglEnLigne = (params: GetIndicateurParams = {}) => {
//     const {
//         data,
//         error,
//         isLoading,
//         mutate,
//         isAuthenticated
//     } = useAuthenticatedSWR<PourcentageCommunesIglEnLigneResponse>(
//         ["/api/indicateur-oddl/pourcentage-communes-igl-en-ligne", params],
//         (endpoint, token, params) => indicODDLApi.getPourcentageCommunesIglEnLigne(token, params)
//     );
//
//     return {
//         data: data?.data || null,
//         isLoading,
//         isError: error,
//         mutate,
//         isAuthenticated
//     };
// };

export const useGetPourcentageCommunesPopulationSatisfaite = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesPopulationSatisfaiteResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-population-satisfaite", params],
        (endpoint, token, params) => indicODDLApi.getPourcentageCommunesPopulationSatisfaite(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetStatistiquesSatisfactionPopulation = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<StatistiquesSatisfactionPopulationResponse>(
        ["/api/indicateur-oddl/statistiques-satisfaction-population", params],
        (endpoint, token, params) => indicODDLApi.getStatistiquesSatisfactionPopulation(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hooks publics pour utiliser les APIs sans authentification

export const useGetPourcentageCommunesIglSuperieur6Public = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-oddl/pourcentage-communes-igl-superieur-6", params],
        () => indicODDLApi.getPourcentageCommunesIglSuperieur6Public(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

export const useGetMoyenneNationaleNoteIglPublic = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-oddl/moyenne-nationale-note-igl", params],
        () => indicODDLApi.getMoyenneNationaleNoteIglPublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

export const useGetPourcentageCommunesIglEnLignePublic = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-oddl/pourcentage-communes-igl-en-ligne", params],
        () => indicODDLApi.getPourcentageCommunesIglEnLignePublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

export const useGetPourcentageCommunesPopulationSatisfaitePublic = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-oddl/pourcentage-communes-population-satisfaite", params],
        () => indicODDLApi.getPourcentageCommunesPopulationSatisfaitePublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

export const useGetStatistiquesSatisfactionPopulationPublic = (params: GetIndicateurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-oddl/statistiques-satisfaction-population", params],
        () => indicODDLApi.getStatistiquesSatisfactionPopulationPublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};
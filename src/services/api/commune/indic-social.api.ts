import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurSocialParams,
    PourcentagesCommunesAccessiblesResponse,
    RatioCentreSanteResponse,
    RatioCollegesResponse,
    RatioEcolesPrimairesResponse,
    RatioLyceesResponse,
    TauxAccesEauPotableResponse,
    TauxAccesElectriciteResponse
} from "@/services/types/indic-social.type";

// Service API pour les indicateurs sociaux des communes
export const indicSocialCommuneApi = {
    // Ratio des centres de santé
    getRatioCentresSante: async (
        token: string,
        params?: GetIndicateurSocialParams
    ): Promise<RatioCentreSanteResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/ratio-centres-sante",
            params,
            token
        );
    },

    // Ratio des écoles primaires
    getRatioEcolesPrimaires: async (
        token: string,
        params?: GetIndicateurSocialParams
    ): Promise<RatioEcolesPrimairesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/ratio-ecoles-primaires",
            params,
            token
        );
    },

    // Ratio des collèges
    getRatioColleges: async (
        token: string,
        params?: GetIndicateurSocialParams
    ): Promise<RatioCollegesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/ratio-colleges",
            params,
            token
        );
    },

    // Ratio des lycées
    getRatioLycees: async (
        token: string,
        params?: GetIndicateurSocialParams
    ): Promise<RatioLyceesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/ratio-lycees",
            params,
            token
        );
    },

    // Taux d'accès à l'eau potable
    getTauxAccesEauPotable: async (
        token: string,
        params?: GetIndicateurSocialParams
    ): Promise<TauxAccesEauPotableResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/taux-acces-eau-potable",
            params,
            token
        );
    },// Taux d'accès à l'électricité
    getTauxAccesElectricite: async (
        token: string,
        params?: GetIndicateurSocialParams
    ): Promise<TauxAccesElectriciteResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune/taux-acces-electricite",
            params,
            token
        );
    },

// Pourcentage communes accessibles
    getPourcentagesCommunesAccessibles: async (
        token: string,
        params?: GetIndicateurSocialParams
    ): Promise<PourcentagesCommunesAccessiblesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/pourcentage-communes-accessibles",
            params,
            token
        );
    }


};

// Hooks personnalisés pour faciliter l'utilisation des API

// Hook pour le ratio des centres de santé
export const useGetRatioCentresSante = (params: GetIndicateurSocialParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/ratio-centres-sante", params],
        (endpoint, token, params) => indicSocialCommuneApi.getRatioCentresSante(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le ratio des écoles primaires
export const useGetRatioEcolesPrimaires = (params: GetIndicateurSocialParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/ratio-ecoles-primaires", params],
        (endpoint, token, params) => indicSocialCommuneApi.getRatioEcolesPrimaires(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le ratio des collèges
export const useGetRatioColleges = (params: GetIndicateurSocialParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/ratio-colleges", params],
        (endpoint, token, params) => indicSocialCommuneApi.getRatioColleges(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le ratio des lycées
export const useGetRatioLycees = (params: GetIndicateurSocialParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/ratio-lycees", params],
        (endpoint, token, params) => indicSocialCommuneApi.getRatioLycees(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le taux d'accès à l'eau potable
export const useGetTauxAccesEauPotable = (params: GetIndicateurSocialParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/taux-acces-eau-potable", params],
        (endpoint, token, params) => indicSocialCommuneApi.getTauxAccesEauPotable(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le taux d'accès à l'électricité
export const useGetTauxAccesElectricite = (params: GetIndicateurSocialParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune/taux-acces-electricite", params],
        (endpoint, token, params) => indicSocialCommuneApi.getTauxAccesElectricite(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le pourcentage de communes accessibles
export const useGetPourcentagesCommunesAccessibles = (params: GetIndicateurSocialParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-eco/pourcentage-communes-accessibles", params],
        (endpoint, token, params) => indicSocialCommuneApi.getPourcentagesCommunesAccessibles(token, params)
    );


    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
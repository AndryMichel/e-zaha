// indic-scoring-performance-admin.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurParams,
    PourcentageCommunesScoringCgfBplusResponse,
    PourcentageCommunesScoringEcBplusResponse,
    PourcentageCommunesScoringGrhBplusResponse,
    PourcentageCommunesScoringMocBplusResponse,
    PourcentageCommunesScoringMrBplusResponse
} from "@/services/types/indic.type";

// Service API pour les indicateurs de Scoring et Performance Administrative
export const indicScoringApi = {
    // Scoring MOC B+
    getPourcentageCommunesScoringMocBplus: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesScoringMocBplusResponse> => {
        return await apiClient.get<PourcentageCommunesScoringMocBplusResponse>(
            "/api/indicateur-oddl/pourcentage-communes-scoring-moc-bplus",
            params,
            token
        );
    },

    // Scoring MR B+
    getPourcentageCommunesScoringMrBplus: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesScoringMrBplusResponse> => {
        return await apiClient.get<PourcentageCommunesScoringMrBplusResponse>(
            "/api/indicateur-oddl/pourcentage-communes-scoring-mr-bplus",
            params,
            token
        );
    },

    // Scoring CGF B+
    getPourcentageCommunesScoringCgfBplus: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesScoringCgfBplusResponse> => {
        return await apiClient.get<PourcentageCommunesScoringCgfBplusResponse>(
            "/api/indicateur-oddl/pourcentage-communes-scoring-cgf-bplus",
            params,
            token
        );
    },

    // Scoring EC B+
    getPourcentageCommunesScoringEcBplus: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesScoringEcBplusResponse> => {
        return await apiClient.get<PourcentageCommunesScoringEcBplusResponse>(
            "/api/indicateur-oddl/pourcentage-communes-scoring-ec-bplus",
            params,
            token
        );
    },

    // Scoring GRH B+
    getPourcentageCommunesScoringGrhBplus: async (
        token: string,
        params?: GetIndicateurParams
    ): Promise<PourcentageCommunesScoringGrhBplusResponse> => {
        return await apiClient.get<PourcentageCommunesScoringGrhBplusResponse>(
            "/api/indicateur-oddl/pourcentage-communes-scoring-grh-bplus",
            params,
            token
        );
    },
};

// Hooks personnalisés pour faciliter l'utilisation des APIs

// Scoring MOC B+
export const useGetPourcentageCommunesScoringMocBplus = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesScoringMocBplusResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-scoring-moc-bplus", params],
        (endpoint, token, params) => indicScoringApi.getPourcentageCommunesScoringMocBplus(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Scoring MR B+
export const useGetPourcentageCommunesScoringMrBplus = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesScoringMrBplusResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-scoring-mr-bplus", params],
        (endpoint, token, params) => indicScoringApi.getPourcentageCommunesScoringMrBplus(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Scoring CGF B+
export const useGetPourcentageCommunesScoringCgfBplus = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesScoringCgfBplusResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-scoring-cgf-bplus", params],
        (endpoint, token, params) => indicScoringApi.getPourcentageCommunesScoringCgfBplus(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Scoring EC B+
export const useGetPourcentageCommunesScoringEcBplus = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesScoringEcBplusResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-scoring-ec-bplus", params],
        (endpoint, token, params) => indicScoringApi.getPourcentageCommunesScoringEcBplus(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Scoring GRH B+
export const useGetPourcentageCommunesScoringGrhBplus = (params: GetIndicateurParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<PourcentageCommunesScoringGrhBplusResponse>(
        ["/api/indicateur-oddl/pourcentage-communes-scoring-grh-bplus", params],
        (endpoint, token, params) => indicScoringApi.getPourcentageCommunesScoringGrhBplus(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
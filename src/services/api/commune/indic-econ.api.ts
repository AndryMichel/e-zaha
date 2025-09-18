import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    EffectifVisiteursTourismeResponse,
    GetIndicateurEcoParams,
    NombreCheptelsResponse,
    NombreMarchesResponse,
    PourcentageCommunesAbattoirsResponse,
    PourcentageCommunesBarragesResponse,
    PourcentageEntreprisesCommerceResponse,
    PourcentageEntreprisesExtractivesResponse,
    PourcentageEntreprisesIndustriellesResponse,
    ProductionPecheResponse,
    ProductionRizResponse,
    ProduitsAgricolesResponse
} from "@/services/types/indic-econ.type";

// Service API pour les indicateurs économiques des communes
export const indicEconomiqueCommuneApi = {
    // Effectif des visiteurs tourisme
    getEffectifVisiteursTourisme: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<EffectifVisiteursTourismeResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/effectif-visiteurs-tourisme",
            params,
            token
        );
    },

    // Pourcentage des entreprises industrielles
    getPourcentageEntreprisesIndustrielles: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<PourcentageEntreprisesIndustriellesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/pourcentage-entreprises-industrielles",
            params,
            token
        );
    },

    // Pourcentage des entreprises de commerce
    getPourcentageEntreprisesCommerce: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<PourcentageEntreprisesCommerceResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/pourcentage-entreprises-commerce",
            params,
            token
        );
    },

    // Nombre de marchés
    getNombreMarches: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<NombreMarchesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/nombre-marches",
            params,
            token
        );
    }
};

export const indicEconomiqueCommuneApiExtended = {
    // Pourcentage des entreprises extractives
    getPourcentageEntreprisesExtractives: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<PourcentageEntreprisesExtractivesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/pourcentage-entreprises-extractives",
            params,
            token
        );
    },

    // Pourcentage des communes avec barrages
    getPourcentageCommunesBarrages: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<PourcentageCommunesBarragesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/pourcentage-communes-barrages",
            params,
            token
        );
    },

    // Produits agricoles phares
    getProduitsAgricoles: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<ProduitsAgricolesResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/produits-agricoles-phares",
            params,
            token
        );
    },

    // Production de riz par hectare
    getProductionRiz: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<ProductionRizResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/production-riz-hectare",
            params,
            token
        );
    },

    // Production des produits de pêche
    getProductionPeche: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<ProductionPecheResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/production-produits-peche",
            params,
            token
        );
    },

    // Nombre de cheptels
    getNombreCheptels: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<NombreCheptelsResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/nombre-cheptels",
            params,
            token
        );
    },

    // Pourcentage des communes avec abattoirs
    getPourcentageCommunesAbattoirs: async (
        token: string,
        params?: GetIndicateurEcoParams
    ): Promise<PourcentageCommunesAbattoirsResponse> => {
        return await apiClient.get(
            "/api/indicateur-commune-eco/pourcentage-communes-abattoirs",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des API

// Hook pour l'effectif des visiteurs tourisme
export const useGetEffectifVisiteursTourisme = (params: GetIndicateurEcoParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-eco/effectif-visiteurs-tourisme", params],
        (endpoint, token, params) => indicEconomiqueCommuneApi.getEffectifVisiteursTourisme(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le pourcentage des entreprises industrielles
export const useGetPourcentageEntreprisesIndustrielles = (params: GetIndicateurEcoParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-eco/pourcentage-entreprises-industrielles", params],
        (endpoint, token, params) => indicEconomiqueCommuneApi.getPourcentageEntreprisesIndustrielles(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le pourcentage des entreprises de commerce
export const useGetPourcentageEntreprisesCommerce = (params: GetIndicateurEcoParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-eco/pourcentage-entreprises-commerce", params],
        (endpoint, token, params) => indicEconomiqueCommuneApi.getPourcentageEntreprisesCommerce(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le nombre de marchés
export const useGetNombreMarches = (params: GetIndicateurEcoParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        ["/api/indicateur-commune-eco/nombre-marches", params],
        (endpoint, token, params) => indicEconomiqueCommuneApi.getNombreMarches(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetPourcentageEntreprisesExtractives = (params?: GetIndicateurEcoParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-eco/pourcentage-entreprises-extractives", params] : null,
        (endpoint, token, params) => indicEconomiqueCommuneApiExtended.getPourcentageEntreprisesExtractives(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le pourcentage des communes avec barrages
export const useGetPourcentageCommunesBarrages = (params?: GetIndicateurEcoParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-eco/pourcentage-communes-barrages", params] : null,
        (endpoint, token, params) => indicEconomiqueCommuneApiExtended.getPourcentageCommunesBarrages(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour les produits agricoles phares
export const useGetProduitsAgricoles = (params?: GetIndicateurEcoParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-eco/produits-agricoles-phares", params] : null,
        (endpoint, token, params) => indicEconomiqueCommuneApiExtended.getProduitsAgricoles(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour la production de riz
export const useGetProductionRiz = (params?: GetIndicateurEcoParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-eco/production-riz-hectare", params] : null,
        (endpoint, token, params) => indicEconomiqueCommuneApiExtended.getProductionRiz(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour la production de pêche
export const useGetProductionPeche = (params?: GetIndicateurEcoParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-eco/production-produits-peche", params] : null,
        (endpoint, token, params) => indicEconomiqueCommuneApiExtended.getProductionPeche(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le nombre de cheptels
export const useGetNombreCheptels = (params?: GetIndicateurEcoParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-eco/nombre-cheptels", params] : null,
        (endpoint, token, params) => indicEconomiqueCommuneApiExtended.getNombreCheptels(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// Hook pour le pourcentage des communes avec abattoirs
export const useGetPourcentageCommunesAbattoirs = (params?: GetIndicateurEcoParams) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR(
        params ? ["/api/indicateur-commune-eco/pourcentage-communes-abattoirs", params] : null,
        (endpoint, token, params) => indicEconomiqueCommuneApiExtended.getPourcentageCommunesAbattoirs(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
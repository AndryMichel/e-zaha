import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurRegionParams,
    RegionBeneficiairesFiletResponse,
    RegionNombreEntrepriseResponse
} from "@/services/types/indic-region.type";

// Service API pour les indicateurs économiques régionaux
export const indicEconomieRegionApi = {
    // Nombre de bénéficiaires de filet de sécurité
    getNombreBeneficiairesFiletSecurite: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionBeneficiairesFiletResponse> => {
        return await apiClient.get<RegionBeneficiairesFiletResponse>(
            "/api/indicateur-region/nombre-beneficiaires-filet-securite",
            params,
            token
        );
    },

    // Nombre d'entreprises par région
    getNombreEntrepriseRegion: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionNombreEntrepriseResponse> => {
        return await apiClient.get<RegionNombreEntrepriseResponse>(
            "/api/indicateur-region/nombre-entreprise-region",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des APIs
export const useGetNombreBeneficiairesFiletSecurite = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionBeneficiairesFiletResponse>(
        ["/api/indicateur-region/nombre-beneficiaires-filet-securite", params],
        (endpoint, token, params) => indicEconomieRegionApi.getNombreBeneficiairesFiletSecurite(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetNombreEntrepriseRegion = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionNombreEntrepriseResponse>(
        ["/api/indicateur-region/nombre-entreprise-region", params],
        (endpoint, token, params) => indicEconomieRegionApi.getNombreEntrepriseRegion(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
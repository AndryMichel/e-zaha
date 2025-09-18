import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {GetIndicateurRegionParams, RegionCommuneOdfResponse} from "@/services/types/indic-region.type";

// Service API pour les indicateurs d'hygiène et assainissement régionaux
export const indicHygieneRegionApi = {
    // Nombre de communes ODF (Open Defecation Free)
    getNombreCommuneOdf: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionCommuneOdfResponse> => {
        return await apiClient.get<RegionCommuneOdfResponse>(
            "/api/indicateur-region/nombre-commune-odf",
            params,
            token
        );
    }
};

// Hook personnalisé pour faciliter l'utilisation de l'API
export const useGetNombreCommuneOdf = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionCommuneOdfResponse>(
        ["/api/indicateur-region/nombre-commune-odf", params],
        (endpoint, token, params) => indicHygieneRegionApi.getNombreCommuneOdf(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
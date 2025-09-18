import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    GetIndicateurRegionParams,
    RegionCertificatsFonciersResponse,
    RegionTitresCadastresResponse
} from "@/services/types/indic-region.type";

// Service API pour les indicateurs fonciers régionaux
export const indicFoncierRegionApi = {
    // Effectif des certificats fonciers distribués
    getEffectifCertificatsFonciers: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionCertificatsFonciersResponse> => {
        return await apiClient.get<RegionCertificatsFonciersResponse>(
            "/api/indicateur-region/effectif-certificats-fonciers-distribues",
            params,
            token
        );
    },

    // Effectif des titres cadastres distribués
    getEffectifTitresCadastres: async (
        token: string,
        params?: GetIndicateurRegionParams
    ): Promise<RegionTitresCadastresResponse> => {
        return await apiClient.get<RegionTitresCadastresResponse>(
            "/api/indicateur-region/effectif-titres-cadastres-distribues",
            params,
            token
        );
    }
};

// Hooks personnalisés pour faciliter l'utilisation des APIs
export const useGetEffectifCertificatsFonciers = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionCertificatsFonciersResponse>(
        ["/api/indicateur-region/effectif-certificats-fonciers-distribues", params],
        (endpoint, token, params) => indicFoncierRegionApi.getEffectifCertificatsFonciers(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

export const useGetEffectifTitresCadastres = (params: GetIndicateurRegionParams = {}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
        isAuthenticated
    } = useAuthenticatedSWR<RegionTitresCadastresResponse>(
        ["/api/indicateur-region/effectif-titres-cadastres-distribues", params],
        (endpoint, token, params) => indicFoncierRegionApi.getEffectifTitresCadastres(token, params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
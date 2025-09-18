import {apiClient} from "@/services/helpers/apiClient";
import useSWR from "swr";
import {GetIndicateurGouvernanceParams, GouvernanceCommuneResponse} from "@/services/types/indic-Gouv.type";
import {GetIndicateurRegionParams, RegionSrcOperationnelleResponse} from "@/services/types/indic-region.type";

// Service API pour les indicateurs de structures de concertation
export const indicStructureConcertationApi = {
    // API pour l'indicateur de SLC (Système Local de Coordination) au niveau commune - Sans Authentication (Public)
    getPourcentageCommunesSLCPublic: async (
        params?: GetIndicateurGouvernanceParams
    ): Promise<GouvernanceCommuneResponse> => {
        return await apiClient.get<GouvernanceCommuneResponse>(
            "/api/indicateur-commune-gouv/pourcentage-communes-slc",
            params
        );
    },

    // API pour l'indicateur de SRC (Système Régional de Coordination) opérationnel - Sans Authentication (Public)
    getPourcentageRegionsSrcOperationnellePublic: async (
        params?: GetIndicateurRegionParams
    ): Promise<RegionSrcOperationnelleResponse> => {
        return await apiClient.get<RegionSrcOperationnelleResponse>(
            "/api/indicateur-region/pourcentage-regions-src-operationnelle",
            params
        );
    }
};

// Hooks publics sans authentification pour les communes avec SLC
export const useGetPourcentageCommunesSLCPublic = (params: GetIndicateurGouvernanceParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-commune-gouv/pourcentage-communes-slc", params],
        () => indicStructureConcertationApi.getPourcentageCommunesSLCPublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

// Hooks publics sans authentification pour les régions avec SRC opérationnelle
export const useGetPourcentageRegionsSrcOperationnellePublic = (params: GetIndicateurRegionParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-region/pourcentage-regions-src-operationnelle", params],
        () => indicStructureConcertationApi.getPourcentageRegionsSrcOperationnellePublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};
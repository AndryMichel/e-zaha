import {apiClient} from "@/services/helpers/apiClient";
import useSWR from "swr";
import {GetIndicateurGouvernanceParams, GouvernanceCommuneResponse} from "@/services/types/indic-Gouv.type";
import {
    GetIndicateurRegionParams,
    RegionPrdAJourResponse,
    RegionSratClimatResponse
} from "@/services/types/indic-region.type";

// Service API pour les indicateurs de planification
export const indicPlanificationApi = {
    // API pour les indicateurs de planification communes - Sans Authentication (Public)
    getPourcentageCommunesPDLIIPublic: async (
        params?: GetIndicateurGouvernanceParams
    ): Promise<GouvernanceCommuneResponse> => {
        return await apiClient.get<GouvernanceCommuneResponse>(
            "/api/indicateur-commune-gouv/pourcentage-communes-pdlii",
            params
        );
    },

    getProportionCommunesSACPublic: async (
        params?: GetIndicateurGouvernanceParams
    ): Promise<GouvernanceCommuneResponse> => {
        return await apiClient.get<GouvernanceCommuneResponse>(
            "/api/indicateur-commune-gouv/proportion-communes-sac",
            params
        );
    },

    // API pour les indicateurs de planification régions - Sans Authentication (Public)
    getPourcentageRegionsSratClimatPublic: async (
        params?: GetIndicateurRegionParams
    ): Promise<RegionSratClimatResponse> => {
        return await apiClient.get<RegionSratClimatResponse>(
            "/api/indicateur-region/pourcentage-regions-srat-climat",
            params
        );
    },

    getPourcentageRegionsPrdAJourPublic: async (
        params?: GetIndicateurRegionParams
    ): Promise<RegionPrdAJourResponse> => {
        return await apiClient.get<RegionPrdAJourResponse>(
            "/api/indicateur-region/pourcentage-regions-prd-a-jour",
            params
        );
    }
};

// Hooks publics sans authentification pour les communes
export const useGetPourcentageCommunesPDLIIPublic = (params: GetIndicateurGouvernanceParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-commune-gouv/pourcentage-communes-pdlii", params],
        () => indicPlanificationApi.getPourcentageCommunesPDLIIPublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

export const useGetProportionCommunesSACPublic = (params: GetIndicateurGouvernanceParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-commune-gouv/proportion-communes-sac", params],
        () => indicPlanificationApi.getProportionCommunesSACPublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

// Hooks publics sans authentification pour les régions
export const useGetPourcentageRegionsSratClimatPublic = (params: GetIndicateurRegionParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-region/pourcentage-regions-srat-climat", params],
        () => indicPlanificationApi.getPourcentageRegionsSratClimatPublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};

export const useGetPourcentageRegionsPrdAJourPublic = (params: GetIndicateurRegionParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/indicateur-region/pourcentage-regions-prd-a-jour", params],
        () => indicPlanificationApi.getPourcentageRegionsPrdAJourPublic(params)
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error,
        mutate
    };
};
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";

// Types for the indregion API
export interface Region {
    region_code: string;
    region_name: string;
    status_base: boolean;
}

export interface GetAllRegionListParams extends Record<string, unknown> {
    search?: string;
    status_base?: boolean;
}

export interface GetAllRegionListResponse {
    success: boolean[];
    total_regions: number[];
    regions: Region[];
}

export const regionListApi = {
    getAllRegionList: async (
        token: string,
        params?: GetAllRegionListParams
    ): Promise<GetAllRegionListResponse> => {
        return await apiClient.get<GetAllRegionListResponse>(
            "/api/region-list/get-all-region-list",
            params,
            token
        );
    }
};

export const useGetAllRegionList = (params: GetAllRegionListParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllRegionListResponse>(
        ["/api/indregion-list/get-all-indregion-list", params],
        (endpoint, token, params) => regionListApi.getAllRegionList(token, params as Record<string, unknown>)
    );

    return {
        data: data?.regions || [],
        totalRegions: data?.total_regions?.[0] || 0,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};



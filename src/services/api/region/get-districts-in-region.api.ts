// services/api/region/get-districts-in-region.api.ts

import {apiClient} from '@/services/helpers/apiClient';
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';

export interface DistrictInRegion {
    district_code: string;
    district_name: string;
    region_code: string;
    region_name: string;
    status_base: boolean;
    commune_count: number;
    communes_actives: number;
    communes_inactives: number;
}

export interface GetDistrictsInRegionResponse {
    success: boolean;
    region_code: string;
    total_districts: number;
    page: number;
    total_pages: number;
    sort_by: string;
    sort_order: string;
    districts: DistrictInRegion[];
}

export interface DistrictsInRegionParams {
    region_code: string;
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
}

export const districtsInRegionApi = {
    getDistrictsInRegion: async (
        token: string,
        region_code: string,
        page = 1,
        limit = 50,
        search = "",
        sort_by = "district_name",
        sort_order = "asc"
    ): Promise<GetDistrictsInRegionResponse> => {
        return await apiClient.get<GetDistrictsInRegionResponse>(
            `/api/districts/get-districts-in-region`,
            {region_code, page, limit, search, sort_by, sort_order},
            token
        );
    }
};

export const useGetDistrictsInRegion = (
    region_code: string,
    page: number = 1,
    limit: number = 50,
    search: string = "",
    sort_by: string = "district_name",
    sort_order: string = "asc"
) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetDistrictsInRegionResponse>(
        [`/api/districts/get-districts-in-region`, {region_code, page, limit, search, sort_by, sort_order}],
        (endpoint, token, params?: Record<string, unknown>) => districtsInRegionApi.getDistrictsInRegion(
            token,
            (params?.region_code as string) || region_code,
            (params?.page as number) || page,
            (params?.limit as number) || limit,
            (params?.search as string) || search,
            (params?.sort_by as string) || sort_by,
            (params?.sort_order as string) || sort_order
        )
    );

    return {
        districts: data?.districts || [],
        total: data?.total_districts || 0,
        currentPage: data?.page || 1,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
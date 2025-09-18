// services/api/region/get-all-regions-summary.api.ts

import {apiClient} from '@/services/helpers/apiClient';
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';

export interface RegionSummary {
    region_code: string;
    region_name: string;
    district_count: number;
    commune_count: number;
    communes_actives: number;
    communes_inactives: number;
    utilisateurs_count: number;
}

export interface GetAllRegionsSummaryResponse {
    success: boolean;
    total_regions: number;
    page: number;
    total_pages: number;
    sort_by: string;
    sort_order: string;
    regions: RegionSummary[];
}

export interface AllRegionsSummaryParams {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
}

export const allRegionsSummaryApi = {
    getAllRegionsSummary: async (
        token: string,
        page = 1,
        limit = 50,
        search = "",
        sort_by = "region_name",
        sort_order = "asc"
    ): Promise<GetAllRegionsSummaryResponse> => {
        return await apiClient.get<GetAllRegionsSummaryResponse>(
            `/api/regions-summary/get-all-regions-summary`,
            {page, limit, search, sort_by, sort_order},
            token
        );
    }
};

export const useGetAllRegionsSummary = (
    page: number = 1,
    limit: number = 50,
    search: string = "",
    sort_by: string = "region_name",
    sort_order: string = "asc"
) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllRegionsSummaryResponse>(
        [`/api/regions-summary/get-all-regions-summary`, {page, limit, search, sort_by, sort_order}],
        (endpoint, token, params?: AllRegionsSummaryParams) => allRegionsSummaryApi.getAllRegionsSummary(
            token,
            params?.page || page,
            params?.limit || limit,
            params?.search || search,
            params?.sort_by || sort_by,
            params?.sort_order || sort_order
        )
    );

    return {
        regions: data?.regions || [],
        total: data?.total_regions || 0,
        currentPage: data?.page || 1,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
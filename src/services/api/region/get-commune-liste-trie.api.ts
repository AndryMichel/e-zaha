import {apiClient} from '@/services/helpers/apiClient';
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';

export interface CommuneInRegion {
    commune_code: string;
    commune_name: string;
    district_code: string;
    district_name: string;
    region_code: string;
    region_name: string;
    utilisateur: string;
    status_base: boolean;
}

export interface GetCommuneInRegionResponse {
    success: boolean;
    region_code: string;
    total_communes: number;
    page: number;
    total_pages: number;
    communes: CommuneInRegion[];
}

export interface CommuneInRegionParams {
    region_code?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export const communeInRegionApi = {
    getCommuneInRegion: async (
        token: string,
        region_code: string,
        page = 1,
        limit = 10,
        search = ""
    ): Promise<GetCommuneInRegionResponse> => {
        return await apiClient.get<GetCommuneInRegionResponse>(
            `/api/region/get-communes-liste-trie`,
            {region_code, page, limit, search},
            token
        );
    }
};

export const useGetCommuneInRegion = (
    region_code: string,
    page: number = 1,
    limit: number = 10,
    search: string = ""
) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetCommuneInRegionResponse>(
        [`/api/region/get-communes-liste-trie`, {region_code, page, limit, search}],
        (endpoint, token, params?: CommuneInRegionParams) => communeInRegionApi.getCommuneInRegion(
            token,
            params?.region_code || region_code,
            params?.page || page,
            params?.limit || limit,
            params?.search || search
        )
    );

    return {
        communes: data?.communes || [],
        total: data?.total_communes || 0,
        currentPage: data?.page || 1,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
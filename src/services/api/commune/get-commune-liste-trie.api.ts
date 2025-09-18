import {apiClient} from '@/services/helpers/apiClient';
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';

export interface CommuneInDistrict {
    commune_code: string;
    commune_name: string;
    district_code: string;
    district_name: string;
    region_code: string;
    region_name: string;
    utilisateur: string;
    status_base: boolean;
}

export interface GetCommuneInDistrictResponse {
    success: boolean[];
    district_code: string[];
    region_code: string[];
    total_communes: number[];
    page: number[];
    total_pages: number[];
    sort_by: string[];
    sort_order: string[];
    communes: CommuneInDistrict[];
}

export interface CommuneInDistrictParams {
    district_code?: string;
    region_code?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
}

export const communeInDistrictApi = {
    getCommuneInDistrict: async (
        token: string,
        district_code: string,
        page = 1,
        limit = 10,
        search = "",
        sort_by = "commune_name",
        sort_order = "asc",
        region_code = ""
    ): Promise<GetCommuneInDistrictResponse> => {
        return await apiClient.get<GetCommuneInDistrictResponse>(
            `/api/region/get-communes-liste-trie`,
            {district_code, region_code, page, limit, search, sort_by, sort_order},
            token
        );
    }
};

export const useGetCommuneInDistrict = (
    district_code: string,
    page: number = 1,
    limit: number = 10,
    search: string = "",
    sort_by: string = "commune_name",
    sort_order: string = "asc",
    region_code: string = ""
) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetCommuneInDistrictResponse>(
        [`/api/region/get-communes-liste-trie`, {district_code, region_code, page, limit, search, sort_by, sort_order}],
        (endpoint, token, params?: CommuneInDistrictParams) => communeInDistrictApi.getCommuneInDistrict(
            token,
            params?.district_code || district_code,
            params?.page || page,
            params?.limit || limit,
            params?.search || search,
            params?.sort_by || sort_by,
            params?.sort_order || sort_order,
            params?.region_code || region_code
        )
    );

    return {
        communes: data?.communes || [],
        total: data?.total_communes?.[0] || 0,
        currentPage: data?.page?.[0] || 1,
        totalPages: data?.total_pages?.[0] || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
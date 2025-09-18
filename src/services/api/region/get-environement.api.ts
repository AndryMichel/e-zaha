import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';

export interface GetEnvironnementResponse {
    success: boolean;
    data: {
        pourcentage_regions_grc: number;
        ratio_grc_par_communes: number;
        regions_avec_grc: number;
        total_regions: number;
        total_communes: number;
    };
}

export const environnementApi = {
    getEnvironnement: async (token: string): Promise<GetEnvironnementResponse> => {
        return await apiClient.get<GetEnvironnementResponse>(
            "/api/region-envi/get-environnement",
            {},
            token
        );
    },
};

export const useGetEnvironnement = () => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetEnvironnementResponse>(
        ["/api/indregion-envi/get-environnement", {}],
        (endpoint, token) => environnementApi.getEnvironnement(token)
    );

    return {
        environnement: data?.data,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated,
    };
};
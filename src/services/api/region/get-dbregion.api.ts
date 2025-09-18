import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    DeleteRegionResponse,
    GetAllRegionsParams,
    GetAllRegionsResponse,
    Region,
    UpdateRegionResponse
} from "@/services/types/dbregion.type";

export const dbregionApi = {
    /**
     * Récupère toutes les régions avec pagination et filtres optionnels
     * @param token - Le token d'authentification
     * @param params - Les paramètres de requête (pagination, filtres)
     */
    getAllRegions: async (
        token: string,
        params?: GetAllRegionsParams
    ): Promise<GetAllRegionsResponse> => {
        return await apiClient.get<GetAllRegionsResponse>(
            "/api/regiondb/get-dbregion",
            params,
            token
        );
    },

    /**
     * Met à jour les informations d'une région
     * @param id - L'ID de la région à mettre à jour
     * @param data - Les données de mise à jour
     * @param token - Le token d'authentification
     */
    updateRegion: async (id: number, data: Partial<Region>, token: string): Promise<UpdateRegionResponse> => {
        return await apiClient.put<UpdateRegionResponse>(
            `/api/region-update/update-dbregion`,
            {id: id.toString()},
            data,
            token
        );
    },

    /**
     * Supprime une région par son ID
     * @param id - L'ID de la région à supprimer
     * @param token - Le token d'authentification
     */
    deleteRegion: async (id: number, token: string): Promise<DeleteRegionResponse> => {
        return await apiClient.delete<DeleteRegionResponse>(
            `/api/region-delete/delete-dbregion/${id}`,
            undefined,
            token
        );
    }
};

/**
 * Hook pour récupérer toutes les régions avec SWR
 * @param params - Les paramètres optionnels pour la pagination et les filtres
 */
export const useGetAllRegions = (params: GetAllRegionsParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllRegionsResponse>(
        ["/api/regiondb/get-dbregion", params],
        (endpoint, token, params) => dbregionApi.getAllRegions(token, params)
    );

    return {
        data: data?.data || [],
        page: data?.page || 1,
        total: data?.total || 0,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
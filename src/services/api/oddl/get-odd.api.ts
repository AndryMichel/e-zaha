// src/services/api/oddl/get-odd.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    DeleteOddlResponse,
    GetAllOddlParams,
    GetAllOddlResponse,
    Oddl,
    UpdateOddlResponse
} from "@/services/types/oddO.type";

export const oddlApi = {
    getAllOddl: async (
        token: string,
        params?: GetAllOddlParams
    ): Promise<GetAllOddlResponse> => {
        return await apiClient.get<GetAllOddlResponse>(
            "/api/oddldb/get-oddl-localisation",
            params,
            token
        );
    },

    /**
     * Met à jour les informations d'un ODDL
     * @param id - L'ID de l'ODDL à mettre à jour
     * @param data - Les données de mise à jour
     * @param token - Le token d'authentification
     */
    updateOddl: async (id: number, data: Partial<Oddl>, token: string): Promise<UpdateOddlResponse> => {
        return await apiClient.put<UpdateOddlResponse>(
            `/api/oddl-update/update-oddl`,
            {id: id.toString()},
            data,
            token
        );
    },

    /**
     * Supprime un ODDL par son ID
     * @param id - L'ID de l'ODDL à supprimer
     * @param token - Le token d'authentification
     */
    deleteOddl: async (id: number, token: string): Promise<DeleteOddlResponse> => {
        return await apiClient.delete<DeleteOddlResponse>(
            `/api/oddl-delete/delete-oddl/${id}`,
            undefined,
            token
        );
    }
};

export const useGetAllOddl = (params: GetAllOddlParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllOddlResponse>(
        ["/api/oddldb/get-oddl-localisation", params],
        (endpoint, token, params) => oddlApi.getAllOddl(token, params)
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
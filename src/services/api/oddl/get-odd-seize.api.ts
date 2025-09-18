import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    DeleteOddSeizeResponse,
    GetAllOddSeizeParams,
    GetAllOddSeizeResponse,
    OddSeize,
    UpdateOddSeizeResponse
} from "@/services/types/odd-seize.type";

export const oddSeizeApi = {
    /**
     * Récupère tous les indicateurs ODD 16
     * @param token - Le token d'authentification
     * @param params - Les paramètres de pagination et filtres
     */
    getAllOddSeize: async (
        token: string,
        params?: GetAllOddSeizeParams
    ): Promise<GetAllOddSeizeResponse> => {
        return await apiClient.get<GetAllOddSeizeResponse>(
            "/api/oddseize/get-odd16",
            params,
            token
        );
    },


    /**
     * Met à jour les informations d'un indicateur ODD 16
     * @param id - L'ID de l'indicateur à mettre à jour
     * @param data - Les données de mise à jour
     * @param token - Le token d'authentification
     */
    updateOddSeize: async (id: string, data: Partial<OddSeize>, token: string): Promise<UpdateOddSeizeResponse> => {
        return await apiClient.put<UpdateOddSeizeResponse>(
            `/api/oddseize-update/update-odd16`,
            {id: id.toString()},
            data,
            token
        );
    },

    /**
     * Supprime un indicateur ODD 16 par son ID
     * @param id - L'ID de l'indicateur à supprimer
     * @param token - Le token d'authentification
     */
    deleteOddSeize: async (id: string, token: string): Promise<DeleteOddSeizeResponse> => {
        return await apiClient.delete<DeleteOddSeizeResponse>(
            `/api/oddseize-delete/delete-odd16/${id}`,
            undefined,
            token
        );
    }
};

export const useGetAllOddSeize = (params: GetAllOddSeizeParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllOddSeizeResponse>(
        ["/api/oddseize/get-odd16", params],
        (endpoint, token, params) => oddSeizeApi.getAllOddSeize(token, params)
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
export const updateOddSeize = oddSeizeApi.updateOddSeize;
export const deleteOddSeize = oddSeizeApi.deleteOddSeize;
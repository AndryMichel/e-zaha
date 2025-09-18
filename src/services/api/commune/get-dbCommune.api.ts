//services/api/commune/get-dbCommune.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import {
    Commune,
    DeleteCommuneResponse,
    GetAllDbCommuneParams,
    GetAllDbCommuneResponse,
    UpdateCommuneResponse
} from "@/services/types/dbcommune.type";


export const dbCommuneApi = {
    getAll: async (
        token: string,
        params?: GetAllDbCommuneParams
    ): Promise<GetAllDbCommuneResponse> => {
        return await apiClient.get<GetAllDbCommuneResponse>(
            "/api/get-commune/get-dbcommune",
            params,
            token
        );
    }
};

export const useGetAllDbCommune = (params: GetAllDbCommuneParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllDbCommuneResponse>(
        ["/api/get-commune/get-dbcommune", params],
        (endpoint, token, params) => dbCommuneApi.getAll(token, params)
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


/**
 * Supprime une commune par son ID
 * @param id - L'ID de la commune à supprimer
 * @param token - Le token d'authentification
 */
export const deleteCommune = async (id: number, token: string): Promise<DeleteCommuneResponse> => {
    return await apiClient.delete<DeleteCommuneResponse>(
        `/api/delete-commune/delete-dbcommune/${id}`,
        undefined,
        token
    );
};

/**
 * Met à jour les informations d'une commune
 * @param id - L'ID de la commune à mettre à jour
 * @param data - Les données de mise à jour
 * @param token - Le token d'authentification
 */
export const updateCommune = async (id: number, data: Partial<Commune>, token: string): Promise<UpdateCommuneResponse> => {
    return await apiClient.put<UpdateCommuneResponse>(
        `/api/update-commune/update-commune?id=${id}`,
        undefined,
        data,
        token
    );
};
//get-all-user.api.ts
import {apiClient} from '@/services/helpers/apiClient';
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';
import {DeleteUserResponse, GetAllUsersParams, GetAllUsersResponse} from "@/services/types/all-user.type";

// API functions
export const userApi = {
    getAllUsers: async (
        token: string,
        params?: GetAllUsersParams
    ): Promise<GetAllUsersResponse> => {
        return await apiClient.get<GetAllUsersResponse>(
            "/api/alluser/get-users",
            params,
            token
        );
    },

    /**
     * Supprime un utilisateur par son ID
     * @param id - L'ID de l'utilisateur à supprimer (admin_id)
     * @param token - Le token d'authentification
     */
    deleteUser: async (id: string, token: string): Promise<DeleteUserResponse> => {
        return await apiClient.delete<DeleteUserResponse>(
            `/api/deleteuser/delete-user/${id}`,
            undefined,
            token
        );
    }
};

// Hook qui utilise notre helper SWR
export const useGetAllUsers = (params: GetAllUsersParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllUsersResponse>(
        ["/api/alluser/get-users", params],
        (endpoint, token, params) => userApi.getAllUsers(token, params)
    );

    return {
        users: data?.users || [],
        page: data?.page || 1,
        total: data?.total || 0,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
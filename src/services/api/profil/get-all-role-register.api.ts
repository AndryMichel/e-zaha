// src/services/api/profil/get-all-role-register.api.ts

import {apiClient} from '@/services/helpers/apiClient';
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';
import {
    GetAllRoleRegisterParams,
    GetAllRoleRegisterResponse,
    UpdateStatusResponse
} from "@/services/types/all-role-register.type";

// API functions
export const roleRegisterApi = {
    getAllRoleRegister: async (
        token: string,
        params?: GetAllRoleRegisterParams
    ): Promise<GetAllRoleRegisterResponse> => {
        return await apiClient.get<GetAllRoleRegisterResponse>(
            "/api/roleRegister/get-roles",
            params,
            token
        );
    },

    // Fonction pour exporter les données au format XLSX,csv,json si le backend le supporte
    exportData: async (
        token: string,
        params?: Omit<GetAllRoleRegisterParams, 'limit' | 'page'>
    ): Promise<Blob> => {
        return await apiClient.getBlob(
            "/api/roleRegister/get-roles",
            params,
            token
        );
    },

    /**
     * Met à jour le statut d'un utilisateur register_users
     * @param user_id - L'ID de l'utilisateur à mettre à jour
     * @param status - Le nouveau statut (true pour actif, false pour inactif)
     * @param token - Le token d'authentification
     */
    updateStatus: async (
        user_id: string,
        status: boolean,
        token: string
    ): Promise<UpdateStatusResponse> => {
        return await apiClient.put<UpdateStatusResponse>(
            "/api/update-status-role/update-status",
            {
                user_id: user_id,
                status: status
            },
            undefined,
            token
        );
    },
};

// Hook qui utilise notre helper SWR
export const useGetAllRoleRegister = (params: GetAllRoleRegisterParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllRoleRegisterResponse>(
        ["/api/roleRegister/get-roles", params],
        (endpoint, token, params) => roleRegisterApi.getAllRoleRegister(token, params)
    );

    return {
        roles: data?.roles || [],
        page: data?.page || 1,
        total: data?.total || 0,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};
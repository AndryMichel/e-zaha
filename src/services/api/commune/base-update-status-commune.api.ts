import {apiClient} from "@/services/helpers/apiClient";

interface UpdateBaseStatusResponse {
    success: boolean[];
    message: string[];
}

export const baseStatusApi = {
    /**
     * Met à jour le statut de base d'une commune
     * @param communeCode - Le code de la commune à mettre à jour
     * @param status - Le nouveau statut (true/false)
     * @param token - Le token d'authentification
     */
    updateBaseStatus: async (
        communeCode: string,
        status: boolean,
        token: string
    ): Promise<UpdateBaseStatusResponse> => {
        return await apiClient.put<UpdateBaseStatusResponse>(
            `/api/status/update-base-status-commune`,
            {commune_code: communeCode, status: status},
            undefined,
            token
        );
    }
};

export const updateBaseStatus = baseStatusApi.updateBaseStatus;
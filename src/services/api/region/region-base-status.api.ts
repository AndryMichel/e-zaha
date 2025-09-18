import {apiClient} from "@/services/helpers/apiClient";

interface UpdateRegionBaseStatusResponse {
    success: boolean[];
    message: string[];
}

export const regionBaseStatusApi = {
    /**
     * Met à jour le statut de base d'une région
     * @param regionCode - Le code de la région à mettre à jour
     * @param status - Le nouveau statut (true/false)
     * @param token - Le token d'authentification
     */
    updateRegionBaseStatus: async (
        regionCode: string,
        status: boolean,
        token: string
    ): Promise<UpdateRegionBaseStatusResponse> => {
        return await apiClient.put<UpdateRegionBaseStatusResponse>(
            `/api/region-status/update-base-status-region`,
            {region_code: regionCode, status: status},
            undefined,
            token
        );
    }
};

export const updateRegionBaseStatus = regionBaseStatusApi.updateRegionBaseStatus;
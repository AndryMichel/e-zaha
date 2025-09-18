import {apiClient} from "@/services/helpers/apiClient";

interface UpdateDistrictBaseStatusResponse {
    success: boolean[];
    message: string[];
}

export const districtBaseStatusApi = {
    /**
     * Met à jour le statut de base d'un district
     * @param districtCode - Le code du district à mettre à jour
     * @param status - Le nouveau statut (true/false)
     * @param token - Le token d'authentification
     */
    updateDistrictBaseStatus: async (
        districtCode: string,
        status: boolean,
        token: string
    ): Promise<UpdateDistrictBaseStatusResponse> => {
        return await apiClient.put<UpdateDistrictBaseStatusResponse>(
            `/api/district-status/update-base-status-district`,
            {district_code: districtCode, status: status},
            undefined,
            token
        );
    }
};

export const updateDistrictBaseStatus = districtBaseStatusApi.updateDistrictBaseStatus;
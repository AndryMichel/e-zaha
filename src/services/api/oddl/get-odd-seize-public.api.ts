import {apiClient} from "@/services/helpers/apiClient";
import {GetAllOddSeizeParams, GetAllOddSeizeResponse} from "@/services/types/odd-seize.type";

export const oddSeizePublicApi = {
    /**
     * Récupère tous les indicateurs ODD 16 pour le public (sans authentification)
     * @param params - Les paramètres de pagination et filtres
     */
    getAllOddSeizePublic: async (
        params?: GetAllOddSeizeParams
    ): Promise<GetAllOddSeizeResponse> => {
        return await apiClient.get<GetAllOddSeizeResponse>(
            "/api/oddseizepublic/get-oddpublic",
            params
        );
    },

    /**
     * Exporte les données ODD 16 publiques au format souhaité (XLSX, CSV, JSON)
     * @param params - Les paramètres de filtrage (sans pagination)
     */
    exportData: async (
        params?: Omit<GetAllOddSeizeParams, 'limit' | 'page'>
    ): Promise<Blob> => {
        return await apiClient.getBlob(
            "/api/oddseizepublic/get-oddpublic",
            params
        );
    }
};
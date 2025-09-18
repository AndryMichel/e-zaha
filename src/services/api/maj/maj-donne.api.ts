// src/services/api/migration/maj-donne-api.ts
import {apiClient} from "@/services/helpers/apiClient";

export interface MigrationResponse {
    success: boolean[];
    message: string[];
    details: {
        odd16?: {
            success: boolean[];
            message: string[];
        };
        ooddl?: {
            success: boolean[];
            message: string[];
        };
        regions?: {
            success: boolean[];
            message: string[];
        };
        [key: string]: {
            success: boolean[];
            message: string[];
        } | undefined;
    };
}

export const migrationApi = {
    executeMigration: async (authToken: string): Promise<MigrationResponse> => {
        // Passer le token d'authentification à l'appel API
        return await apiClient.post<MigrationResponse>('/api/migration/execute', undefined, undefined, authToken);
    }
};
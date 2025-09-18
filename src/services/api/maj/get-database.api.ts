import {API_URL} from "@/services/helpers/constant-api";

// Types pour les paramètres de filtrage
interface ExportFilters {
    // Filtres manuels spécifiques
    filterByCodeCommune?: string;
    filterByCodeDistrict?: string;
    filterByCodeRegion?: string;
    search?: string;

    // Informations utilisateur pour filtrage automatique
    userRole?: string;
    userCommuneCode?: string;
    userDistrictCode?: string;
    userRegionCode?: string;
}

export const databaseExportApi = {
    /**
     * Exporte les données ODD16 au format CSV ou XLSX
     * @param token - Le token d'authentification
     * @param format - Le format d'exportation (csv ou xlsx, défaut: csv)
     * @returns Un Blob contenant les données exportées
     */
    exportOdd16Data: async (token: string, format: "csv" | "xlsx" = "csv"): Promise<Blob> => {
        const response = await fetch(
            `${API_URL}/api/exportseize/export-odd16?format=${format}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'exportation des données ODD16");
        }

        return await response.blob();
    },

    /**
     * Exporte les données de communes au format CSV ou XLSX avec filtrage par rôle
     * @param token - Le token d'authentification
     * @param format - Le format d'exportation (csv ou xlsx, défaut: csv)
     * @param filters - Filtres de recherche et informations utilisateur
     * @returns Un Blob contenant les données exportées
     */
    exportCommuneData: async (
        token: string,
        format: "csv" | "xlsx" = "csv",
        filters: ExportFilters = {}
    ): Promise<Blob> => {
        // Construction des paramètres de requête
        const params = new URLSearchParams();
        params.append("format", format);

        // Filtres manuels spécifiques
        if (filters.filterByCodeCommune) params.append("filter_by_code_commune", filters.filterByCodeCommune);
        if (filters.filterByCodeDistrict) params.append("filter_by_code_district", filters.filterByCodeDistrict);
        if (filters.filterByCodeRegion) params.append("filter_by_code_region", filters.filterByCodeRegion);
        if (filters.search) params.append("search", filters.search);

        // Informations utilisateur pour filtrage automatique
        if (filters.userRole) params.append("user_role", filters.userRole);
        if (filters.userCommuneCode) params.append("user_commune_code", filters.userCommuneCode);
        if (filters.userDistrictCode) params.append("user_district_code", filters.userDistrictCode);
        if (filters.userRegionCode) params.append("user_region_code", filters.userRegionCode);

        const response = await fetch(
            `${API_URL}/api/exportcommune/export-commune?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'exportation des données de communes");
        }

        return await response.blob();
    },

    /**
     * Exporte les données de régions au format CSV ou XLSX avec filtrage par rôle
     * @param token - Le token d'authentification
     * @param format - Le format d'exportation (csv ou xlsx, défaut: csv)
     * @param filters - Filtres de recherche et informations utilisateur
     * @returns Un Blob contenant les données exportées
     */
    exportRegionData: async (
        token: string,
        format: "csv" | "xlsx" = "csv",
        filters: ExportFilters = {}
    ): Promise<Blob> => {
        // Construction des paramètres de requête
        const params = new URLSearchParams();
        params.append("format", format);

        // Filtres manuels spécifiques
        if (filters.filterByCodeRegion) params.append("filter_by_code_region", filters.filterByCodeRegion);
        if (filters.search) params.append("search", filters.search);

        // Informations utilisateur pour filtrage automatique
        if (filters.userRole) params.append("user_role", filters.userRole);
        if (filters.userRegionCode) params.append("user_region_code", filters.userRegionCode);

        const response = await fetch(
            `${API_URL}/api/exportregion/export-region?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'exportation des données de régions");
        }

        return await response.blob();
    },

    /**
     * Exporte les données ODDL au format CSV ou XLSX
     * @param token - Le token d'authentification
     * @param format - Le format d'exportation (csv ou xlsx, défaut: csv)
     * @returns Un Blob contenant les données exportées
     */
    exportOddlData: async (token: string, format: "csv" | "xlsx" = "csv"): Promise<Blob> => {
        const response = await fetch(
            `${API_URL}/api/exportoddl/export-oddl?format=${format}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'exportation des données ODDL");
        }

        return await response.blob();
    }
};
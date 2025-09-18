// services/api/dashboard/get-dashboard-summary.api.ts

import {apiClient} from '@/services/helpers/apiClient';
import {useAuthenticatedSWR} from '@/services/helpers/swrHelper';

// ===== INTERFACES =====

export interface AdminRoleStats {
    role: string;
    count: number;
}

export interface GeneralStats {
    regions: number;
    regions_verifiees: number;
    districts: number;
    districts_verifies: number;
    communes: number;
    communes_verifiees: number;
    communes_non_verifiees: number;
    taux_verification_communes: number;
}

export interface AdminStats {
    total: number;
    hommes: number;
    femmes: number;
    repartition_par_role: AdminRoleStats[];
}

export interface ODDStats {
    objectifs_atteints: number;
    objectifs_total: number;
    pourcentage_completion: number;
}

export interface CommuneParRegion {
    region_code: string;
    region_name: string;
    nombre_communes: number;
    communes_verifiees: number;
}

export interface EvolutionAdmin {
    mois: string;
    nouvelles_inscriptions: number;
    role: string;
}

export interface ChartsData {
    communes_par_region: CommuneParRegion[];
    evolution_admin: EvolutionAdmin[];
    admin_par_role: AdminRoleStats[];
}

export interface GetDashboardSummaryResponse {
    success: boolean;
    last_updated: string;
    general_stats: GeneralStats;
    admin_stats: AdminStats;
    odd_stats: ODDStats;
    charts_data: ChartsData;
}

// Type pour les valeurs formatables
type FormatableValue = number | string | number[] | string[] | null | undefined;

// ===== API SERVICE =====

export const dashboardApi = {
    getDashboardSummary: async (token: string): Promise<GetDashboardSummaryResponse> => {
        return await apiClient.get<GetDashboardSummaryResponse>(
            `/api/dashboard/get-dashboard-summary`,
            {},
            token
        );
    }
};

// ===== HOOK SWR =====

export const useGetDashboardSummary = () => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetDashboardSummaryResponse>(
        ['/api/dashboard/get-dashboard-summary', {}],
        (endpoint, token) => dashboardApi.getDashboardSummary(token)
    );

    return {
        // Données principales
        dashboardData: data || null,
        generalStats: data?.general_stats || null,
        adminStats: data?.admin_stats || null,
        oddStats: data?.odd_stats || null,
        chartsData: data?.charts_data || null,
        lastUpdated: data?.last_updated || null,

        // États
        isLoading,
        isError: error,
        isAuthenticated,

        // Actions
        mutate,
        refetch: () => mutate()
    };
};

// ===== UTILITAIRES =====

/**
 * Formate les pourcentages pour l'affichage
 */
export function formatPercentage(value: FormatableValue): string {
    try {
        // Conversion robuste en nombre
        let numValue: number;

        if (typeof value === 'number') {
            numValue = value;
        } else if (typeof value === 'string') {
            numValue = parseFloat(value);
        } else if (Array.isArray(value) && value.length > 0) {
            // Cas spécial pour les tableaux R qui retournent parfois [valeur]
            numValue = typeof value[0] === 'number' ? value[0] : parseFloat(value[0]);
        } else {
            numValue = 0;
        }

        // Vérification finale
        if (isNaN(numValue) || !isFinite(numValue)) {
            return '0.0%';
        }

        return `${Number(numValue).toFixed(1)}%`;
    } catch (error) {
        console.warn('Erreur formatPercentage:', value, error);
        return '0.0%';
    }
}

/**
 * Formate les nombres avec séparateurs de milliers
 */
export function formatNumber(value: FormatableValue): string {
    try {
        // Conversion robuste en nombre
        let numValue: number;

        if (typeof value === 'number') {
            numValue = value;
        } else if (typeof value === 'string') {
            numValue = parseFloat(value);
        } else if (Array.isArray(value) && value.length > 0) {
            // Cas spécial pour les tableaux R qui retournent parfois [valeur]
            numValue = typeof value[0] === 'number' ? value[0] : parseFloat(value[0]);
        } else {
            numValue = 0;
        }

        // Vérification finale
        if (isNaN(numValue) || !isFinite(numValue)) {
            return '0';
        }

        return Number(numValue).toLocaleString('fr-FR');
    } catch (error) {
        console.warn('Erreur formatNumber:', value, error);
        return '0';
    }
}

/**
 * Traduit les rôles admin en français
 */
export function translateRole(role: string): string {
    const translations: Record<string, string> = {
        'ADMIN': 'Administrateur',
        'REGION_MANAGER': 'Gestionnaire Région',
        'DISTRICT_MANAGER': 'Gestionnaire District',
        'COMMUNE_MANAGER': 'Gestionnaire Commune',
        'ODDL_MANAGER': 'Gestionnaire ODDL',
        'USER': 'Utilisateur'
    };

    return translations[role] || role.replace('_', ' ');
}


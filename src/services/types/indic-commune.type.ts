// @/services/types/indic-commune.type
// Parameter types for commune queries
export interface GetIndicateurCommuneParams extends Record<string, unknown> {
    annee?: number;
    commune_code?: string;
    region_code?: string;
    province_code?: string;
    district_code?: string; // Ajout du support pour les districts
}

// Base response interface for commune indicators
export interface BaseCommuneResponse {
    success: boolean[];
    data: {
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // Ajout du support pour les districts
    }
}

// Specific interface for population data by commune
export interface EffectifPopulationCommuneResponse extends BaseCommuneResponse {
    data: {
        communes?: CommunePopulationData[];
        summary?: {
            total_population: number[];
            total_hommes: number[];
            total_femmes: number[];
            total_moins_5_ans: number[];
            total_6_17_ans: number[];
            total_18_60_ans: number[];
            total_60_plus: number[];
            total_handicap: number[];
            nombre_communes: number[];
        };
        status_base_stats?: {
            total_communes_registered: number[];
            communes_base_completed: number[];
            completion_rate: number[];
        };
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // Ajout du support pour les districts
        message?: string;
    }
}

// Type for commune population data
export interface CommunePopulationData {
    commune_code: string;
    commune: string;
    district: string;
    region: string;
    province: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    population: {
        total: number;
        hommes: number;
        femmes: number;
        moins_5_ans: number;
        ans_6_17: number;
        ans_18_60: number;
        plus_60_ans: number;
        handicap: number;
    };
    status_base: boolean;
    annee: number;
}
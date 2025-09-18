// @/services/types/indic-envi.type.ts
import {BaseCommuneResponse} from './indic-commune.type';

// Interface for GRC data by commune
export interface GRCCommuneData {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    a_grc_operationnel: boolean[];
    coordinates: {
        latitude: number[] | Record<string, never>;
        longitude: number[] | Record<string, never>;
    };
    annee: number[];
}

// Interface for Conservation Environment data by commune
export interface ConservationCommuneData {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    a_actions_conservation: boolean[];
    details_actions: {
        realisation_filtrations: boolean[];
        realisation_protection: boolean[];
    };
    coordinates: {
        latitude: number[] | Record<string, never>;
        longitude: number[] | Record<string, never>;
    };
    annee: number[];
}

// Response interface for GRC data
export interface GRCCommuneResponse extends BaseCommuneResponse {
    data: {
        communes?: GRCCommuneData[];
        summary?: {
            nombre_communes_total: number[];
            nombre_communes_avec_grc: number[];
            pourcentage_communes_grc: number[];
        };
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
    }
}

// Response interface for Conservation Environment data
export interface ConservationCommuneResponse extends BaseCommuneResponse {
    data: {
        communes?: ConservationCommuneData[];
        summary?: {
            nombre_communes_total: number[];
            nombre_communes_avec_actions_conservation: number[];
            pourcentage_communes_conservation: number[];
        };
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
    }
}

// Combined type for environmental data
export type EnvironmentalData = {
    grc?: GRCCommuneResponse['data'];
    conservation?: ConservationCommuneResponse['data'];
}
// Types pour les indicateurs de gouvernance communale - MISE À JOUR avec support district

export interface CommuneGouvernanceData {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    dispose_slc?: boolean[];
    dispose_sac?: boolean[];
    dispose_pdlii?: boolean[];
    coordinates: {
        latitude: number[] | Record<string, never>;
        longitude: number[] | Record<string, never>;
    };
    annee: number[];
}

export interface GouvernanceSummary {
    nombre_communes_total: number[];
    nombre_communes_avec_slc?: number[];
    pourcentage_communes_slc?: number[];
    nombre_communes_avec_sac?: number[];
    proportion_communes_sac?: number[];
    nombre_communes_avec_pdlii?: number[];
    pourcentage_communes_pdlii?: number[];
    effectif_communes_pdlii_a_jour?: number[];
    effectif_total_communes_pdlii?: number[];
    effectif_communes_sac?: number[];
    effectif_total_communes?: number[];
}

// ✅ AJOUT DU SUPPORT DISTRICT
export interface GetIndicateurGouvernanceParams extends Record<string, unknown> {
    annee?: number;
    commune_code?: string;
    region_code?: string;
    province_code?: string;
    district_code?: string; // 🆕 Support pour le filtrage par district
}

export interface GouvernanceCommuneResponse {
    success: boolean[];
    data: {
        communes: CommuneGouvernanceData[];
        summary: GouvernanceSummary;
        annee: number[];
        province_code?: string[];
        region_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district dans la réponse
    };
}

// Ajouts pour les nouveaux indicateurs de gouvernance

// Type pour pourcentage-communes-bif
export interface PourcentageCommunesBIFResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            a_bif_fonctionnel: boolean[];
            date_ouverture: string[] | null[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            details_bif: {
                effectif_demande: number[];
                effectif_titres: number[];
                effectif_certificats: number[];
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_bif: number[];
            pourcentage_communes_bif: number[];
            details_globaux: {
                total_demandes: number[];
                total_titres: number[];
                total_certificats: number[];
            };
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// Type pour pourcentage-communes-actes-administratifs
export interface PourcentageCommunesActesResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            soumis_actes: boolean[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_actes: number[];
            pourcentage_communes_actes: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// Mise à jour du type CommuneGouvernanceData pour inclure les nouveaux champs
export interface CommuneGouvernanceDataExtended {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    dispose_slc?: boolean[];
    dispose_sac?: boolean[];
    dispose_pdlii?: boolean[];
    a_bif_fonctionnel?: boolean[];
    soumis_actes?: boolean[];
    coordinates: {
        latitude: number[] | Record<string, never>;
        longitude: number[] | Record<string, never>;
    };
    annee: number[];
}

// Mise à jour du type GouvernanceSummary pour inclure les nouveaux indicateurs
export interface GouvernanceSummaryExtended {
    nombre_communes_total: number[];
    nombre_communes_avec_slc?: number[];
    pourcentage_communes_slc?: number[];
    nombre_communes_avec_sac?: number[];
    proportion_communes_sac?: number[];
    nombre_communes_avec_pdlii?: number[];
    pourcentage_communes_pdlii?: number[];
    nombre_communes_avec_bif?: number[];
    pourcentage_communes_bif?: number[];
    nombre_communes_avec_actes?: number[];
    pourcentage_communes_actes?: number[];
}
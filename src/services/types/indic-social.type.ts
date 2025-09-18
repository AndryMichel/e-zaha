// @/services/types/indic-social.type - MISE À JOUR avec support district

// ✅ AJOUT DU SUPPORT DISTRICT
// Paramètres communs pour les requêtes d'indicateurs
export interface GetIndicateurSocialParams extends Record<string, unknown> {
    annee?: number;
    commune_code?: string;
    region_code?: string;
    province_code?: string;
    district_code?: string; // 🆕 Support pour le filtrage par district
}

// Structure commune pour les coordonnées
interface Coordinates {
    latitude: number[] | Record<string, never>;
    longitude: number[] | Record<string, never>;
}

// ✅ MISE À JOUR: Base commune pour tous les types de réponse
interface BaseResponseData {
    success: boolean[];
    data: {
        communes: unknown[];
        summary?: unknown;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district dans la réponse
    };
}

// Centre de santé
export interface CentreSanteCommune {
    commune_code: string;
    commune: string;
    district: string;
    region: string;
    province: string;
    population: number;
    coordinates: Coordinates;
    centres_sante: {
        csb1?: number;
        csb2?: number;
        chrd?: number;
        chrr?: number;
        chu?: number;
    };
    annee: number;
}

export interface CentreSanteSummary {
    total_population: number[];
    total_centres_sante: number[];
    total_csb1: number[];
    total_csb2: number[];
    total_chrd: number[];
    total_chrr: number[];
    total_chu: number[];
    ratio_centres_sante_pour_10000: number[];
    nombre_communes: number[];
}

export interface RatioCentreSanteResponse extends BaseResponseData {
    data: {
        communes: CentreSanteCommune[];
        summary?: CentreSanteSummary;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// École primaire
export interface EcolePrimaireCommune {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    enfants_scolarisables: number[] | "NA"[];
    coordinates: Coordinates;
    ecoles_primaires: {
        total: number[] | "NA"[];
        publiques: number[] | "NA"[];
        privees: number[] | "NA"[];
    };
    eleves_inscrits: number[] | "NA"[];
    ratio_ecoles_pour_1000_enfants: number[] | "NA"[];
    annee: number[];
}

export interface EcolePrimaireSummary {
    total_enfants_scolarisables: number[];
    total_ecoles_primaires: number[];
    total_ecoles_publiques: number[];
    total_ecoles_privees: number[];
    total_eleves_inscrits: number[];
    ratio_ecoles_pour_1000_enfants: number[];
    nombre_communes: number[];
}

export interface RatioEcolesPrimairesResponse extends BaseResponseData {
    data: {
        communes: EcolePrimaireCommune[];
        summary?: EcolePrimaireSummary;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// Collège
export interface CollegeCommune {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    enfants_scolarisables: number[];
    coordinates: Coordinates;
    colleges: {
        total: number[] | "NA"[];
        publics: number[] | "NA"[];
        prives: number[] | "NA"[];
    };
    eleves_inscrits: number[] | "NA"[];
    ratio_colleges_pour_1000_enfants: number[] | "NA"[];
    annee: number[];
}

export interface CollegeSummary {
    total_enfants_scolarisables: number[];
    total_colleges: number[];
    total_colleges_publics: number[];
    total_colleges_prives: number[];
    total_eleves_inscrits: number[];
    ratio_colleges_pour_1000_enfants: number[];
    nombre_communes: number[];
}

export interface RatioCollegesResponse extends BaseResponseData {
    data: {
        communes: CollegeCommune[];
        summary?: CollegeSummary;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// Lycée
export interface LyceeCommune {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    enfants_scolarisables: number[];
    coordinates: Coordinates;
    lycees: {
        total: "NA"[] | number[];
        publics: "NA"[] | number[];
        prives: "NA"[] | number[];
    };
    eleves_inscrits: "NA"[] | number[];
    ratio_lycees_pour_1000_enfants: "NA"[] | number[];
    annee: number[];
}

export interface LyceeSummary {
    total_enfants_scolarisables: number[];
    total_lycees: number[];
    total_lycees_publics: number[];
    total_lycees_prives: number[];
    total_eleves_inscrits: number[];
    ratio_lycees_pour_1000_enfants: number[];
    nombre_communes: number[];
}

export interface RatioLyceesResponse extends BaseResponseData {
    data: {
        communes: LyceeCommune[];
        summary?: LyceeSummary;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// Accès à l'eau potable
export interface EauPotableCommune {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    total_menages: number[];
    menages_acces_eau_potable: "NA"[] | number[];
    coordinates: Coordinates;
    details_acces: {
        borne_fontaine: "NA"[] | number[];
        forage: "NA"[] | number[];
        branchement_particulier: "NA"[] | number[];
    };
    autres_sources: {
        puits: "NA"[] | number[];
        eau_surface: "NA"[] | number[];
    };
    taux_acces_eau_potable: "NA"[] | number[];
    annee: number[];
}

export interface EauPotableSummary {
    total_menages: number[];
    total_menages_acces_eau_potable: number[];
    details_acces: {
        total_borne_fontaine: number[];
        total_forage: number[];
        total_branchement_particulier: number[];
    };
    autres_sources: {
        total_puits: number[];
        total_eau_surface: number[];
    };
    taux_acces_eau_potable: number[];
    nombre_communes: number[];
}

export interface TauxAccesEauPotableResponse extends BaseResponseData {
    data: {
        communes: EauPotableCommune[];
        summary?: EauPotableSummary;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// Types pour l'électricité
export interface ElectriciteCommune {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    total_menages: number[];
    menages_acces_electricite: number[];
    coordinates: Coordinates;
    details_acces: {
        reseau_electrique: number[];
        groupe_electrogene: number[];
    };
    autres_sources: {
        panneau_solaire: number[];
        petrole_lampant: number[];
        autre_source: number[];
    };
    taux_acces_electricite: number[];
    annee: number[];
}

export interface ElectriciteSummary {
    total_menages: number[];
    total_menages_acces_electricite: number[];
    details_acces: {
        total_reseau_electrique: number[];
        total_groupe_electrogene: number[];
    };
    autres_sources: {
        total_panneau_solaire: number[];
        total_petrole_lampant: number[];
        total_autre_source: number[];
    };
    taux_acces_electricite: number[];
    nombre_communes: number[];
}

export interface TauxAccesElectriciteResponse extends BaseResponseData {
    data: {
        communes: ElectriciteCommune[];
        summary?: ElectriciteSummary;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}

// Types pour l'accessibilité
export interface AccessibiliteCommune {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    accessible_toute_annee: boolean[];
    coordinates: Coordinates;
    annee: number[];
}

export interface AccessibiliteSummary {
    nombre_communes_total: number[];
    nombre_communes_accessibles: number[];
    pourcentage_communes_accessibles: number[];
    repartition_par_province: Array<{
        province: string;
        nombre_communes: number;
        communes_accessibles: number;
        pourcentage: number;
    }>;
    repartition_par_region: Array<{
        region: string;
        nombre_communes: number;
        communes_accessibles: number;
        pourcentage: number;
    }>;
    repartition_par_district: Array<{
        district: string;
        nombre_communes: number;
        communes_accessibles: number;
        pourcentage: number;
    }>;
}

export interface PourcentagesCommunesAccessiblesResponse extends BaseResponseData {
    data: {
        communes: AccessibiliteCommune[];
        summary?: AccessibiliteSummary;
        annee?: number[];
        commune_code?: string[];
        region_code?: string[];
        province_code?: string[];
        district_code?: string[]; // 🆕 Support pour le district
    };
}
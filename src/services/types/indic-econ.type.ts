// Types pour les paramètres de requête API
export interface GetIndicateurEcoParams extends Record<string, unknown> {
    annee?: number;
    commune_code?: string;
    region_code?: string;
    province_code?: string;
    district_code?: string;
}

// Types pour les réponses des différentes API économiques

// Type pour effectif-visiteurs-tourisme
export interface EffectifVisiteursTourismeResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_tourisme: boolean[];
            nombre_visiteurs: number[];
            type_service_tourisme: string[] | null[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_tourisme: number[];
            total_visiteurs: number[];
            moyenne_visiteurs_par_commune: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour pourcentage-entreprises-industrielles
export interface PourcentageEntreprisesIndustriellesResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_industrie: boolean[];
            effectif_entreprises_industrie: number[];
            total_entreprises: number[];
            pourcentage_entreprises_industrie: number[];
            details: {
                type_produit_phare: string[] | null[];
                quantites_produites: string[] | null[];
                observation: string[] | null[];
            };
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_industrie: number[];
            total_entreprises_industrie: number[];
            total_toutes_entreprises: number[];
            pourcentage_moyen_entreprises_industrie: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour pourcentage-entreprises-commerce
export interface PourcentageEntreprisesCommerceResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_commerce: boolean[];
            effectif_entreprises_commerce: number[];
            total_entreprises: number[];
            pourcentage_entreprises_commerce: number[];
            details: {
                type_produit_phare: string[] | null[];
                observation: string[] | null[];
            };
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_commerce: number[];
            total_entreprises_commerce: number[];
            total_toutes_entreprises: number[];
            pourcentage_moyen_entreprises_commerce: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour nombre-marches
export interface NombreMarchesResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_marche: boolean[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_marche: number[];
            pourcentage_communes_avec_marche: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

export interface CommuneBase {
    commune_code: string[];
    commune: string[];
    district: string[];
    region: string[];
    province: string[];
    coordinates: {
        latitude: number[] | Record<string, never>;
        longitude: number[] | Record<string, never>;
    };
    annee: number[];
}

// Ajouts pour les nouveaux indicateurs économiques

// Type pour pourcentage-entreprises-extractives
export interface PourcentageEntreprisesExtractivesResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_exploitation_miniere: boolean[];
            effectif_entreprises_exploitation_miniere: number[];
            total_entreprises: number[];
            pourcentage_entreprises_extractives: number[];
            details: {
                type_produit_phare: string[] | null[];
                observation: string[] | null[];
            };
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_exploitation: number[];
            total_entreprises_extractives: number[];
            total_toutes_entreprises: number[];
            pourcentage_moyen_entreprises_extractives: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour pourcentage-communes-barrages
export interface PourcentageCommunesBarragesResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_barrage: boolean[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_barrage: number[];
            pourcentage_communes_avec_barrage: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour produits-agricoles-phares
export interface ProduitsAgricolesResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_agriculture: boolean[];
            produit_phare: string[] | null[];
            quantite_produite: string[] | null[];
            details: {
                observation: string[] | null[];
            };
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number[];
            nombre_communes_avec_agriculture: number[];
            pourcentage_communes_avec_agriculture: number[];
            total_effectif_personnes_agriculture: number[];
            produits_phares: Array<{
                produit: string;
                nombre_communes: number;
            }>;
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour production-riz-hectare
export interface ProductionRizResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_agriculture: boolean[];
            produit: string[];
            production_par_hectare: number[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_productrices_riz: number[];
            production_moyenne_tonnes_par_hectare: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour production-produits-peche
export interface ProductionPecheResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_peche: boolean[];
            produit_phare: string[] | null[];
            quantite_produite: number[];
            observation: string[] | null[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_avec_peche: number[];
            pourcentage_communes_avec_peche: number[];
            produits_phares: Array<{
                produit: string;
                nombre_communes: number;
            }>;
            production_moyenne_tonnes: number[];
            production_totale_tonnes: number[];
            total_effectif_personnes_peche: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour nombre-cheptels
export interface NombreCheptelsResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_elevage: boolean[];
            produit_phare: string[] | null[];
            nombre_cheptels: number[];
            observation: string[] | null[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_avec_elevage: number[];
            pourcentage_communes_avec_elevage: number[];
            types_cheptels: Array<{
                type_cheptel: string;
                nombre_communes: number;
                nombre_total: number;
                nombre_moyen_par_commune: number;
            }>;
            nombre_moyen_cheptels_par_commune: number[];
            nombre_total_cheptels: number[];
        };
        province_code?: string[];
        region_code?: string[];
        commune_code?: string[];
    };
}

// Type pour pourcentage-communes-abattoirs
export interface PourcentageCommunesAbattoirsResponse {
    success: boolean[];
    data: {
        communes: Array<{
            commune_code: string[];
            commune: string[];
            district: string[];
            region: string[];
            province: string[];
            dispose_abattoirs: boolean[];
            dispose_elevage: boolean[];
            coordinates: {
                latitude: number[] | Record<string, never>;
                longitude: number[] | Record<string, never>;
            };
            annee: number[];
        }>;
        summary: {
            nombre_communes_total: number;
            nombre_communes_avec_abattoirs: number;
            pourcentage_communes_avec_abattoirs: number[];
            nombre_communes_avec_elevage: number;
            pourcentage_communes_elevage_avec_abattoirs: number[];
            repartition_par_province: Array<{
                province: string;
                nombre_communes: number;
                communes_avec_abattoirs: number;
                pourcentage: number;
            }>;
            repartition_par_region: Array<{
                region: string;
                nombre_communes: number;
                communes_avec_abattoirs: number;
                pourcentage: number;
            }>;
        };
        province_code?: string[];
        region_code?: string[];
    };
}
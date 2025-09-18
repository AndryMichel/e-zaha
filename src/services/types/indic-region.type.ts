// indic-region.type.ts

// Regional parameter type extension with region_code
export interface GetIndicateurParams extends Record<string, unknown> {
    annee?: number;
}

export interface GetIndicateurRegionParams extends GetIndicateurParams {
    region_code?: string;
}

// Base response interface for all region indicators
export interface BaseRegionResponse {
    success: boolean[];
    data: {
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface for Regions with Risk Management System
export interface RegionGestionRisquesResponse extends BaseRegionResponse {
    data: {
        pourcentage_regions_avec_grc: number[];
        total_regions: number[];
        regions_avec_grc: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface for Regions with Operational SRC
export interface RegionSrcOperationnelleResponse extends BaseRegionResponse {
    data: {
        pourcentage_regions_avec_src: number[];
        total_regions: number[];
        regions_avec_src: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface for Regions with Climate-integrated SRAT
export interface RegionSratClimatResponse extends BaseRegionResponse {
    data: {
        pourcentage_regions_srat_climat: number[];
        total_regions: number[];
        regions_srat_a_jour: number[];
        regions_srat_climat: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface for Regions with Updated PRD
export interface RegionPrdAJourResponse extends BaseRegionResponse {
    data: {
        pourcentage_regions_prd_a_jour: number[];
        total_regions: number[];
        regions_prd_a_jour: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface for Regions with Platform Access
export interface RegionAccesPlateformeResponse extends BaseRegionResponse {
    data: {
        pourcentage_regions_acces_plateforme: number[];
        total_regions: number[];
        regions_acces_plateforme: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface for Regions with Budget Presentation
export interface RegionPresentationBudgetResponse extends BaseRegionResponse {
    data: {
        pourcentage_regions_presentation_budget: number[];
        total_regions: number[];
        regions_presentation_budget: number[];
        annee: number[];
        region_code?: string[];
    }
}


// Extensions pour indic-region.type.ts - Ajoutez ces interfaces au fichier existant

// Interface pour le taux d'accès à l'eau de base
export interface RegionAccesEauResponse extends BaseRegionResponse {
    data: {
        taux_moyen_acces_eau: number[];
        taux_min_acces_eau: number[];
        taux_max_acces_eau: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour le taux d'accès à l'assainissement de base
export interface RegionAccesAssainissementResponse extends BaseRegionResponse {
    data: {
        taux_moyen_acces_assainissement: number[];
        taux_min_acces_assainissement: number[];
        taux_max_acces_assainissement: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour le taux d'accès à l'électricité
export interface RegionAccesElectriciteResponse extends BaseRegionResponse {
    data: {
        taux_moyen_acces_electricite: number[];
        taux_min_acces_electricite: number[];
        taux_max_acces_electricite: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}


// Interface pour le nombre de communes ODF (Open Defecation Free)
export interface RegionCommuneOdfResponse extends BaseRegionResponse {
    data: {
        total_communes_odf: number[];
        moyenne_communes_odf_par_region: number[];
        min_communes_odf: number[];
        max_communes_odf: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}


// Interface pour le taux brut de scolarisation au primaire
export interface RegionTauxScolarisationPrimaireResponse extends BaseRegionResponse {
    data: {
        taux_moyen_scolarisation_primaire: number[];
        taux_min_scolarisation_primaire: number[];
        taux_max_scolarisation_primaire: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour le taux d'abandon scolaire au primaire
export interface RegionTauxAbandonScolairePrimaireResponse extends BaseRegionResponse {
    data: {
        taux_moyen_abandon_scolaire: number[];
        taux_min_abandon: number[];
        taux_max_abandon: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}


// Interface pour le ratio formations sanitaires fonctionnelles/population
export interface RegionRatioFsPopulationResponse extends BaseRegionResponse {
    data: {
        ratio_moyen_fs_population: number[];
        ratio_min: number[];
        ratio_max: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour le ratio personnel de santé/population
export interface RegionRatioPersonnelSanteResponse extends BaseRegionResponse {
    data: {
        ratio_moyen_personnel_sante: number[];
        ratio_min: number[];
        ratio_max: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour le taux de malnutrition aiguë
export interface RegionTauxMalnutritionResponse extends BaseRegionResponse {
    data: {
        taux_moyen_malnutrition: number[];
        taux_min: number[];
        taux_max: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour le taux d'insécurité alimentaire
export interface RegionTauxInsecuriteAlimentaireResponse extends BaseRegionResponse {
    data: {
        taux_moyen_insecurite_alimentaire: number[];
        taux_min: number[];
        taux_max: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}


// Interface pour le nombre de bénéficiaires de filet de sécurité
export interface RegionBeneficiairesFiletResponse extends BaseRegionResponse {
    data: {
        total_beneficiaires: number[];
        moyenne_beneficiaires_par_region: number[];
        min_beneficiaires: number[];
        max_beneficiaires: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour le nombre d'entreprises par région
export interface RegionNombreEntrepriseResponse extends BaseRegionResponse {
    data: {
        total_regions: number[];
        total_entreprises: number[];
        moyenne_entreprises_par_region: number[];
        nombre_regions: number[];
        details_par_region: {
            region: string[];
            nombre_entreprises: number[];
            annee: string[];
        }[];
        annee: number[];
        region_code?: string[];
    }
}


// Interface pour les certificats fonciers distribués
export interface RegionCertificatsFonciersResponse extends BaseRegionResponse {
    data: {
        total_certificats_fonciers: number[];
        moyenne_certificats_fonciers_par_region: number[];
        min_certificats_fonciers: number[];
        max_certificats_fonciers: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}

// Interface pour les titres cadastres distribués
export interface RegionTitresCadastresResponse extends BaseRegionResponse {
    data: {
        total_titres_cadastres: number[];
        moyenne_titres_cadastres_par_region: number[];
        min_titres_cadastres: number[];
        max_titres_cadastres: number[];
        total_regions: number[];
        annee: number[];
        region_code?: string[];
    }
}
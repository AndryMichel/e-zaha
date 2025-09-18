// src/features/dbregion/dbregion.type.ts

export interface GouvernanceRegion {
    src_operationnelle: boolean;
    srat_a_jour: boolean;
    volet_changement_climatique: boolean;
    prd_a_jour: boolean;
    acces_plateforme_web: boolean;
    etat_realisation_budget: string;
}

export interface EnvironnementRegion {
    structure_gestion_risques: boolean;
}

export interface StaffRegion {
    gouverneur_nom: string;
    gouverneur_sexe: string;
    gouverneur_telephone: string;
    gouverneur_statut_emploi: string;
    gouverneur_niveau_instruction: string;
    gouverneur_diplome: string;
    gouverneur_statut: boolean;
    secretaire_nom: string;
    secretaire_sexe: string;
    secretaire_telephone: string;
    secretaire_statut_emploi: string;
    secretaire_niveau_instruction: string;
    secretaire_diplome: string;
    secretaire_statut: boolean;
    directeur_cabinet_nom: string;
    directeur_cabinet_sexe: string;
    directeur_cabinet_telephone: string;
    directeur_cabinet_statut_emploi: string;
    directeur_cabinet_niveau_instruction: string;
    directeur_cabinet_diplome: string;
    directeur_cabinet_statut: boolean;
    daf_nom: string;
    daf_sexe: string;
    daf_telephone: string;
    daf_statut_emploi: string;
    daf_niveau_instruction: string;
    daf_diplome: string;
    daf_statut: boolean;
    directeur_admin_nom: string;
    directeur_admin_sexe: string;
    directeur_admin_telephone: string;
    directeur_admin_statut_emploi: string;
    directeur_admin_niveau_instruction: string;
    directeur_admin_diplome: string;
    directeur_admin_statut: boolean;
    directeur_infra_nom: string;
    directeur_infra_sexe: string;
    directeur_infra_telephone: string;
    directeur_infra_statut_emploi: string;
    directeur_infra_niveau_instruction: string;
    directeur_infra_diplome: string;
    directeur_infra_statut: boolean;
}

export interface StaffCrocRegion {
    documentaliste_nom: string;
    documentaliste_sexe: string;
    documentaliste_telephone: string;
    documentaliste_statut_emploi: string;
    documentaliste_niveau_instruction: string;
    documentaliste_diplome: string;
    documentaliste_statut: boolean;
    responsable_bdd_nom: string;
    responsable_bdd_sexe: string;
    responsable_bdd_telephone: string;
    responsable_bdd_statut_emploi: string;
    responsable_bdd_niveau_instruction: string;
    responsable_bdd_diplome: string;
    responsable_bdd_statut: boolean;
    responsable_comm_nom: string;
    responsable_comm_sexe: string;
    responsable_comm_telephone: string;
    responsable_comm_statut_emploi: string;
    responsable_comm_niveau_instruction: string;
    responsable_comm_diplome: string;
    responsable_comm_statut: boolean;
    responsable_se_nom: string;
    responsable_se_sexe: string;
    responsable_se_telephone: string;
    responsable_se_statut_emploi: string;
    responsable_se_niveau_instruction: string;
    responsable_se_diplome: string;
    responsable_se_statut: boolean;
}

export interface IndicateursSectoriels {
    taux_acces_eau_base: number;
    taux_acces_assainissement_base: number;
    nombre_commune_odf: number;
    taux_acces_electricite: number;
    effectif_certificats_fonciers_distribues: number;
    effectif_titres_cadastres_distribues: number;
    taux_brut_scolarisation_primaire: number;
    taux_abandon_scolaire_primaire: number;
    ratio_fs_fonctionnel_population: number;
    ratio_personnel_sante_population: number;
    taux_malnutrition_aigue: number;
    taux_insecurite_alimentaire: number;
    nombre_beneficiaire_filet_securite_sociale: number;
    culture_phare: boolean;
    culture_phare_details: string;
    rendement_culture_ha: number;
    elevage_phare: boolean;
    elevage_phare_details: string;
    nombre_tete_elevage: number;
    produit_halieutique_phare: boolean;
    produit_halieutique_details: string;
    production_halieutique_tonnes: number;
    nombre_entreprises_region: number;
}

export interface Region {
    id_situation_geographique: number;
    num_region?: string;
    region_nom: string;
    region_situee_nord: string;
    region_situee_sud: string;
    region_situee_ouest: string;
    region_situee_est: string;
    effectif_commune: number;
    effectif_district: number;
    superficie_region_km2: number;
    gouvernance_region: GouvernanceRegion;
    environnement_region: EnvironnementRegion;
    staff_region: StaffRegion;
    staff_croc_region: StaffCrocRegion;
    indicateurs_sectoriels: IndicateursSectoriels;
}

export interface GetAllRegionsResponse {
    success?: boolean;
    data: Region[];
    total: number;
    page: number;
    total_pages: number;
}

export interface GetAllRegionsParams extends Record<string, unknown> {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}

// Réponse pour la mise à jour d'une région
export interface UpdateRegionResponse {
    success: boolean;
    message: string;
    data?: Region;
}

// Réponse pour la suppression d'une région
export interface DeleteRegionResponse {
    success: boolean;
    message: string;
}

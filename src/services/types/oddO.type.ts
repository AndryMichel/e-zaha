// Fichier oddO.type.ts entièrement mis à jour avec tous les champs de gouvernance_commune
// src/services/types/oddO.type.ts

export interface Oddl {
    id_localisation: number;
    province: string;
    region: string;
    district: string;
    commune: string;
    categorie_commune: string;

    gouvernance_commune: {
        id_gouvernance_commune: number;
        evaluation_externe: boolean;
        notes_igl: number;
        notes_pillier_a: number;
        notes_pillier_b: number;
        notes_pillier_c: number;
        notes_pillier_d: number;
        notes_scoring_moc: number;
        notes_scoring_mr: number;
        notes_scoring_cgf: number;
        scoring_ec: number;
        scoring_grh: number;
        niveau_satisfaction_population_public_services: string;
        montant_recettes_budgetaires_propres: number;
        montant_realisation_recettes_propres: number;

        montant_prevision_recettes_propres: number;

        montant_recettes_previsionnelles_fonctionnements: number;
        montant_realisation_recettes_fonctionnement: number;
        montant_depenses_reelles_investissements: number;
        montant_depenses_previsionnelles_investissements: number;
        montant_realisation_recettes_fiscales: number;
        montant_prevision_recettes_fiscales: number;
        montant_realisation_recettes_non_fiscales: number;
        montant_depenses_reelles_fonctionnements: number;
        montant_realisation_depenses_fonctionnement: number;
        montant_realisation_prevision_depenses_fonctionnement: number;
        montant_prevision_recettes_non_fiscales: number;
        montant_depenses_investissement_hors_subvention: number;
        montant_realisation_recettes_hors_subventions: number;
        montant_realisation_depenses_investissements_hors_subvention: number;
        montant_realisation_charge_personnel: number;
        montant_realisation_depenses_obligatoires: number;
        montant_subventions_transferees_communes: number;
        montant_depenses_engagees_par_etat: number;
        existence_compte_administratif: boolean;
        existence_compte_gestion_annexes_financieres: boolean;
        effectivite_maitrise_ouvrage_competences_transferees: boolean;
        existence_outil_planification: boolean;
    };
}

export interface GetAllOddlResponse {
    success?: boolean;
    data: Oddl[];
    total: number;
    page: number;
    total_pages: number;
}

export interface GetAllOddlParams extends Record<string, unknown> {
    page?: number;
    limit?: number | string;
    search?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface UpdateOddlResponse {
    success: boolean;
    message?: string;
    data?: Oddl;
}

export interface DeleteOddlResponse {
    success: boolean;
    message?: string;
}
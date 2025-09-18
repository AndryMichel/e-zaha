// Types pour les paramètres et réponses d'API des indicateurs ODDL

// Paramètres généraux pour les requêtes d'indicateurs
export interface GetIndicateurParams extends Record<string, unknown> {
    annee?: number;
}

// Types pour la Qualité de la Gouvernance Locale
export interface PourcentageCommunesIglSuperieur6Response {
    success: boolean[];
    data: {
        pourcentage_communes_igl_sup_6: number[];
        total_communes: number[];
        communes_igl_sup_6: number[];
        annee: number[];
    };
}

export interface MoyenneNationaleNoteIglResponse {
    success: boolean[];
    data: {
        moyenne_nationale_note_igl: number[];
        total_communes: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesIglEnLigneResponse {
    success: boolean[];
    data: {
        pourcentage_communes_igl_en_ligne: number[];
        total_communes_avec_igl: number[];
        communes_igl_en_ligne: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesPopulationSatisfaiteResponse {
    success: boolean[];
    data: {
        pourcentage_communes_population_satisfaite: number[];
        total_communes: number[];
        communes_satisfaites: number[];
        annee: number[];
    };
}

export interface StatistiquesSatisfactionItem {
    niveau: string;
    nombre_communes: number;
    pourcentage: number;
}

export interface StatistiquesSatisfactionPopulationResponse {
    success: boolean[];
    data: {
        statistiques: StatistiquesSatisfactionItem[];
        total_communes: number[];
        annee: number[];
    };
}

// Regroupement de toutes les données pour la Qualité de la Gouvernance Locale
export interface QualiteGouvernanceLocaleData {
    pourcentageCommunesIglSup6?: PourcentageCommunesIglSuperieur6Response;
    moyenneNationaleNoteIgl?: MoyenneNationaleNoteIglResponse;
    pourcentageCommunesIglEnLigne?: PourcentageCommunesIglEnLigneResponse;
    pourcentageCommunesPopulationSatisfaite?: PourcentageCommunesPopulationSatisfaiteResponse;
    statistiquesSatisfactionPopulation?: StatistiquesSatisfactionPopulationResponse;
}

// Types pour Scoring et Performance Administrative
export interface PourcentageCommunesScoringMocBplusResponse {
    success: boolean[];
    data: {
        pourcentage_communes_moc_bplus: number[];
        total_communes: number[];
        communes_moc_bplus: number[];
        annee: number[];
        message?: string[];
    };
}

export interface PourcentageCommunesScoringMrBplusResponse {
    success: boolean[];
    data: {
        pourcentage_communes_mr_bplus: number[];
        total_communes: number[];
        communes_mr_bplus: number[];
        annee: number[];
        message?: string[];
    };
}

export interface PourcentageCommunesScoringCgfBplusResponse {
    success: boolean[];
    data: {
        pourcentage_communes_cgf_bplus: number[];
        total_communes: number[];
        communes_cgf_bplus: number[];
        annee: number[];
        message?: string[];
    };
}

export interface PourcentageCommunesScoringEcBplusResponse {
    success: boolean[];
    data: {
        pourcentage_communes_ec_bplus: number[];
        total_communes: number[];
        communes_ec_bplus: number[];
        annee: number[];
        message?: string[];
    };
}

export interface PourcentageCommunesScoringGrhBplusResponse {
    success: boolean[];
    data: {
        pourcentage_communes_grh_bplus: number[];
        total_communes: number[];
        communes_grh_bplus: number[];
        annee: number[];
        message?: string[];
    };
}

// Regroupement de toutes les données pour Scoring et Performance Administrative
export interface ScoringPerformanceAdministrativeData {
    pourcentageCommunesMocBplus?: PourcentageCommunesScoringMocBplusResponse;
    pourcentageCommunesMrBplus?: PourcentageCommunesScoringMrBplusResponse;
    pourcentageCommunesCgfBplus?: PourcentageCommunesScoringCgfBplusResponse;
    pourcentageCommunesEcBplus?: PourcentageCommunesScoringEcBplusResponse;
    pourcentageCommunesGrhBplus?: PourcentageCommunesScoringGrhBplusResponse;
}


// Types pour la Performance Financière et Budgétaire
export interface TauxRealisationRecettesFiscalesResponse {
    success: boolean[];
    data: {
        taux_moyen_realisation_recettes_fiscales: number[];
        total_communes: number[];
        annee: number[];
    };
}

export interface TauxRealisationRecettesNonFiscalesResponse {
    success: boolean[];
    data: {
        taux_moyen_realisation_recettes_non_fiscales: number[];
        total_communes: number[];
        annee: number[];
    };
}

export interface TauxRealisationBudgetFonctionnementResponse {
    success: boolean[];
    data: {
        taux_moyen_realisation_budget_fonctionnement: number[];
        seuil_reference: number[];
        pourcentage_communes_conformes: number[];
        total_communes: number[];
        communes_au_dessus_seuil: number[];
        annee: number[];
    };
}

export interface TauxExecutionDepensesObligatoiresResponse {
    success: boolean[];
    data: {
        taux_moyen_execution_depenses_obligatoires: number[];
        total_communes: number[];
        annee: number[];
    };
}

export interface TauxProgrammationBudgetaireResponse {
    success: boolean[];
    data: {
        taux_programmation_budgetaire: number[];
        total_realisation_depenses: number[];
        total_prevision_depenses: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesProgrammationBudgetaireResponse {
    success: boolean[];
    data: {
        pourcentage_communes_prog_budget_inf_100: number[];
        total_communes: number[];
        communes_prog_budget_inf_100: number[];
        annee: number[];
    };
}

export interface NiveauRealisationRessourcesCommuneResponse {
    success: boolean[];
    data: {
        niveau_realisation_pourcentage: number[];
        total_realisation: number[];
        total_prevision: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesMobilisationRessourcesResponse {
    success: boolean[];
    data: {
        pourcentage_communes_mobilisation_ressources: number[];
        total_communes: number[];
        communes_mobilisation_suffisante: number[];
        annee: number[];
    };
}

// Regroupement de toutes les données pour la Performance Financière et Budgétaire
export interface PerformanceFinanciereBudgetaireData {
    tauxRealisationRecettesFiscales?: TauxRealisationRecettesFiscalesResponse;
    tauxRealisationRecettesNonFiscales?: TauxRealisationRecettesNonFiscalesResponse;
    tauxRealisationBudgetFonctionnement?: TauxRealisationBudgetFonctionnementResponse;
    tauxExecutionDepensesObligatoires?: TauxExecutionDepensesObligatoiresResponse;
    tauxProgrammationBudgetaire?: TauxProgrammationBudgetaireResponse;
    pourcentageCommunesProgrammationBudgetaire?: PourcentageCommunesProgrammationBudgetaireResponse;
    niveauRealisationRessourcesCommune?: NiveauRealisationRessourcesCommuneResponse;
    pourcentageCommunesMobilisationRessources?: PourcentageCommunesMobilisationRessourcesResponse;
}

// Types pour Investissement et Autonomie Financière
export interface PourcentageCommunesInvestissementSurRecettesPropresResponse {
    success: boolean[];
    data: {
        pourcentage_communes_investissement_15_plus: number[];
        total_communes: number[];
        communes_invest_15_plus: number[];
        annee: number[];
        message?: string[];
    };
}


export interface PourcentageCommunesEfficienceRhResponse {
    success: boolean[];
    data: {
        pourcentage_communes_efficience_rh_sup_50: number[];
        total_communes: number[];
        communes_efficience_rh_sup_50: number[];
        annee: number[];
    };
}

export interface RatioInvestissementsHorsSubventionsResponse {
    success: boolean[];
    data: {
        ratio_moyen_investissements_hors_subventions: number[];
        total_communes: number[];
        annee: number[];
        message?: string[];
    };
}

export interface RatioIndependanceFinanciereResponse {
    success: boolean[];
    data: {
        ratio_independance_financiere: number[];
        total_recettes_hors_subventions: number[];
        total_recettes_propres: number[];
        annee: number[];
        message?: string[];
    };
}

export interface PourcentageCommunesIndependanceFinanciereResponse {
    success: boolean[];
    data: {
        pourcentage_communes_indep_fin_sup_50: number[];
        total_communes: number[];
        communes_indep_fin_sup_50: number[];
        annee: number[];
        message?: string[];
    };
}

export interface PoidsRecettesFiscalesSurRecettesPropresResponse {
    success: boolean[];
    data: {
        poids_recettes_fiscales_pourcentage: number[];
        total_recettes_fiscales: number[];
        total_recettes_propres: number[];
        annee: number[];
        message?: string[];
    };
}

// Regroupement de toutes les données pour Investissement et Autonomie Financière
export interface InvestissementAutonomieFinanciereData {
    pourcentageCommunesInvestissement?: PourcentageCommunesInvestissementSurRecettesPropresResponse;
    ratioInvestissementsHorsSubventions?: RatioInvestissementsHorsSubventionsResponse;
    ratioIndependanceFinanciere?: RatioIndependanceFinanciereResponse;
    pourcentageCommunesIndependanceFinanciere?: PourcentageCommunesIndependanceFinanciereResponse;
    poidsRecettesFiscalesSurRecettesPropres?: PoidsRecettesFiscalesSurRecettesPropresResponse;
}

// Types pour les réponses des API de planification et Comptabilité
export interface PourcentageCommunesAvecPlanificationResponse {
    success: boolean[];
    data: {
        pourcentage_communes_avec_planification: number[];
        total_communes: number[];
        communes_avec_planification: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesAvecComptesResponse {
    success: boolean[];
    data: {
        pourcentage_communes_avec_comptes: number[];
        total_communes: number[];
        communes_avec_comptes: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesMaitriseOuvrageEffectiveResponse {
    success: boolean[];
    data: {
        pourcentage_communes_avec_maitrise_ouvrage_effective: number[];
        total_communes: number[];
        communes_avec_mo_effective: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesEfficacitePrevisionBudgetsResponse {
    success: boolean[];
    data: {
        pourcentage_communes_efficacite_prevision: number[];
        total_communes: number[];
        communes_efficaces: number[];
        annee: number[];
    };
}

export interface PourcentageCommunesStabiliteFinanciereResponse {
    success: boolean[];
    data: {
        pourcentage_communes_stabilite_financiere: number[];
        total_communes: number[];
        communes_stables: number[];
        annee: number[];
    };
}


// Mobilisation & Ressources Humaines
// export interface PourcentageCommunesMobilisationSecteurPriveCitoyensResponse {...}
// ...
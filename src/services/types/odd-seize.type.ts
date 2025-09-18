export interface OddSeize {
    id_odds_16: number;
    proportion_jeunes_femmes_hommes_violences_sexuelles: number;
    proportion_victimes_signalees_violences: number;
    proportion_population_carcérale_instance_jugement: number;
    nombre_vindictes_populaires: number;
    valeur_flux_financiers_illicites: number;
    indice_perception_corruption: number;
    proportion_population_satisfaction_services_publics: number;
    repartition_postes_publics_sexe_âge_handicap: number;
    proportion_population_prise_decisions_ouverte_reactive: number;
    created_at: string;
    updated_at: string;
}

export interface GetAllOddSeizeResponse {
    success?: boolean;
    data: OddSeize[];
    total: number;
    page: number;
    total_pages: number;
    region_id?: string;
    district_id?: string;
    commune_id?: string;
}

export interface GetAllOddSeizeParams extends Record<string, unknown> {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface DeleteOddSeizeResponse {
    message: string;
    success: boolean;
}

export interface UpdateOddSeizeResponse {
    message: string;
    success: boolean;
    data?: OddSeize;
}

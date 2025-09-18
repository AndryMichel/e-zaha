//services/types/dbcommune.type.ts
export interface Commune {
    id_situation_geographique: number;
    util_commune: string;
    superficie: number;
    nord: string;
    sud: string;
    est: string;
    ouest: string;

    localisation: {
        province: string;
        region: string;
        district: string;
        commune: string;
        categorie_commune: string;
    };

    coordonnees: {
        distance_chef_lieu_district: number;
        distance_chef_lieu_region: number;
        gps_de_la_commune: string;
        latitude: string;
        longitude: string;
        altitude: string;
        precision: string;
    };

    informations_commune: {
        dispose_bureau: boolean;
        type_occupation: string;
        annee_construction: number;
        annee_derniere_rehabilitation: number;
        etat_actuel: string;
        nombre_salles: number;
        effectif_personnel: number;
        effectif_hommes: number;
        effectif_femmes: number;
    };

    personnel_cle: {
        maire: {
            nom_prenoms: string;
            sexe: string;
            telephone: string;
            nombre_mandats: number;
            statut_emploi: string;
            niveau_instruction: string;
            diplome_eleve: string;
        };
        premier_adjoint: {
            nom_prenoms: string;
            sexe: string;
            telephone: string;
            nombre_mandats: number;
            statut_emploi: string;
            niveau_instruction: string;
            diplome_eleve: string;
        };
        secretaire_general: {
            nom_prenoms: string;
            sexe: string;
            telephone: string;
            annees_effectuees: number;
            statut_emploi: string;
            niveau_instruction: string;
            diplome_eleve: string;
        };
        tresorier: {
            nom_prenoms: string;
            sexe: string;
            telephone: string;
            annees_effectuees: number;
            statut_emploi: string;
            niveau_instruction: string;
            diplome_eleve: string;
        };
    };

    outils_informatiques: {
        dispose_outils: boolean;
        nombre_ordinateurs: number;
        nombre_imprimantes: number;
        dispose_internet: boolean;
        principale_connexion: string;
    };

    services_techniques: {
        autre: string | null;
        agriculture_elevage: string;
        peche: string;
        caa: string;
        gendarmerie: string;
        securite_publique: string;
        force_armee: string;
        environnement: string;
        education: string;
        sante: string;
        travaux_publics: string;
        amenagement_territoire_foncier: string;
        population_services: string;
        justice: string;
        economie_finance: string;
        poste_telecommunication: string;
        jeunesse_sport: string;
        tourisme: string;
        energie: string;
    };

    situation_demographique: {
        effectif_total: number;
        effectif_hommes: number;
        effectif_femmes: number;
        effectif_moins_5_ans: number;
        effectif_6_17_ans: number;
        effectif_18_60_ans: number;
        effectif_60_plus: number;
        somme_age1: number;
        effectif_total_menages: number;
        effectif_handicap: number;
        effectif_naissance: number;
        effectif_acte_naissance: number;
        effectif_deces: number;
        effectif_mariage: number;
    };

    centres_de_sante: {
        csb1: {
            dispose: boolean;
            effectif_total: number;
            effectif_formation: number;
            effectif_soins: number;
            nombre_services: number;
            nombre_patients_moyen: number;
        };
        csb2: {
            dispose: boolean;
            effectif_total: number;
            effectif_formation: number;
            effectif_soins: number;
            nombre_services: number;
            nombre_patients_moyen: number;
        };
        chrd: {
            dispose: boolean;
            effectif_total: number;
            effectif_formation: number;
            effectif_soins: number;
            nombre_services: number;
            nombre_patients_moyen: number;
        };
    };

    etablissements_educatifs: {
        primaire: {
            dispose: boolean;
            effectif_total: number;
            effectif_privees: number;
            effectif_publiques: number;
            effectif_eleves_prive: number;
            effectif_eleves_public: number;
            effectif_eleves_masculins: number;
            effectif_eleves_feminins: number;
            effectif_enseignants: number;
        };
        college: {
            dispose: boolean;
            effectif_total: number;
            effectif_privees: number;
            effectif_publiques: number;
            effectif_eleves_prive: number;
            effectif_eleves_public: number;
            effectif_eleves_masculins: number;
            effectif_eleves_feminins: number;
            effectif_enseignants: number;
        };
        lycee: {
            dispose: boolean;
            effectif_total: number;
            effectif_privees: number;
            effectif_publiques: number;
            effectif_eleves_prive: number;
            effectif_eleves_public: number;
            effectif_eleves_masculins: number;
            effectif_eleves_feminins: number;
            effectif_enseignants: number;
        };
    };

    eau_assainissement_electricite: {
        sources_eau: {
            borne_fontaine: {
                dispose: boolean;
                effectif: number;
                effectif_beneficiaires: number;
                observation: string;
            };
            forage: {
                dispose: boolean;
                effectif: number;
                effectif_beneficiaires: number;
                observation: string;
            };
            puits: {
                dispose: boolean;
                effectif: number;
                effectif_beneficiaires: number;
                observation: string;
            };
        };
        sources_electricite: {
            electricite: {
                dispose: boolean;
                effectif_menages: number;
                observation: string;
            };
            panneau_solaire: {
                dispose: boolean;
                effectif_menages: number;
                observation: string;
            };
            groupe_electrogene: {
                dispose: boolean;
                effectif_beneficiaires: number;
                observation: string;
            };
        };
    };

    titrisation_fonciere: {
        existence_bif: boolean;
        date_ouverture: string;
        effectif_demande: number;
        effectif_titres: number;
        effectif_certificats: string;
    };

    securite: {
        gendarmerie: {
            poste_fixe: {
                dispose: boolean;
                effectif: number;
                effectif_personnels: number;
                observation: string;
            };
            brigade: {
                dispose: boolean;
                effectif: number;
                effectif_personnels: number;
                observation: string;
            };
        };
        police: {
            commissariat: {
                dispose: boolean;
                effectif: number;
                effectif_personnels: number;
                observation: string;
            };
        };
    };

    situation_economique: {
        agriculture: {
            dispose: boolean;
            effectif_personnes: number;
            effectif_entreprises: number;
            type_produit_phare: string;
            quantites_produites: number;
            observation: string;
        };
        elevage: {
            dispose: boolean;
            effectif_personnes: number;
            effectif_entreprises: number;
            type_produit_phare: string;
            quantites_produites: number;
            observation: string;
        };
        peche: {
            dispose: boolean;
            effectif_personnes: number;
            effectif_entreprises: number;
            type_produit_phare: string;
            quantites_produites: number;
            observation: string;
        };
        infrastructures: {
            dispose_marche: boolean;
            dispose_barrage_hydraulique: boolean;
            dispose_abattoirs: boolean;
            accessibilite_routes: boolean;
        };
    };

    environnement: {
        existence_grc: boolean;
        realisation_filtrations: boolean;
        realisation_protection: boolean;
    };

    gouvernance: {
        existence_slc: boolean;
        existence_outils_planification: boolean;
        existence_pdl2: boolean;
        soumission_actes: boolean;
        existence_association_jeunes: boolean;
        existence_association_femmes: boolean;
        autoevaluation_igl: boolean;
        note_aeigl: string;
        note_pilier_a: number;
        note_pilier_b: number;
        note_pilier_c: number;
        note_pilier_d: number;
    };

    // partenariats: any[];

    fokontany: {
        id_fokontany: number;
        nom_fokontany: string | null;
        effectif_localite: number;
        effectif_population: string;
        effectif_homme: string;
        effectif_femme: string;
        effectif_moins_5_ans: string;
        effectif_6_17_ans: string;
        effectif_18_60_ans: string;
        effectif_60_ans_ou_plus: string;
        chef_fokontany: {
            nom: string | null;
            sexe: string | null;
            age: string;
            contact: string | null;
        };
    }[];
}


export interface GetAllDbCommuneParams extends Record<string, unknown> {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
    filter_by_code_commune?: string | null;
    filter_by_code_district?: string | null;
    filter_by_code_region?: string | null;
}

export interface GetAllDbCommuneResponse {
    success: boolean;
    data: Commune[];
    page: number;
    total: number;
    total_pages: number;
}

export interface DeleteCommuneResponse {
    message: string;
    success: boolean;
}

export interface UpdateCommuneResponse {
    message: string;
    success: boolean;
    data?: Commune;
}
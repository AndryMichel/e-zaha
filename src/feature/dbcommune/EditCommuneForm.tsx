"use client";

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";
import {Input} from "@/components/ui/atomes/input";
import {Label} from "@/components/ui/atomes/label";
import {Button} from "@/components/ui/atomes/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Switch} from "@/components/ui/atomes/switch";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {Commune} from "@/services/types/dbcommune.type";
import {updateCommune} from "@/services/api/commune/get-dbCommune.api";

// Interface pour les données du formulaire (mapping avec les paramètres de l'API)
interface CommuneFormData {
    // c_situation_geographique
    superficie: number | string;
    util_commune: string;
    commune_code: string;
    nord: string;
    sud: string;
    est: string;
    ouest: string;

    // c_localisation_commune
    province: string;
    region: string;
    district: string;
    commune: string;
    categorie_commune: string;

    // c_coordonnees_geographiques
    latitude: number | string;
    longitude: number | string;
    altitude: number | string;
    gps_de_la_commune: number | string;
    distance_chef_lieu_district: number | string;
    distance_chef_lieu_region: number | string;
    precision: number | string;

    // c_informations_commune
    dispose_bureau: boolean;
    type_occupation: string;
    annee_construction: number | string;
    annee_derniere_rehabilitation: number | string;
    autre: string;
    etat_actuel: string;
    nombre_salles: number | string;
    effectif_personnel: number | string;
    effectif_hommes_info: number | string;
    effectif_femmes_info: number | string;

    // c_personnel_cle - Maire
    nom_prenoms_maire: string;
    sexe_maire: string;
    telephone_maire: string;
    nombre_mandats_maire: number | string;
    statut_emploi_maire: string;
    niveau_instruction_maire: string;
    diplome_eleve_maire: string;

    // c_personnel_cle - 1er Adjoint
    nom_prenoms_1er_adjoint: string;
    sexe_1er_adjoint: string;
    telephone_1er_adjoint: string;
    nombre_mandats_1er_adjoint: number | string;
    statut_emploi_1er_adjoint: string;
    niveau_instruction_1er_adjoint: string;
    diplome_eleve_1er_adjoint: string;

    // c_personnel_cle - 2ième Adjoint
    nom_prenoms_2ieme_adjoint: string;
    sexe_2ieme_adjoint: string;
    telephone_2ieme_adjoint: string;
    nombre_mandats_2ieme_adjoint: number | string;
    statut_emploi_2ieme_adjoint: string;
    niveau_instruction_2ieme_adjoint: string;
    diplome_eleve_2ieme_adjoint: string;

    // c_personnel_cle - 3ième Adjoint
    nom_prenoms_3ieme_adjoint: string;
    sexe_3ieme_adjoint: string;
    telephone_3ieme_adjoint: string;
    nombre_mandats_3ieme_adjoint: number | string;
    statut_emploi_3ieme_adjoint: string;
    niveau_instruction_3ieme_adjoint: string;
    diplome_eleve_3ieme_adjoint: string;

    // c_personnel_cle - Président Conseil
    nom_prenoms_president_conseil: string;
    sexe_president_conseil: string;
    telephone_president_conseil: string;
    nombre_mandats_president_conseil: number | string;
    statut_emploi_president_conseil: string;
    niveau_instruction_president_conseil: string;
    diplome_eleve_president_conseil: string;

    // c_personnel_cle - Secrétaire Général
    nom_prenoms_secretaire_general: string;
    sexe_secretaire_general: string;
    telephone_secretaire_general: string;
    annees_effectuees_secretaire_general: number | string;
    statut_emploi_secretaire_general: string;
    niveau_instruction_secretaire_general: string;
    diplome_eleve_secretaire_general: string;

    // c_personnel_cle - Secrétaire État Civil
    nom_prenoms_secretaire_etat_civil: string;
    sexe_secretaire_etat_civil: string;
    telephone_secretaire_etat_civil: string;
    annees_effectuees_secretaire_etat_civil: number | string;
    statut_emploi_secretaire_etat_civil: string;
    niveau_instruction_secretaire_etat_civil: string;
    diplome_eleve_secretaire_etat_civil: string;

    // c_personnel_cle - Secrétaire Administratif
    nom_prenoms_secretaire_administratif: string;
    sexe_secretaire_administratif: string;
    telephone_secretaire_administratif: string;
    annees_effectuees_secretaire_administratif: number | string;
    statut_emploi_secretaire_administratif: string;
    niveau_instruction_secretaire_administratif: string;
    diplome_eleve_secretaire_administratif: string;

    // c_personnel_cle - Trésorier
    nom_prenoms_tresorier: string;
    sexe_tresorier: string;
    telephone_tresorier: string;
    annees_effectuees_tresorier: number | string;
    statut_emploi_tresorier: string;
    niveau_instruction_tresorier: string;
    diplome_eleve_tresorier: string;

    // c_personnel_cle - Agent Développement
    nom_prenoms_agent_developpement: string;
    sexe_agent_developpement: string;
    telephone_agent_developpement: string;
    annees_effectuees_agent_developpement: number | string;
    statut_emploi_agent_developpement: string;
    niveau_instruction_agent_developpement: string;
    diplome_eleve_agent_developpement: string;

    // c_personnel_cle - Agent BIF
    nom_prenoms_agent_bif: string;
    sexe_agent_bif: string;
    telephone_agent_bif: string;
    annees_effectuees_agent_bif: number | string;
    statut_emploi_agent_bif: string;
    niveau_instruction_agent_bif: string;
    diplome_eleve_agent_bif: string;

    // c_outils_informatiques
    dispose_outils: boolean;
    nombre_ordinateurs: number | string;
    nombre_imprimantes: number | string;
    dispose_internet: boolean;
    principale_connexion: string;

    // c_services_techniques
    agriculture_elevage: boolean;
    peche: boolean;
    caa: boolean;
    gendarmerie: boolean;
    securite_publique: boolean;
    force_armee: boolean;
    environnement: boolean;
    education: boolean;
    sante: boolean;
    travaux_publics: boolean;
    amenagement_territoire_foncier: boolean;
    population_services: boolean;
    justice: boolean;
    economie_finance: boolean;
    poste_telecommunication: boolean;
    jeunesse_sport: boolean;
    tourisme: boolean;
    energie: boolean;
    autre_service: boolean;
    autre_details: string;

    // c_situation_demographique
    effectif_total_demo: number | string;
    effectif_hommes_demo: number | string;
    effectif_femmes_demo: number | string;
    effectif_moins_5_ans: number | string;
    effectif_6_17_ans: number | string;
    effectif_18_60_ans: number | string;
    effectif_60_plus: number | string;
    somme_age1: number | string;
    effectif_total_menages: number | string;
    effectif_handicap: number | string;
    effectif_naissance: number | string;
    effectif_acte_naissance: number | string;
    effectif_deces: number | string;
    effectif_mariage: number | string;

    // c_centres_de_sante - CSB1
    dispose_csb1: boolean;
    effectif_total_csb1: number | string;
    effectif_formation_csb1: number | string;
    effectif_soins_csb1: number | string;
    nombre_services_csb1: number | string;
    nombre_patients_moyen_csb1: number | string;

    // c_centres_de_sante - CSB2
    dispose_csb2: boolean;
    effectif_total_csb2: number | string;
    effectif_formation_csb2: number | string;
    effectif_soins_csb2: number | string;
    nombre_services_csb2: number | string;
    nombre_patients_moyen_csb2: number | string;

    // c_centres_de_sante - CHRD
    dispose_chrd: boolean;
    effectif_total_chrd: number | string;
    effectif_formation_chrd: number | string;
    effectif_soins_chrd: number | string;
    nombre_services_chrd: number | string;
    nombre_patients_moyen_chrd: number | string;

    // c_centres_de_sante - CHRR
    dispose_chrr: boolean;
    effectif_total_chrr: number | string;
    effectif_formation_chrr: number | string;
    effectif_soins_chrr: number | string;
    nombre_services_chrr: number | string;
    nombre_patients_moyen_chrr: number | string;

    // c_centres_de_sante - CHU
    dispose_chu: boolean;
    effectif_total_chu: number | string;
    effectif_formation_chu: number | string;
    effectif_soins_chu: number | string;
    nombre_services_chu: number | string;
    nombre_patients_moyen_chu: number | string;

    // c_centres_de_sante - Dispensaire/Clinique
    dispose_dispensaire_clinique: boolean;
    effectif_total_dispensaire_clinique: number | string;
    effectif_formation_dispensaire_clinique: number | string;
    effectif_soins_dispensaire_clinique: number | string;
    nombre_services_dispensaire_clinique: number | string;
    nombre_patients_moyen_dispensaire_clinique: number | string;

    // c_etablissements_educatifs - Primaire
    dispose_ecole_primaire: boolean;
    effectif_ecoles_primaires: number | string;
    effectif_ecoles_primaires_privees: number | string;
    effectif_ecoles_primaires_publiques: number | string;
    effectif_eleves_primaire_prive: number | string;
    effectif_eleves_primaire_public: number | string;
    effectif_eleves_primaire_masculins: number | string;
    effectif_eleves_primaire_feminins: number | string;
    effectif_enseignants_primaire: number | string;

    // c_etablissements_educatifs - Collège
    dispose_college: boolean;
    effectif_colleges: number | string;
    effectif_colleges_privees: number | string;
    effectif_colleges_publiques: number | string;
    effectif_eleves_college_prive: number | string;
    effectif_eleves_college_public: number | string;
    effectif_eleves_college_masculins: number | string;
    effectif_eleves_college_feminins: number | string;
    effectif_enseignants_college: number | string;

    // c_etablissements_educatifs - Lycée
    dispose_lycee: boolean;
    effectif_lycees: number | string;
    effectif_lycees_privees: number | string;
    effectif_lycees_publiques: number | string;
    effectif_eleves_lycee_prive: number | string;
    effectif_eleves_lycee_public: number | string;
    effectif_eleves_lycee_masculins: number | string;
    effectif_eleves_lycee_feminins: number | string;
    effectif_enseignants_lycee: number | string;

    // c_etablissements_educatifs - Université
    dispose_universite: boolean;
    effectif_universites: number | string;
    effectif_universites_privees: number | string;
    effectif_universites_publiques: number | string;
    effectif_etudiants_universite_prive: number | string;
    effectif_etudiants_universite_public: number | string;
    effectif_etudiants_universite_masculins: number | string;
    effectif_etudiants_universite_feminins: number | string;
    effectif_enseignants_universite: number | string;

    // c_eau_assainissement_electricite - Sources d'eau
    dispose_borne_fontaine: boolean;
    effectif_borne_fontaine: number | string;
    effectif_beneficiaires_borne_fontaine: number | string;
    observation_borne_fontaine: string;

    dispose_forage: boolean;
    effectif_forage: number | string;
    effectif_beneficiaires_forage: number | string;
    observation_forage: string;

    dispose_puits: boolean;
    effectif_puits: number | string;
    effectif_beneficiaires_puits: number | string;
    observation_puits: string;

    dispose_branchement_particulier: boolean;
    effectif_branchement_particulier: number | string;
    effectif_beneficiaires_branchement_particulier: number | string;
    observation_branchement_particulier: string;

    dispose_eau_surface: boolean;
    effectif_beneficiaires_eau_surface: number | string;

    dispose_autre_source_eau: boolean;
    nom_autre_source_eau: string;
    effectif_autre_source_eau: number | string;
    effectif_beneficiaires_autre_source_eau: number | string;
    observation_autre_source_eau: string;

    // c_eau_assainissement_electricite - Assainissement
    dispose_bloc_sanitaire: boolean;
    effectif_bloc_sanitaire: number | string;
    effectif_beneficiaires_bloc_sanitaire: number | string;
    observation_bloc_sanitaire: string;

    dispose_bassin_lavoir: boolean;
    effectif_bassin_lavoir: number | string;
    effectif_beneficiaires_bassin_lavoir: number | string;
    observation_bassin_lavoir: string;

    // c_eau_assainissement_electricite - Électricité
    dispose_electricite: boolean;
    effectif_menages_electricite: number | string;
    observation_electricite: string;

    dispose_panneau_solaire: boolean;
    effectif_menages_panneau_solaire: number | string;
    observation_panneau_solaire: string;

    dispose_petrole_lampant: boolean;
    effectif_menages_petrole_lampant: number | string;
    observation_petrole_lampant: string;

    dispose_groupe_electrogene: boolean;
    effectif_beneficiaires_groupe_electrogene: number | string;
    observation_groupe_electrogene: string;

    dispose_autre_source_electricite: boolean;
    nom_autre_source_electricite: string;
    effectif_beneficiaires_autre_source_electricite: number | string;
    observation_autre_source_electricite: string;

    // c_titrisation_fonciere
    existence_bif: string;
    date_ouverture: string;
    effectif_demande: number | string;
    effectif_titres: number | string;
    effectif_certificats: number | string;

    // c_securite - Gendarmerie
    dispose_poste_fixe_gn: boolean;
    effectif_poste_fixe_gn: number | string;
    effectif_personnels_poste_fixe_gn: number | string;
    observation_poste_fixe_gn: string;

    dispose_poste_avancee_gn: boolean;
    effectif_poste_avancee_gn: number | string;
    effectif_personnels_poste_avancee_gn: number | string;
    observation_poste_avancee_gn: string;

    dispose_brigade_gn: boolean;
    effectif_brigade_gn: number | string;
    effectif_personnels_brigade_gn: number | string;
    observation_brigade_gn: string;

    // c_securite - Police
    dispose_commissariat_pn: boolean;
    effectif_commissariat_pn: number | string;
    effectif_personnels_commissariat_pn: number | string;
    observation_commissariat_pn: string;

    // c_securite - Autres
    dispose_das: boolean;
    effectif_das: number | string;
    effectif_personnels_das: number | string;
    observation_das: string;

    dispose_autre_bureau: boolean;
    nom_autre_bureau: string;
    effectif_autre_bureau: number | string;
    effectif_personnels_autre_bureau: number | string;
    observation_autre_bureau: string;

    // c_situation_economique
    dispose_agriculture: boolean;
    effectif_personnes_agriculture: number | string;
    effectif_entreprises_agriculture: number | string;
    type_produit_phare_agriculture: string;
    quantites_produites_agriculture: number | string;
    observation_agriculture: string;

    dispose_elevage: boolean;
    effectif_personnes_elevage: number | string;
    effectif_entreprises_elevage: number | string;
    type_produit_phare_elevage: string;
    quantites_produites_elevage: number | string;
    observation_elevage: string;

    dispose_peche: boolean;
    effectif_personnes_peche: number | string;
    effectif_entreprises_peche: number | string;
    type_produit_phare_peche: string;
    quantites_produites_peche: number | string;
    observation_peche: string;

    dispose_tourisme: boolean;
    nombre_visiteurs_tourisme: number | string;
    type_service_tourisme: string;
    observation_tourisme: string;

    dispose_exploitation_miniere: boolean;
    effectif_personnes_exploitation_miniere: number | string;
    effectif_entreprises_exploitation_miniere: number | string;
    type_produit_phare_exploitation_miniere: string;
    quantites_produites_exploitation_miniere: number | string;
    observation_exploitation_miniere: string;

    dispose_industrie: boolean;
    effectif_personnes_industrie: number | string;
    effectif_entreprises_industrie: number | string;
    type_produit_phare_industrie: string;
    quantites_produites_industrie: number | string;
    observation_industrie: string;

    dispose_artisanat: boolean;
    effectif_personnes_artisanat: number | string;
    effectif_entreprises_artisanat: number | string;
    type_produit_phare_artisanat: string;
    quantites_produites_artisanat: number | string;
    observation_artisanat: string;

    dispose_commerce: boolean;
    effectif_personnes_commerce: number | string;
    effectif_entreprises_commerce: number | string;
    type_produit_phare_commerce: string;
    quantites_produites_commerce: number | string;
    observation_commerce: string;

    dispose_autre_ressource: boolean;
    nom_autre_ressource: string;
    effectif_personnes_autre_ressource: number | string;
    effectif_entreprises_autre_ressource: number | string;
    type_produit_phare_autre_ressource: string;
    quantites_produites_autre_ressource: number | string;
    observation_autre_ressource: string;

    dispose_marche: boolean;
    dispose_barrage_hydraulique: boolean;
    dispose_abattoirs: boolean;
    accessibilite_routes: boolean;

    // c_environnement
    existence_grc: boolean;
    realisation_filtrations: boolean;
    realisation_protection: boolean;

    // c_gouvernance
    existence_slc: boolean;
    existence_outils_planification: boolean;
    existence_pdl2: boolean;
    soumission_actes: boolean;
    existence_association_jeunes: boolean;
    existence_association_femmes: boolean;
    autoevaluation_igl: boolean;
    note_aeigl: string;
    note_pilier_a: number | string;
    note_pilier_b: number | string;
    note_pilier_c: number | string;
    note_pilier_d: number | string;
    note_scoring_moc: number | string;
    note_scoring_mr: number | string;
    note_scoring_cgf: number | string;
    note_scoring_ec: number | string;
    note_scoring_grh: number | string;

    [key: string]: string | number | boolean | null | undefined;
}

interface Props {
    commune: Commune;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function EditCommuneForm({commune, isOpen, onClose, onSave}: Props) {
    const {data: session} = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CommuneFormData>({} as CommuneFormData);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("situation-geo");

    useEffect(() => {
        if (commune) {
            setFormData({
                // c_situation_geographique
                superficie: commune.superficie || "",
                util_commune: commune.util_commune || "",
                commune_code: "", // Non présent dans le type Commune
                nord: commune.nord || "",
                sud: commune.sud || "",
                est: commune.est || "",
                ouest: commune.ouest || "",

                // c_localisation_commune
                province: commune.localisation?.province || "",
                region: commune.localisation?.region || "",
                district: commune.localisation?.district || "",
                commune: commune.localisation?.commune || "",
                categorie_commune: commune.localisation?.categorie_commune || "",

                // c_coordonnees_geographiques
                latitude: commune.coordonnees?.latitude || "",
                longitude: commune.coordonnees?.longitude || "",
                altitude: commune.coordonnees?.altitude || "",
                gps_de_la_commune: commune.coordonnees?.gps_de_la_commune || "",
                distance_chef_lieu_district: commune.coordonnees?.distance_chef_lieu_district || "",
                distance_chef_lieu_region: commune.coordonnees?.distance_chef_lieu_region || "",
                precision: commune.coordonnees?.precision || "",

                // c_informations_commune
                dispose_bureau: commune.informations_commune?.dispose_bureau || false,
                type_occupation: commune.informations_commune?.type_occupation || "",
                annee_construction: commune.informations_commune?.annee_construction || "",
                annee_derniere_rehabilitation: commune.informations_commune?.annee_derniere_rehabilitation || "",
                autre: "", // Non présent dans le type
                etat_actuel: commune.informations_commune?.etat_actuel || "",
                nombre_salles: commune.informations_commune?.nombre_salles || "",
                effectif_personnel: commune.informations_commune?.effectif_personnel || "",
                effectif_hommes_info: commune.informations_commune?.effectif_hommes || "",
                effectif_femmes_info: commune.informations_commune?.effectif_femmes || "",

                // c_personnel_cle - Maire
                nom_prenoms_maire: commune.personnel_cle?.maire?.nom_prenoms || "",
                sexe_maire: commune.personnel_cle?.maire?.sexe || "",
                telephone_maire: commune.personnel_cle?.maire?.telephone || "",
                nombre_mandats_maire: commune.personnel_cle?.maire?.nombre_mandats || "",
                statut_emploi_maire: commune.personnel_cle?.maire?.statut_emploi || "",
                niveau_instruction_maire: commune.personnel_cle?.maire?.niveau_instruction || "",
                diplome_eleve_maire: commune.personnel_cle?.maire?.diplome_eleve || "",

                // c_personnel_cle - Premier Adjoint
                nom_prenoms_1er_adjoint: commune.personnel_cle?.premier_adjoint?.nom_prenoms || "",
                sexe_1er_adjoint: commune.personnel_cle?.premier_adjoint?.sexe || "",
                telephone_1er_adjoint: commune.personnel_cle?.premier_adjoint?.telephone || "",
                nombre_mandats_1er_adjoint: commune.personnel_cle?.premier_adjoint?.nombre_mandats || "",
                statut_emploi_1er_adjoint: commune.personnel_cle?.premier_adjoint?.statut_emploi || "",
                niveau_instruction_1er_adjoint: commune.personnel_cle?.premier_adjoint?.niveau_instruction || "",
                diplome_eleve_1er_adjoint: commune.personnel_cle?.premier_adjoint?.diplome_eleve || "",

                // Valeurs par défaut pour les autres adjoints (pas dans le type)
                nom_prenoms_2ieme_adjoint: "",
                sexe_2ieme_adjoint: "",
                telephone_2ieme_adjoint: "",
                nombre_mandats_2ieme_adjoint: "",
                statut_emploi_2ieme_adjoint: "",
                niveau_instruction_2ieme_adjoint: "",
                diplome_eleve_2ieme_adjoint: "",

                nom_prenoms_3ieme_adjoint: "",
                sexe_3ieme_adjoint: "",
                telephone_3ieme_adjoint: "",
                nombre_mandats_3ieme_adjoint: "",
                statut_emploi_3ieme_adjoint: "",
                niveau_instruction_3ieme_adjoint: "",
                diplome_eleve_3ieme_adjoint: "",

                nom_prenoms_president_conseil: "",
                sexe_president_conseil: "",
                telephone_president_conseil: "",
                nombre_mandats_president_conseil: "",
                statut_emploi_president_conseil: "",
                niveau_instruction_president_conseil: "",
                diplome_eleve_president_conseil: "",

                // c_personnel_cle - Secrétaire Général
                nom_prenoms_secretaire_general: commune.personnel_cle?.secretaire_general?.nom_prenoms || "",
                sexe_secretaire_general: commune.personnel_cle?.secretaire_general?.sexe || "",
                telephone_secretaire_general: commune.personnel_cle?.secretaire_general?.telephone || "",
                annees_effectuees_secretaire_general: commune.personnel_cle?.secretaire_general?.annees_effectuees || "",
                statut_emploi_secretaire_general: commune.personnel_cle?.secretaire_general?.statut_emploi || "",
                niveau_instruction_secretaire_general: commune.personnel_cle?.secretaire_general?.niveau_instruction || "",
                diplome_eleve_secretaire_general: commune.personnel_cle?.secretaire_general?.diplome_eleve || "",

                // Valeurs par défaut pour les autres secrétaires (pas dans le type)
                nom_prenoms_secretaire_etat_civil: "",
                sexe_secretaire_etat_civil: "",
                telephone_secretaire_etat_civil: "",
                annees_effectuees_secretaire_etat_civil: "",
                statut_emploi_secretaire_etat_civil: "",
                niveau_instruction_secretaire_etat_civil: "",
                diplome_eleve_secretaire_etat_civil: "",

                nom_prenoms_secretaire_administratif: "",
                sexe_secretaire_administratif: "",
                telephone_secretaire_administratif: "",
                annees_effectuees_secretaire_administratif: "",
                statut_emploi_secretaire_administratif: "",
                niveau_instruction_secretaire_administratif: "",
                diplome_eleve_secretaire_administratif: "",

                // c_personnel_cle - Trésorier
                nom_prenoms_tresorier: commune.personnel_cle?.tresorier?.nom_prenoms || "",
                sexe_tresorier: commune.personnel_cle?.tresorier?.sexe || "",
                telephone_tresorier: commune.personnel_cle?.tresorier?.telephone || "",
                annees_effectuees_tresorier: commune.personnel_cle?.tresorier?.annees_effectuees || "",
                statut_emploi_tresorier: commune.personnel_cle?.tresorier?.statut_emploi || "",
                niveau_instruction_tresorier: commune.personnel_cle?.tresorier?.niveau_instruction || "",
                diplome_eleve_tresorier: commune.personnel_cle?.tresorier?.diplome_eleve || "",

                // Valeurs par défaut pour les autres agents (pas dans le type)
                nom_prenoms_agent_developpement: "",
                sexe_agent_developpement: "",
                telephone_agent_developpement: "",
                annees_effectuees_agent_developpement: "",
                statut_emploi_agent_developpement: "",
                niveau_instruction_agent_developpement: "",
                diplome_eleve_agent_developpement: "",

                nom_prenoms_agent_bif: "",
                sexe_agent_bif: "",
                telephone_agent_bif: "",
                annees_effectuees_agent_bif: "",
                statut_emploi_agent_bif: "",
                niveau_instruction_agent_bif: "",
                diplome_eleve_agent_bif: "",

                // c_outils_informatiques
                dispose_outils: commune.outils_informatiques?.dispose_outils || false,
                nombre_ordinateurs: commune.outils_informatiques?.nombre_ordinateurs || "",
                nombre_imprimantes: commune.outils_informatiques?.nombre_imprimantes || "",
                dispose_internet: commune.outils_informatiques?.dispose_internet || false,
                principale_connexion: commune.outils_informatiques?.principale_connexion || "",

                // c_services_techniques
                agriculture_elevage: commune.services_techniques?.agriculture_elevage === "true" || false,
                peche: commune.services_techniques?.peche === "true" || false,
                caa: commune.services_techniques?.caa === "true" || false,
                gendarmerie: commune.services_techniques?.gendarmerie === "true" || false,
                securite_publique: commune.services_techniques?.securite_publique === "true" || false,
                force_armee: commune.services_techniques?.force_armee === "true" || false,
                environnement: commune.services_techniques?.environnement === "true" || false,
                education: commune.services_techniques?.education === "true" || false,
                sante: commune.services_techniques?.sante === "true" || false,
                travaux_publics: commune.services_techniques?.travaux_publics === "true" || false,
                amenagement_territoire_foncier: commune.services_techniques?.amenagement_territoire_foncier === "true" || false,
                population_services: commune.services_techniques?.population_services === "true" || false,
                justice: commune.services_techniques?.justice === "true" || false,
                economie_finance: commune.services_techniques?.economie_finance === "true" || false,
                poste_telecommunication: commune.services_techniques?.poste_telecommunication === "true" || false,
                jeunesse_sport: commune.services_techniques?.jeunesse_sport === "true" || false,
                tourisme: commune.services_techniques?.tourisme === "true" || false,
                energie: commune.services_techniques?.energie === "true" || false,
                autre_service: false,
                autre_details: commune.services_techniques?.autre || "",

                // c_situation_demographique
                effectif_total_demo: commune.situation_demographique?.effectif_total || "",
                effectif_hommes_demo: commune.situation_demographique?.effectif_hommes || "",
                effectif_femmes_demo: commune.situation_demographique?.effectif_femmes || "",
                effectif_moins_5_ans: commune.situation_demographique?.effectif_moins_5_ans || "",
                effectif_6_17_ans: commune.situation_demographique?.effectif_6_17_ans || "",
                effectif_18_60_ans: commune.situation_demographique?.effectif_18_60_ans || "",
                effectif_60_plus: commune.situation_demographique?.effectif_60_plus || "",
                somme_age1: commune.situation_demographique?.somme_age1 || "",
                effectif_total_menages: commune.situation_demographique?.effectif_total_menages || "",
                effectif_handicap: commune.situation_demographique?.effectif_handicap || "",
                effectif_naissance: commune.situation_demographique?.effectif_naissance || "",
                effectif_acte_naissance: commune.situation_demographique?.effectif_acte_naissance || "",
                effectif_deces: commune.situation_demographique?.effectif_deces || "",
                effectif_mariage: commune.situation_demographique?.effectif_mariage || "",

                // c_centres_de_sante - CSB1
                dispose_csb1: commune.centres_de_sante?.csb1?.dispose || false,
                effectif_total_csb1: commune.centres_de_sante?.csb1?.effectif_total || "",
                effectif_formation_csb1: commune.centres_de_sante?.csb1?.effectif_formation || "",
                effectif_soins_csb1: commune.centres_de_sante?.csb1?.effectif_soins || "",
                nombre_services_csb1: commune.centres_de_sante?.csb1?.nombre_services || "",
                nombre_patients_moyen_csb1: commune.centres_de_sante?.csb1?.nombre_patients_moyen || "",

                // c_centres_de_sante - CSB2
                dispose_csb2: commune.centres_de_sante?.csb2?.dispose || false,
                effectif_total_csb2: commune.centres_de_sante?.csb2?.effectif_total || "",
                effectif_formation_csb2: commune.centres_de_sante?.csb2?.effectif_formation || "",
                effectif_soins_csb2: commune.centres_de_sante?.csb2?.effectif_soins || "",
                nombre_services_csb2: commune.centres_de_sante?.csb2?.nombre_services || "",
                nombre_patients_moyen_csb2: commune.centres_de_sante?.csb2?.nombre_patients_moyen || "",

                // c_centres_de_sante - CHRD
                dispose_chrd: commune.centres_de_sante?.chrd?.dispose || false,
                effectif_total_chrd: commune.centres_de_sante?.chrd?.effectif_total || "",
                effectif_formation_chrd: commune.centres_de_sante?.chrd?.effectif_formation || "",
                effectif_soins_chrd: commune.centres_de_sante?.chrd?.effectif_soins || "",
                nombre_services_chrd: commune.centres_de_sante?.chrd?.nombre_services || "",
                nombre_patients_moyen_chrd: commune.centres_de_sante?.chrd?.nombre_patients_moyen || "",

                // Valeurs par défaut pour CHRR, CHU, Dispensaire (pas dans le type)
                dispose_chrr: false,
                effectif_total_chrr: "",
                effectif_formation_chrr: "",
                effectif_soins_chrr: "",
                nombre_services_chrr: "",
                nombre_patients_moyen_chrr: "",

                dispose_chu: false,
                effectif_total_chu: "",
                effectif_formation_chu: "",
                effectif_soins_chu: "",
                nombre_services_chu: "",
                nombre_patients_moyen_chu: "",

                dispose_dispensaire_clinique: false,
                effectif_total_dispensaire_clinique: "",
                effectif_formation_dispensaire_clinique: "",
                effectif_soins_dispensaire_clinique: "",
                nombre_services_dispensaire_clinique: "",
                nombre_patients_moyen_dispensaire_clinique: "",

                // c_etablissements_educatifs - Primaire
                dispose_ecole_primaire: commune.etablissements_educatifs?.primaire?.dispose || false,
                effectif_ecoles_primaires: commune.etablissements_educatifs?.primaire?.effectif_total || "",
                effectif_ecoles_primaires_privees: commune.etablissements_educatifs?.primaire?.effectif_privees || "",
                effectif_ecoles_primaires_publiques: commune.etablissements_educatifs?.primaire?.effectif_publiques || "",
                effectif_eleves_primaire_prive: commune.etablissements_educatifs?.primaire?.effectif_eleves_prive || "",
                effectif_eleves_primaire_public: commune.etablissements_educatifs?.primaire?.effectif_eleves_public || "",
                effectif_eleves_primaire_masculins: commune.etablissements_educatifs?.primaire?.effectif_eleves_masculins || "",
                effectif_eleves_primaire_feminins: commune.etablissements_educatifs?.primaire?.effectif_eleves_feminins || "",
                effectif_enseignants_primaire: commune.etablissements_educatifs?.primaire?.effectif_enseignants || "",

                // c_etablissements_educatifs - Collège
                dispose_college: commune.etablissements_educatifs?.college?.dispose || false,
                effectif_colleges: commune.etablissements_educatifs?.college?.effectif_total || "",
                effectif_colleges_privees: commune.etablissements_educatifs?.college?.effectif_privees || "",
                effectif_colleges_publiques: commune.etablissements_educatifs?.college?.effectif_publiques || "",
                effectif_eleves_college_prive: commune.etablissements_educatifs?.college?.effectif_eleves_prive || "",
                effectif_eleves_college_public: commune.etablissements_educatifs?.college?.effectif_eleves_public || "",
                effectif_eleves_college_masculins: commune.etablissements_educatifs?.college?.effectif_eleves_masculins || "",
                effectif_eleves_college_feminins: commune.etablissements_educatifs?.college?.effectif_eleves_feminins || "",
                effectif_enseignants_college: commune.etablissements_educatifs?.college?.effectif_enseignants || "",

                // c_etablissements_educatifs - Lycée
                dispose_lycee: commune.etablissements_educatifs?.lycee?.dispose || false,
                effectif_lycees: commune.etablissements_educatifs?.lycee?.effectif_total || "",
                effectif_lycees_privees: commune.etablissements_educatifs?.lycee?.effectif_privees || "",
                effectif_lycees_publiques: commune.etablissements_educatifs?.lycee?.effectif_publiques || "",
                effectif_eleves_lycee_prive: commune.etablissements_educatifs?.lycee?.effectif_eleves_prive || "",
                effectif_eleves_lycee_public: commune.etablissements_educatifs?.lycee?.effectif_eleves_public || "",
                effectif_eleves_lycee_masculins: commune.etablissements_educatifs?.lycee?.effectif_eleves_masculins || "",
                effectif_eleves_lycee_feminins: commune.etablissements_educatifs?.lycee?.effectif_eleves_feminins || "",
                effectif_enseignants_lycee: commune.etablissements_educatifs?.lycee?.effectif_enseignants || "",

                // Valeurs par défaut pour Université (pas dans le type)
                dispose_universite: false,
                effectif_universites: "",
                effectif_universites_privees: "",
                effectif_universites_publiques: "",
                effectif_etudiants_universite_prive: "",
                effectif_etudiants_universite_public: "",
                effectif_etudiants_universite_masculins: "",
                effectif_etudiants_universite_feminins: "",
                effectif_enseignants_universite: "",

                // c_eau_assainissement_electricite - Sources d'eau
                dispose_borne_fontaine: commune.eau_assainissement_electricite?.sources_eau?.borne_fontaine?.dispose || false,
                effectif_borne_fontaine: commune.eau_assainissement_electricite?.sources_eau?.borne_fontaine?.effectif || "",
                effectif_beneficiaires_borne_fontaine: commune.eau_assainissement_electricite?.sources_eau?.borne_fontaine?.effectif_beneficiaires || "",
                observation_borne_fontaine: commune.eau_assainissement_electricite?.sources_eau?.borne_fontaine?.observation || "",

                dispose_forage: commune.eau_assainissement_electricite?.sources_eau?.forage?.dispose || false,
                effectif_forage: commune.eau_assainissement_electricite?.sources_eau?.forage?.effectif || "",
                effectif_beneficiaires_forage: commune.eau_assainissement_electricite?.sources_eau?.forage?.effectif_beneficiaires || "",
                observation_forage: commune.eau_assainissement_electricite?.sources_eau?.forage?.observation || "",

                dispose_puits: commune.eau_assainissement_electricite?.sources_eau?.puits?.dispose || false,
                effectif_puits: commune.eau_assainissement_electricite?.sources_eau?.puits?.effectif || "",
                effectif_beneficiaires_puits: commune.eau_assainissement_electricite?.sources_eau?.puits?.effectif_beneficiaires || "",
                observation_puits: commune.eau_assainissement_electricite?.sources_eau?.puits?.observation || "",

                // Valeurs par défaut pour les autres sources d'eau
                dispose_branchement_particulier: false,
                effectif_branchement_particulier: "",
                effectif_beneficiaires_branchement_particulier: "",
                observation_branchement_particulier: "",

                dispose_eau_surface: false,
                effectif_beneficiaires_eau_surface: "",

                dispose_autre_source_eau: false,
                nom_autre_source_eau: "",
                effectif_autre_source_eau: "",
                effectif_beneficiaires_autre_source_eau: "",
                observation_autre_source_eau: "",

                // Valeurs par défaut pour l'assainissement
                dispose_bloc_sanitaire: false,
                effectif_bloc_sanitaire: "",
                effectif_beneficiaires_bloc_sanitaire: "",
                observation_bloc_sanitaire: "",

                dispose_bassin_lavoir: false,
                effectif_bassin_lavoir: "",
                effectif_beneficiaires_bassin_lavoir: "",
                observation_bassin_lavoir: "",

                // c_eau_assainissement_electricite - Sources d'électricité
                dispose_electricite: commune.eau_assainissement_electricite?.sources_electricite?.electricite?.dispose || false,
                effectif_menages_electricite: commune.eau_assainissement_electricite?.sources_electricite?.electricite?.effectif_menages || "",
                observation_electricite: commune.eau_assainissement_electricite?.sources_electricite?.electricite?.observation || "",

                dispose_panneau_solaire: commune.eau_assainissement_electricite?.sources_electricite?.panneau_solaire?.dispose || false,
                effectif_menages_panneau_solaire: commune.eau_assainissement_electricite?.sources_electricite?.panneau_solaire?.effectif_menages || "",
                observation_panneau_solaire: commune.eau_assainissement_electricite?.sources_electricite?.panneau_solaire?.observation || "",

                dispose_groupe_electrogene: commune.eau_assainissement_electricite?.sources_electricite?.groupe_electrogene?.dispose || false,
                effectif_beneficiaires_groupe_electrogene: commune.eau_assainissement_electricite?.sources_electricite?.groupe_electrogene?.effectif_beneficiaires || "",
                observation_groupe_electrogene: commune.eau_assainissement_electricite?.sources_electricite?.groupe_electrogene?.observation || "",

                // Valeurs par défaut pour les autres sources d'électricité
                dispose_petrole_lampant: false,
                effectif_menages_petrole_lampant: "",
                observation_petrole_lampant: "",

                dispose_autre_source_electricite: false,
                nom_autre_source_electricite: "",
                effectif_beneficiaires_autre_source_electricite: "",
                observation_autre_source_electricite: "",

                // c_titrisation_fonciere
                existence_bif: commune.titrisation_fonciere?.existence_bif ? "true" : "false",
                date_ouverture: commune.titrisation_fonciere?.date_ouverture || "",
                effectif_demande: commune.titrisation_fonciere?.effectif_demande || "",
                effectif_titres: commune.titrisation_fonciere?.effectif_titres || "",
                effectif_certificats: commune.titrisation_fonciere?.effectif_certificats || "",

                // c_securite - Gendarmerie
                dispose_poste_fixe_gn: commune.securite?.gendarmerie?.poste_fixe?.dispose || false,
                effectif_poste_fixe_gn: commune.securite?.gendarmerie?.poste_fixe?.effectif || "",
                effectif_personnels_poste_fixe_gn: commune.securite?.gendarmerie?.poste_fixe?.effectif_personnels || "",
                observation_poste_fixe_gn: commune.securite?.gendarmerie?.poste_fixe?.observation || "",

                dispose_brigade_gn: commune.securite?.gendarmerie?.brigade?.dispose || false,
                effectif_brigade_gn: commune.securite?.gendarmerie?.brigade?.effectif || "",
                effectif_personnels_brigade_gn: commune.securite?.gendarmerie?.brigade?.effectif_personnels || "",
                observation_brigade_gn: commune.securite?.gendarmerie?.brigade?.observation || "",

                // Valeurs par défaut pour poste avancée gendarmerie
                dispose_poste_avancee_gn: false,
                effectif_poste_avancee_gn: "",
                effectif_personnels_poste_avancee_gn: "",
                observation_poste_avancee_gn: "",

                // c_securite - Police
                dispose_commissariat_pn: commune.securite?.police?.commissariat?.dispose || false,
                effectif_commissariat_pn: commune.securite?.police?.commissariat?.effectif || "",
                effectif_personnels_commissariat_pn: commune.securite?.police?.commissariat?.effectif_personnels || "",
                observation_commissariat_pn: commune.securite?.police?.commissariat?.observation || "",

                // Valeurs par défaut pour les autres services de sécurité
                dispose_das: false,
                effectif_das: "",
                effectif_personnels_das: "",
                observation_das: "",

                dispose_autre_bureau: false,
                nom_autre_bureau: "",
                effectif_autre_bureau: "",
                effectif_personnels_autre_bureau: "",
                observation_autre_bureau: "",

                // c_situation_economique
                dispose_agriculture: commune.situation_economique?.agriculture?.dispose || false,
                effectif_personnes_agriculture: commune.situation_economique?.agriculture?.effectif_personnes || "",
                effectif_entreprises_agriculture: commune.situation_economique?.agriculture?.effectif_entreprises || "",
                type_produit_phare_agriculture: commune.situation_economique?.agriculture?.type_produit_phare || "",
                quantites_produites_agriculture: commune.situation_economique?.agriculture?.quantites_produites || "",
                observation_agriculture: commune.situation_economique?.agriculture?.observation || "",

                dispose_elevage: commune.situation_economique?.elevage?.dispose || false,
                effectif_personnes_elevage: commune.situation_economique?.elevage?.effectif_personnes || "",
                effectif_entreprises_elevage: commune.situation_economique?.elevage?.effectif_entreprises || "",
                type_produit_phare_elevage: commune.situation_economique?.elevage?.type_produit_phare || "",
                quantites_produites_elevage: commune.situation_economique?.elevage?.quantites_produites || "",
                observation_elevage: commune.situation_economique?.elevage?.observation || "",

                dispose_peche: commune.situation_economique?.peche?.dispose || false,
                effectif_personnes_peche: commune.situation_economique?.peche?.effectif_personnes || "",
                effectif_entreprises_peche: commune.situation_economique?.peche?.effectif_entreprises || "",
                type_produit_phare_peche: commune.situation_economique?.peche?.type_produit_phare || "",
                quantites_produites_peche: commune.situation_economique?.peche?.quantites_produites || "",
                observation_peche: commune.situation_economique?.peche?.observation || "",

                // Valeurs par défaut pour les autres secteurs économiques
                dispose_tourisme: false,
                nombre_visiteurs_tourisme: "",
                type_service_tourisme: "",
                observation_tourisme: "",

                dispose_exploitation_miniere: false,
                effectif_personnes_exploitation_miniere: "",
                effectif_entreprises_exploitation_miniere: "",
                type_produit_phare_exploitation_miniere: "",
                quantites_produites_exploitation_miniere: "",
                observation_exploitation_miniere: "",

                dispose_industrie: false,
                effectif_personnes_industrie: "",
                effectif_entreprises_industrie: "",
                type_produit_phare_industrie: "",
                quantites_produites_industrie: "",
                observation_industrie: "",

                dispose_artisanat: false,
                effectif_personnes_artisanat: "",
                effectif_entreprises_artisanat: "",
                type_produit_phare_artisanat: "",
                quantites_produites_artisanat: "",
                observation_artisanat: "",

                dispose_commerce: false,
                effectif_personnes_commerce: "",
                effectif_entreprises_commerce: "",
                type_produit_phare_commerce: "",
                quantites_produites_commerce: "",
                observation_commerce: "",

                dispose_autre_ressource: false,
                nom_autre_ressource: "",
                effectif_personnes_autre_ressource: "",
                effectif_entreprises_autre_ressource: "",
                type_produit_phare_autre_ressource: "",
                quantites_produites_autre_ressource: "",
                observation_autre_ressource: "",

                dispose_marche: commune.situation_economique?.infrastructures?.dispose_marche || false,
                dispose_barrage_hydraulique: commune.situation_economique?.infrastructures?.dispose_barrage_hydraulique || false,
                dispose_abattoirs: commune.situation_economique?.infrastructures?.dispose_abattoirs || false,
                accessibilite_routes: commune.situation_economique?.infrastructures?.accessibilite_routes || false,

                // c_environnement
                existence_grc: commune.environnement?.existence_grc || false,
                realisation_filtrations: commune.environnement?.realisation_filtrations || false,
                realisation_protection: commune.environnement?.realisation_protection || false,

                // c_gouvernance
                existence_slc: commune.gouvernance?.existence_slc || false,
                existence_outils_planification: commune.gouvernance?.existence_outils_planification || false,
                existence_pdl2: commune.gouvernance?.existence_pdl2 || false,
                soumission_actes: commune.gouvernance?.soumission_actes || false,
                existence_association_jeunes: commune.gouvernance?.existence_association_jeunes || false,
                existence_association_femmes: commune.gouvernance?.existence_association_femmes || false,
                autoevaluation_igl: commune.gouvernance?.autoevaluation_igl || false,
                note_aeigl: commune.gouvernance?.note_aeigl || "",
                note_pilier_a: commune.gouvernance?.note_pilier_a || "",
                note_pilier_b: commune.gouvernance?.note_pilier_b || "",
                note_pilier_c: commune.gouvernance?.note_pilier_c || "",
                note_pilier_d: commune.gouvernance?.note_pilier_d || "",
                note_scoring_moc: "",
                note_scoring_mr: "",
                note_scoring_cgf: "",
                note_scoring_ec: "",
                note_scoring_grh: "",
            });
        }
    }, [commune]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type} = e.target;
        let newValue: string | number | boolean = value;

        if (type === "number") {
            newValue = value === "" ? "" : parseFloat(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = session?.user?.token || "";


            const apiData: Record<string, string | number | boolean> = {};


            Object.keys(formData).forEach(key => {
                const value = formData[key];
                if (typeof value === 'number' || (typeof value === 'string' && value !== '')) {
                    apiData[key] = value;
                } else if (typeof value === 'boolean') {
                    apiData[key] = value;
                }
            });

            const result = await updateCommune(
                commune.id_situation_geographique,
                apiData,
                token
            );

            if (result.success) {
                onSave();
                onClose();
            } else {
                throw new Error(result.message || "Erreur lors de la mise à jour");
            }
        } catch (err: unknown) {
            console.error(err);
            setError((err as Error).message || "Erreur inattendue");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInput = (label: string, name: string, type = "text") => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                step={type === "number" ? "any" : undefined}
                value={formData[name] !== undefined && formData[name] !== null ? String(formData[name]) : ""}
                onChange={handleChange}
                className="w-full"
            />
        </div>
    );

    const renderSelect = (label: string, name: string, options: { value: string, label: string }[]) => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Select
                value={String(formData[name] || "")}
                onValueChange={(value) => handleSelectChange(name, value)}
            >
                <SelectTrigger id={name} className="w-full">
                    <SelectValue placeholder="Sélectionner"/>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    const renderSwitch = (label: string, name: string) => (
        <div className="flex items-center justify-between">
            <Label htmlFor={name} className="pr-2">{label}</Label>
            <Switch
                id={name}
                checked={!!formData[name]}
                onCheckedChange={(checked) => handleSwitchChange(name, checked)}
            />
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Modifier la commune - ID: {commune.id_situation_geographique}</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4 border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-4">
                            <TabsTrigger value="situation-geo">Situation Géographique</TabsTrigger>
                            <TabsTrigger value="personnel">Personnel</TabsTrigger>
                            <TabsTrigger value="services">Services & Équipements</TabsTrigger>
                            <TabsTrigger value="socio-eco">Socio-économique</TabsTrigger>
                        </TabsList>


                        <TabsContent value="situation-geo" className="space-y-6">
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Informations de Base</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Utilité commune", "util_commune")}
                                    {renderInput("Superficie (km²)", "superficie", "number")}
                                    {renderInput("Nord", "nord")}
                                    {renderInput("Sud", "sud")}
                                    {renderInput("Est", "est")}
                                    {renderInput("Ouest", "ouest")}
                                </div>
                            </div>
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Localisation</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Province", "province")}
                                    {renderInput("Région", "region")}
                                    {renderInput("District", "district")}
                                    {renderInput("Commune", "commune")}
                                    {renderSelect("Catégorie commune", "categorie_commune", [
                                        {value: "Urbaine", label: "Urbaine"},
                                        {value: "Rurale", label: "Rurale"}
                                    ])}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Coordonnées Géographiques</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Latitude", "latitude", "number")}
                                    {renderInput("Longitude", "longitude", "number")}
                                    {renderInput("Altitude", "altitude", "number")}
                                    {renderInput("GPS de la commune", "gps_de_la_commune", "number")}
                                    {renderInput("Distance chef-lieu district (km)", "distance_chef_lieu_district", "number")}
                                    {renderInput("Distance chef-lieu région (km)", "distance_chef_lieu_region", "number")}
                                    {renderInput("Précision", "precision", "number")}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-3">Informations de la Commune</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderSwitch("Dispose d'un bureau", "dispose_bureau")}
                                    {renderInput("Type d'occupation", "type_occupation")}
                                    {renderInput("Année de construction", "annee_construction", "number")}
                                    {renderInput("Année dernière réhabilitation", "annee_derniere_rehabilitation", "number")}
                                    {renderInput("Autre", "autre")}
                                    {renderSelect("État actuel", "etat_actuel", [
                                        {value: "Bon", label: "Bon"},
                                        {value: "Moyen", label: "Moyen"},
                                        {value: "Mauvais", label: "Mauvais"}
                                    ])}
                                    {renderInput("Nombre de salles", "nombre_salles", "number")}
                                    {renderInput("Effectif personnel", "effectif_personnel", "number")}
                                    {renderInput("Effectif hommes", "effectif_hommes_info", "number")}
                                    {renderInput("Effectif femmes", "effectif_femmes_info", "number")}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="personnel" className="space-y-6">
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Maire</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_maire")}
                                    {renderSelect("Sexe", "sexe_maire", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_maire")}
                                    {renderInput("Nombre de mandats", "nombre_mandats_maire", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_maire")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_maire")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_maire")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">1er Adjoint</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_1er_adjoint")}
                                    {renderSelect("Sexe", "sexe_1er_adjoint", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_1er_adjoint")}
                                    {renderInput("Nombre de mandats", "nombre_mandats_1er_adjoint", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_1er_adjoint")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_1er_adjoint")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_1er_adjoint")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">2ième Adjoint</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_2ieme_adjoint")}
                                    {renderSelect("Sexe", "sexe_2ieme_adjoint", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_2ieme_adjoint")}
                                    {renderInput("Nombre de mandats", "nombre_mandats_2ieme_adjoint", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_2ieme_adjoint")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_2ieme_adjoint")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_2ieme_adjoint")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">3ième Adjoint</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_3ieme_adjoint")}
                                    {renderSelect("Sexe", "sexe_3ieme_adjoint", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_3ieme_adjoint")}
                                    {renderInput("Nombre de mandats", "nombre_mandats_3ieme_adjoint", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_3ieme_adjoint")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_3ieme_adjoint")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_3ieme_adjoint")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Président du Conseil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_president_conseil")}
                                    {renderSelect("Sexe", "sexe_president_conseil", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_president_conseil")}
                                    {renderInput("Nombre de mandats", "nombre_mandats_president_conseil", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_president_conseil")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_president_conseil")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_president_conseil")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Secrétaire Général</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_secretaire_general")}
                                    {renderSelect("Sexe", "sexe_secretaire_general", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_secretaire_general")}
                                    {renderInput("Années effectuées", "annees_effectuees_secretaire_general", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_secretaire_general")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_secretaire_general")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_secretaire_general")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Secrétaire État Civil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_secretaire_etat_civil")}
                                    {renderSelect("Sexe", "sexe_secretaire_etat_civil", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_secretaire_etat_civil")}
                                    {renderInput("Années effectuées", "annees_effectuees_secretaire_etat_civil", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_secretaire_etat_civil")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_secretaire_etat_civil")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_secretaire_etat_civil")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Secrétaire Administratif</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_secretaire_administratif")}
                                    {renderSelect("Sexe", "sexe_secretaire_administratif", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_secretaire_administratif")}
                                    {renderInput("Années effectuées", "annees_effectuees_secretaire_administratif", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_secretaire_administratif")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_secretaire_administratif")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_secretaire_administratif")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Trésorier</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_tresorier")}
                                    {renderSelect("Sexe", "sexe_tresorier", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_tresorier")}
                                    {renderInput("Années effectuées", "annees_effectuees_tresorier", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_tresorier")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_tresorier")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_tresorier")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Agent de Développement</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_agent_developpement")}
                                    {renderSelect("Sexe", "sexe_agent_developpement", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_agent_developpement")}
                                    {renderInput("Années effectuées", "annees_effectuees_agent_developpement", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_agent_developpement")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_agent_developpement")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_agent_developpement")}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-3">Agent BIF</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom et prénoms", "nom_prenoms_agent_bif")}
                                    {renderSelect("Sexe", "sexe_agent_bif", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "telephone_agent_bif")}
                                    {renderInput("Années effectuées", "annees_effectuees_agent_bif", "number")}
                                    {renderInput("Statut d'emploi", "statut_emploi_agent_bif")}
                                    {renderInput("Niveau d'instruction", "niveau_instruction_agent_bif")}
                                    {renderInput("Diplôme élevé", "diplome_eleve_agent_bif")}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="services" className="space-y-6">
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Outils Informatiques</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderSwitch("Dispose d'outils", "dispose_outils")}
                                    {renderInput("Nombre d'ordinateurs", "nombre_ordinateurs", "number")}
                                    {renderInput("Nombre d'imprimantes", "nombre_imprimantes", "number")}
                                    {renderSwitch("Dispose d'internet", "dispose_internet")}
                                    {renderInput("Principale connexion", "principale_connexion")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Services Techniques</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderSwitch("Agriculture/Élevage", "agriculture_elevage")}
                                    {renderSwitch("Pêche", "peche")}
                                    {renderSwitch("CAA", "caa")}
                                    {renderSwitch("Gendarmerie", "gendarmerie")}
                                    {renderSwitch("Sécurité Publique", "securite_publique")}
                                    {renderSwitch("Force Armée", "force_armee")}
                                    {renderSwitch("Environnement", "environnement")}
                                    {renderSwitch("Éducation", "education")}
                                    {renderSwitch("Santé", "sante")}
                                    {renderSwitch("Travaux Publics", "travaux_publics")}
                                    {renderSwitch("Aménagement du Territoire/Foncier", "amenagement_territoire_foncier")}
                                    {renderSwitch("Population/Services", "population_services")}
                                    {renderSwitch("Justice", "justice")}
                                    {renderSwitch("Économie/Finance", "economie_finance")}
                                    {renderSwitch("Poste/Télécommunication", "poste_telecommunication")}
                                    {renderSwitch("Jeunesse/Sport", "jeunesse_sport")}
                                    {renderSwitch("Tourisme", "tourisme")}
                                    {renderSwitch("Énergie", "energie")}
                                    {renderSwitch("Autre service", "autre_service")}
                                    {renderInput("Détails autres", "autre_details")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Situation Démographique</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Effectif total", "effectif_total_demo", "number")}
                                    {renderInput("Effectif hommes", "effectif_hommes_demo", "number")}
                                    {renderInput("Effectif femmes", "effectif_femmes_demo", "number")}
                                    {renderInput("Effectif moins de 5 ans", "effectif_moins_5_ans", "number")}
                                    {renderInput("Effectif 6-17 ans", "effectif_6_17_ans", "number")}
                                    {renderInput("Effectif 18-60 ans", "effectif_18_60_ans", "number")}
                                    {renderInput("Effectif 60 ans et plus", "effectif_60_plus", "number")}
                                    {renderInput("Somme âge 1", "somme_age1", "number")}
                                    {renderInput("Effectif total ménages", "effectif_total_menages", "number")}
                                    {renderInput("Effectif handicapés", "effectif_handicap", "number")}
                                    {renderInput("Effectif naissances", "effectif_naissance", "number")}
                                    {renderInput("Effectif actes de naissance", "effectif_acte_naissance", "number")}
                                    {renderInput("Effectif décès", "effectif_deces", "number")}
                                    {renderInput("Effectif mariages", "effectif_mariage", "number")}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-3">Titrisation Foncière</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderSelect("Existence BIF", "existence_bif", [
                                        {value: "true", label: "Oui"},
                                        {value: "false", label: "Non"}
                                    ])}
                                    {renderInput("Date d'ouverture", "date_ouverture", "date")}
                                    {renderInput("Effectif demandes", "effectif_demande", "number")}
                                    {renderInput("Effectif titres", "effectif_titres", "number")}
                                    {renderInput("Effectif certificats", "effectif_certificats", "number")}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="socio-eco" className="space-y-6">
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Centres de Santé</h3>
                                <div className="space-y-4">
                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">CSB1</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose CSB1", "dispose_csb1")}
                                            {renderInput("Effectif total", "effectif_total_csb1", "number")}
                                            {renderInput("Effectif formation", "effectif_formation_csb1", "number")}
                                            {renderInput("Effectif soins", "effectif_soins_csb1", "number")}
                                            {renderInput("Nombre services", "nombre_services_csb1", "number")}
                                            {renderInput("Nombre patients moyen", "nombre_patients_moyen_csb1", "number")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">CSB2</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose CSB2", "dispose_csb2")}
                                            {renderInput("Effectif total", "effectif_total_csb2", "number")}
                                            {renderInput("Effectif formation", "effectif_formation_csb2", "number")}
                                            {renderInput("Effectif soins", "effectif_soins_csb2", "number")}
                                            {renderInput("Nombre services", "nombre_services_csb2", "number")}
                                            {renderInput("Nombre patients moyen", "nombre_patients_moyen_csb2", "number")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">CHRD</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose CHRD", "dispose_chrd")}
                                            {renderInput("Effectif total", "effectif_total_chrd", "number")}
                                            {renderInput("Effectif formation", "effectif_formation_chrd", "number")}
                                            {renderInput("Effectif soins", "effectif_soins_chrd", "number")}
                                            {renderInput("Nombre services", "nombre_services_chrd", "number")}
                                            {renderInput("Nombre patients moyen", "nombre_patients_moyen_chrd", "number")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Établissements Éducatifs</h3>
                                <div className="space-y-4">
                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Primaire</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose école primaire", "dispose_ecole_primaire")}
                                            {renderInput("Effectif écoles", "effectif_ecoles_primaires", "number")}
                                            {renderInput("Effectif privées", "effectif_ecoles_primaires_privees", "number")}
                                            {renderInput("Effectif publiques", "effectif_ecoles_primaires_publiques", "number")}
                                            {renderInput("Élèves privé", "effectif_eleves_primaire_prive", "number")}
                                            {renderInput("Élèves public", "effectif_eleves_primaire_public", "number")}
                                            {renderInput("Élèves masculins", "effectif_eleves_primaire_masculins", "number")}
                                            {renderInput("Élèves féminins", "effectif_eleves_primaire_feminins", "number")}
                                            {renderInput("Enseignants", "effectif_enseignants_primaire", "number")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Collège</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose collège", "dispose_college")}
                                            {renderInput("Effectif collèges", "effectif_colleges", "number")}
                                            {renderInput("Effectif privées", "effectif_colleges_privees", "number")}
                                            {renderInput("Effectif publiques", "effectif_colleges_publiques", "number")}
                                            {renderInput("Élèves privé", "effectif_eleves_college_prive", "number")}
                                            {renderInput("Élèves public", "effectif_eleves_college_public", "number")}
                                            {renderInput("Élèves masculins", "effectif_eleves_college_masculins", "number")}
                                            {renderInput("Élèves féminins", "effectif_eleves_college_feminins", "number")}
                                            {renderInput("Enseignants", "effectif_enseignants_college", "number")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Lycée</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose lycée", "dispose_lycee")}
                                            {renderInput("Effectif lycées", "effectif_lycees", "number")}
                                            {renderInput("Effectif privées", "effectif_lycees_privees", "number")}
                                            {renderInput("Effectif publiques", "effectif_lycees_publiques", "number")}
                                            {renderInput("Élèves privé", "effectif_eleves_lycee_prive", "number")}
                                            {renderInput("Élèves public", "effectif_eleves_lycee_public", "number")}
                                            {renderInput("Élèves masculins", "effectif_eleves_lycee_masculins", "number")}
                                            {renderInput("Élèves féminins", "effectif_eleves_lycee_feminins", "number")}
                                            {renderInput("Enseignants", "effectif_enseignants_lycee", "number")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Eau, Assainissement et Électricité</h3>
                                <div className="space-y-4">
                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Sources d&#39;Eau</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Borne fontaine", "dispose_borne_fontaine")}
                                            {renderInput("Effectif bornes", "effectif_borne_fontaine", "number")}
                                            {renderInput("Bénéficiaires bornes", "effectif_beneficiaires_borne_fontaine", "number")}
                                            {renderInput("Observation bornes", "observation_borne_fontaine")}

                                            {renderSwitch("Forage", "dispose_forage")}
                                            {renderInput("Effectif forages", "effectif_forage", "number")}
                                            {renderInput("Bénéficiaires forages", "effectif_beneficiaires_forage", "number")}
                                            {renderInput("Observation forages", "observation_forage")}

                                            {renderSwitch("Puits", "dispose_puits")}
                                            {renderInput("Effectif puits", "effectif_puits", "number")}
                                            {renderInput("Bénéficiaires puits", "effectif_beneficiaires_puits", "number")}
                                            {renderInput("Observation puits", "observation_puits")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Sources d&#39;Électricité</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Électricité", "dispose_electricite")}
                                            {renderInput("Ménages électricité", "effectif_menages_electricite", "number")}
                                            {renderInput("Observation électricité", "observation_electricite")}

                                            {renderSwitch("Panneau solaire", "dispose_panneau_solaire")}
                                            {renderInput("Ménages solaire", "effectif_menages_panneau_solaire", "number")}
                                            {renderInput("Observation solaire", "observation_panneau_solaire")}

                                            {renderSwitch("Groupe électrogène", "dispose_groupe_electrogene")}
                                            {renderInput("Bénéficiaires groupe", "effectif_beneficiaires_groupe_electrogene", "number")}
                                            {renderInput("Observation groupe", "observation_groupe_electrogene")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Sécurité</h3>
                                <div className="space-y-4">
                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Gendarmerie</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Poste fixe GN", "dispose_poste_fixe_gn")}
                                            {renderInput("Effectif postes fixes", "effectif_poste_fixe_gn", "number")}
                                            {renderInput("Personnel postes fixes", "effectif_personnels_poste_fixe_gn", "number")}
                                            {renderInput("Observation postes fixes", "observation_poste_fixe_gn")}

                                            {renderSwitch("Poste avancé GN", "dispose_poste_avancee_gn")}
                                            {renderInput("Effectif postes avancés", "effectif_poste_avancee_gn", "number")}
                                            {renderInput("Personnel postes avancés", "effectif_personnels_poste_avancee_gn", "number")}
                                            {renderInput("Observation postes avancés", "observation_poste_avancee_gn")}

                                            {renderSwitch("Brigade GN", "dispose_brigade_gn")}
                                            {renderInput("Effectif brigades", "effectif_brigade_gn", "number")}
                                            {renderInput("Personnel brigades", "effectif_personnels_brigade_gn", "number")}
                                            {renderInput("Observation brigades", "observation_brigade_gn")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Police Nationale</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Commissariat PN", "dispose_commissariat_pn")}
                                            {renderInput("Effectif commissariats", "effectif_commissariat_pn", "number")}
                                            {renderInput("Personnel commissariats", "effectif_personnels_commissariat_pn", "number")}
                                            {renderInput("Observation commissariats", "observation_commissariat_pn")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Autres Services</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("DAS", "dispose_das")}
                                            {renderInput("Effectif DAS", "effectif_das", "number")}
                                            {renderInput("Personnel DAS", "effectif_personnels_das", "number")}
                                            {renderInput("Observation DAS", "observation_das")}

                                            {renderSwitch("Autre bureau", "dispose_autre_bureau")}
                                            {renderInput("Nom autre bureau", "nom_autre_bureau")}
                                            {renderInput("Effectif autre bureau", "effectif_autre_bureau", "number")}
                                            {renderInput("Personnel autre bureau", "effectif_personnels_autre_bureau", "number")}
                                            {renderInput("Observation autre bureau", "observation_autre_bureau")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Situation Économique</h3>
                                <div className="space-y-4">
                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Agriculture</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose agriculture", "dispose_agriculture")}
                                            {renderInput("Effectif personnes", "effectif_personnes_agriculture", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_agriculture", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_agriculture")}
                                            {renderInput("Quantités produites", "quantites_produites_agriculture", "number")}
                                            {renderInput("Observation", "observation_agriculture")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Élevage</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose élevage", "dispose_elevage")}
                                            {renderInput("Effectif personnes", "effectif_personnes_elevage", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_elevage", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_elevage")}
                                            {renderInput("Quantités produites", "quantites_produites_elevage", "number")}
                                            {renderInput("Observation", "observation_elevage")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Pêche</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose pêche", "dispose_peche")}
                                            {renderInput("Effectif personnes", "effectif_personnes_peche", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_peche", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_peche")}
                                            {renderInput("Quantités produites", "quantites_produites_peche", "number")}
                                            {renderInput("Observation", "observation_peche")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Tourisme</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose tourisme", "dispose_tourisme")}
                                            {renderInput("Nombre visiteurs", "nombre_visiteurs_tourisme", "number")}
                                            {renderInput("Type service", "type_service_tourisme")}
                                            {renderInput("Observation", "observation_tourisme")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Exploitation Minière</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose exploitation minière", "dispose_exploitation_miniere")}
                                            {renderInput("Effectif personnes", "effectif_personnes_exploitation_miniere", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_exploitation_miniere", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_exploitation_miniere")}
                                            {renderInput("Quantités produites", "quantites_produites_exploitation_miniere", "number")}
                                            {renderInput("Observation", "observation_exploitation_miniere")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Industrie</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose industrie", "dispose_industrie")}
                                            {renderInput("Effectif personnes", "effectif_personnes_industrie", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_industrie", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_industrie")}
                                            {renderInput("Quantités produites", "quantites_produites_industrie", "number")}
                                            {renderInput("Observation", "observation_industrie")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Artisanat</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose artisanat", "dispose_artisanat")}
                                            {renderInput("Effectif personnes", "effectif_personnes_artisanat", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_artisanat", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_artisanat")}
                                            {renderInput("Quantités produites", "quantites_produites_artisanat", "number")}
                                            {renderInput("Observation", "observation_artisanat")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Commerce</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose commerce", "dispose_commerce")}
                                            {renderInput("Effectif personnes", "effectif_personnes_commerce", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_commerce", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_commerce")}
                                            {renderInput("Quantités produites", "quantites_produites_commerce", "number")}
                                            {renderInput("Observation", "observation_commerce")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Autre Ressource</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose autre ressource", "dispose_autre_ressource")}
                                            {renderInput("Nom autre ressource", "nom_autre_ressource")}
                                            {renderInput("Effectif personnes", "effectif_personnes_autre_ressource", "number")}
                                            {renderInput("Effectif entreprises", "effectif_entreprises_autre_ressource", "number")}
                                            {renderInput("Type produit phare", "type_produit_phare_autre_ressource")}
                                            {renderInput("Quantités produites", "quantites_produites_autre_ressource", "number")}
                                            {renderInput("Observation", "observation_autre_ressource")}
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded">
                                        <h4 className="font-medium mb-2">Infrastructures</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderSwitch("Dispose marché", "dispose_marche")}
                                            {renderSwitch("Dispose barrage hydraulique", "dispose_barrage_hydraulique")}
                                            {renderSwitch("Dispose abattoirs", "dispose_abattoirs")}
                                            {renderSwitch("Accessibilité routes", "accessibilite_routes")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Environnement</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderSwitch("Existence GRC", "existence_grc")}
                                    {renderSwitch("Réalisation filtrations", "realisation_filtrations")}
                                    {renderSwitch("Réalisation protection", "realisation_protection")}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-3">Gouvernance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderSwitch("Existence SLC", "existence_slc")}
                                    {renderSwitch("Existence outils planification", "existence_outils_planification")}
                                    {renderSwitch("Existence PDL2", "existence_pdl2")}
                                    {renderSwitch("Soumission actes", "soumission_actes")}
                                    {renderSwitch("Existence association jeunes", "existence_association_jeunes")}
                                    {renderSwitch("Existence association femmes", "existence_association_femmes")}
                                    {renderSwitch("Auto-évaluation IGL", "autoevaluation_igl")}
                                    {renderInput("Note AEIGL", "note_aeigl")}
                                    {renderInput("Note pilier A", "note_pilier_a", "number")}
                                    {renderInput("Note pilier B", "note_pilier_b", "number")}
                                    {renderInput("Note pilier C", "note_pilier_c", "number")}
                                    {renderInput("Note pilier D", "note_pilier_d", "number")}
                                    {renderInput("Note scoring MOC", "note_scoring_moc", "number")}
                                    {renderInput("Note scoring MR", "note_scoring_mr", "number")}
                                    {renderInput("Note scoring CGF", "note_scoring_cgf", "number")}
                                    {renderInput("Note scoring EC", "note_scoring_ec", "number")}
                                    {renderInput("Note scoring GRH", "note_scoring_grh", "number")}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
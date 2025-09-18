"use client";

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
//reutilisable
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";
import {Input} from "@/components/ui/atomes/input";
import {Label} from "@/components/ui/atomes/label";
import {Button} from "@/components/ui/atomes/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Switch} from "@/components/ui/atomes/switch";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";

//fonctionalite
import {Region} from "@/services/types/dbregion.type";
import {dbregionApi} from "@/services/api/region/get-dbregion.api";

// Interface pour les données du formulaire
interface RegionFormData {
    // Informations de base de la région
    id?: number;
    region_nom: string;
    region_situee_nord: string;
    region_situee_sud: string;
    region_situee_ouest: string;
    region_situee_est: string;
    effectif_commune: number | string;
    effectif_district: number | string;
    superficie_region_km2: number | string;

    // Gouvernance
    src_operationnelle: boolean;
    srat_a_jour: boolean;
    volet_changement_climatique: boolean;
    prd_a_jour: boolean;
    acces_plateforme_web: boolean;
    etat_realisation_budget: string;

    // Environnement
    structure_gestion_risques: boolean;

    // Staff de la région
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

    // Staff CROC
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

    // Indicateurs sectoriels
    taux_acces_eau_base: number | string;
    taux_acces_assainissement_base: number | string;
    nombre_commune_odf: number | string;
    taux_acces_electricite: number | string;
    effectif_certificats_fonciers_distribues: number | string;
    effectif_titres_cadastres_distribues: number | string;
    taux_brut_scolarisation_primaire: number | string;
    taux_abandon_scolaire_primaire: number | string;
    ratio_fs_fonctionnel_population: number | string;
    ratio_personnel_sante_population: number | string;
    taux_malnutrition_aigue: number | string;
    taux_insecurite_alimentaire: number | string;
    nombre_beneficiaire_filet_securite_sociale: number | string;
    culture_phare: boolean;
    culture_phare_details: string;
    rendement_culture_ha: number | string;
    elevage_phare: boolean;
    elevage_phare_details: string;
    nombre_tete_elevage: number | string;
    produit_halieutique_phare: boolean;
    produit_halieutique_details: string;
    production_halieutique_tonnes: number | string;
    nombre_entreprises_region: number | string;

    [key: string]: string | number | boolean | null | undefined; // Index signature pour accès dynamique
}

interface Props {
    region: Region;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function EditRegionForm({region, isOpen, onClose, onSave}: Props) {
    const {data: session} = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<RegionFormData>({} as RegionFormData);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("info-base");

    useEffect(() => {
        if (region) {
            // Extraction des données de la région pour initialiser le formulaire
            const {
                id_situation_geographique,
                region_nom,
                region_situee_nord,
                region_situee_sud,
                region_situee_ouest,
                region_situee_est,
                effectif_commune,
                effectif_district,
                superficie_region_km2,
                gouvernance_region,
                environnement_region,
                staff_region,
                staff_croc_region,
                indicateurs_sectoriels
            } = region;

            setFormData({
                // Infos de base
                id: id_situation_geographique,
                region_nom: region_nom || "",
                region_situee_nord: region_situee_nord || "",
                region_situee_sud: region_situee_sud || "",
                region_situee_ouest: region_situee_ouest || "",
                region_situee_est: region_situee_est || "",
                effectif_commune: effectif_commune || "",
                effectif_district: effectif_district || "",
                superficie_region_km2: superficie_region_km2 || "",

                // Gouvernance
                src_operationnelle: gouvernance_region?.src_operationnelle || false,
                srat_a_jour: gouvernance_region?.srat_a_jour || false,
                volet_changement_climatique: gouvernance_region?.volet_changement_climatique || false,
                prd_a_jour: gouvernance_region?.prd_a_jour || false,
                acces_plateforme_web: gouvernance_region?.acces_plateforme_web || false,
                etat_realisation_budget: gouvernance_region?.etat_realisation_budget || "",

                // Environnement
                structure_gestion_risques: environnement_region?.structure_gestion_risques || false,

                // Staff de la région
                gouverneur_nom: staff_region?.gouverneur_nom || "",
                gouverneur_sexe: staff_region?.gouverneur_sexe || "",
                gouverneur_telephone: staff_region?.gouverneur_telephone || "",
                gouverneur_statut_emploi: staff_region?.gouverneur_statut_emploi || "",
                gouverneur_niveau_instruction: staff_region?.gouverneur_niveau_instruction || "",
                gouverneur_diplome: staff_region?.gouverneur_diplome || "",
                gouverneur_statut: staff_region?.gouverneur_statut || false,

                secretaire_nom: staff_region?.secretaire_nom || "",
                secretaire_sexe: staff_region?.secretaire_sexe || "",
                secretaire_telephone: staff_region?.secretaire_telephone || "",
                secretaire_statut_emploi: staff_region?.secretaire_statut_emploi || "",
                secretaire_niveau_instruction: staff_region?.secretaire_niveau_instruction || "",
                secretaire_diplome: staff_region?.secretaire_diplome || "",
                secretaire_statut: staff_region?.secretaire_statut || false,

                directeur_cabinet_nom: staff_region?.directeur_cabinet_nom || "",
                directeur_cabinet_sexe: staff_region?.directeur_cabinet_sexe || "",
                directeur_cabinet_telephone: staff_region?.directeur_cabinet_telephone || "",
                directeur_cabinet_statut_emploi: staff_region?.directeur_cabinet_statut_emploi || "",
                directeur_cabinet_niveau_instruction: staff_region?.directeur_cabinet_niveau_instruction || "",
                directeur_cabinet_diplome: staff_region?.directeur_cabinet_diplome || "",
                directeur_cabinet_statut: staff_region?.directeur_cabinet_statut || false,

                daf_nom: staff_region?.daf_nom || "",
                daf_sexe: staff_region?.daf_sexe || "",
                daf_telephone: staff_region?.daf_telephone || "",
                daf_statut_emploi: staff_region?.daf_statut_emploi || "",
                daf_niveau_instruction: staff_region?.daf_niveau_instruction || "",
                daf_diplome: staff_region?.daf_diplome || "",
                daf_statut: staff_region?.daf_statut || false,

                directeur_admin_nom: staff_region?.directeur_admin_nom || "",
                directeur_admin_sexe: staff_region?.directeur_admin_sexe || "",
                directeur_admin_telephone: staff_region?.directeur_admin_telephone || "",
                directeur_admin_statut_emploi: staff_region?.directeur_admin_statut_emploi || "",
                directeur_admin_niveau_instruction: staff_region?.directeur_admin_niveau_instruction || "",
                directeur_admin_diplome: staff_region?.directeur_admin_diplome || "",
                directeur_admin_statut: staff_region?.directeur_admin_statut || false,

                directeur_infra_nom: staff_region?.directeur_infra_nom || "",
                directeur_infra_sexe: staff_region?.directeur_infra_sexe || "",
                directeur_infra_telephone: staff_region?.directeur_infra_telephone || "",
                directeur_infra_statut_emploi: staff_region?.directeur_infra_statut_emploi || "",
                directeur_infra_niveau_instruction: staff_region?.directeur_infra_niveau_instruction || "",
                directeur_infra_diplome: staff_region?.directeur_infra_diplome || "",
                directeur_infra_statut: staff_region?.directeur_infra_statut || false,

                // Staff CROC
                documentaliste_nom: staff_croc_region?.documentaliste_nom || "",
                documentaliste_sexe: staff_croc_region?.documentaliste_sexe || "",
                documentaliste_telephone: staff_croc_region?.documentaliste_telephone || "",
                documentaliste_statut_emploi: staff_croc_region?.documentaliste_statut_emploi || "",
                documentaliste_niveau_instruction: staff_croc_region?.documentaliste_niveau_instruction || "",
                documentaliste_diplome: staff_croc_region?.documentaliste_diplome || "",
                documentaliste_statut: staff_croc_region?.documentaliste_statut || false,

                responsable_bdd_nom: staff_croc_region?.responsable_bdd_nom || "",
                responsable_bdd_sexe: staff_croc_region?.responsable_bdd_sexe || "",
                responsable_bdd_telephone: staff_croc_region?.responsable_bdd_telephone || "",
                responsable_bdd_statut_emploi: staff_croc_region?.responsable_bdd_statut_emploi || "",
                responsable_bdd_niveau_instruction: staff_croc_region?.responsable_bdd_niveau_instruction || "",
                responsable_bdd_diplome: staff_croc_region?.responsable_bdd_diplome || "",
                responsable_bdd_statut: staff_croc_region?.responsable_bdd_statut || false,

                responsable_comm_nom: staff_croc_region?.responsable_comm_nom || "",
                responsable_comm_sexe: staff_croc_region?.responsable_comm_sexe || "",
                responsable_comm_telephone: staff_croc_region?.responsable_comm_telephone || "",
                responsable_comm_statut_emploi: staff_croc_region?.responsable_comm_statut_emploi || "",
                responsable_comm_niveau_instruction: staff_croc_region?.responsable_comm_niveau_instruction || "",
                responsable_comm_diplome: staff_croc_region?.responsable_comm_diplome || "",
                responsable_comm_statut: staff_croc_region?.responsable_comm_statut || false,

                responsable_se_nom: staff_croc_region?.responsable_se_nom || "",
                responsable_se_sexe: staff_croc_region?.responsable_se_sexe || "",
                responsable_se_telephone: staff_croc_region?.responsable_se_telephone || "",
                responsable_se_statut_emploi: staff_croc_region?.responsable_se_statut_emploi || "",
                responsable_se_niveau_instruction: staff_croc_region?.responsable_se_niveau_instruction || "",
                responsable_se_diplome: staff_croc_region?.responsable_se_diplome || "",
                responsable_se_statut: staff_croc_region?.responsable_se_statut || false,

                // Indicateurs sectoriels
                taux_acces_eau_base: indicateurs_sectoriels?.taux_acces_eau_base || "",
                taux_acces_assainissement_base: indicateurs_sectoriels?.taux_acces_assainissement_base || "",
                nombre_commune_odf: indicateurs_sectoriels?.nombre_commune_odf || "",
                taux_acces_electricite: indicateurs_sectoriels?.taux_acces_electricite || "",
                effectif_certificats_fonciers_distribues: indicateurs_sectoriels?.effectif_certificats_fonciers_distribues || "",
                effectif_titres_cadastres_distribues: indicateurs_sectoriels?.effectif_titres_cadastres_distribues || "",
                taux_brut_scolarisation_primaire: indicateurs_sectoriels?.taux_brut_scolarisation_primaire || "",
                taux_abandon_scolaire_primaire: indicateurs_sectoriels?.taux_abandon_scolaire_primaire || "",
                ratio_fs_fonctionnel_population: indicateurs_sectoriels?.ratio_fs_fonctionnel_population || "",
                ratio_personnel_sante_population: indicateurs_sectoriels?.ratio_personnel_sante_population || "",
                taux_malnutrition_aigue: indicateurs_sectoriels?.taux_malnutrition_aigue || "",
                taux_insecurite_alimentaire: indicateurs_sectoriels?.taux_insecurite_alimentaire || "",
                nombre_beneficiaire_filet_securite_sociale: indicateurs_sectoriels?.nombre_beneficiaire_filet_securite_sociale || "",
                culture_phare: indicateurs_sectoriels?.culture_phare || false,
                culture_phare_details: indicateurs_sectoriels?.culture_phare_details || "",
                rendement_culture_ha: indicateurs_sectoriels?.rendement_culture_ha || "",
                elevage_phare: indicateurs_sectoriels?.elevage_phare || false,
                elevage_phare_details: indicateurs_sectoriels?.elevage_phare_details || "",
                nombre_tete_elevage: indicateurs_sectoriels?.nombre_tete_elevage || "",
                produit_halieutique_phare: indicateurs_sectoriels?.produit_halieutique_phare || false,
                produit_halieutique_details: indicateurs_sectoriels?.produit_halieutique_details || "",
                production_halieutique_tonnes: indicateurs_sectoriels?.production_halieutique_tonnes || "",
                nombre_entreprises_region: indicateurs_sectoriels?.nombre_entreprises_region || "",
            });
        }
    }, [region]);


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

// Mise à jour de la fonction handleSubmit dans EditRegionForm.tsx

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = session?.user?.token || "";
            const payload = {...formData};

            // Exclure l'ID qui est déjà dans l'URL
            delete payload.id;

            // Créer un objet correctement typé en convertissant les string en number
            const parsedPayload: Partial<Region> = {
                region_nom: payload.region_nom,
                region_situee_nord: payload.region_situee_nord,
                region_situee_sud: payload.region_situee_sud,
                region_situee_ouest: payload.region_situee_ouest,
                region_situee_est: payload.region_situee_est,
                effectif_commune: typeof payload.effectif_commune === 'string' ?
                    Number(payload.effectif_commune) || 0 : payload.effectif_commune,
                effectif_district: typeof payload.effectif_district === 'string' ?
                    Number(payload.effectif_district) || 0 : payload.effectif_district,
                superficie_region_km2: typeof payload.superficie_region_km2 === 'string' ?
                    Number(payload.superficie_region_km2) || 0 : payload.superficie_region_km2,
                // Gouvernance
                gouvernance_region: {
                    src_operationnelle: !!payload.src_operationnelle,
                    srat_a_jour: !!payload.srat_a_jour,
                    volet_changement_climatique: !!payload.volet_changement_climatique,
                    prd_a_jour: !!payload.prd_a_jour,
                    acces_plateforme_web: !!payload.acces_plateforme_web,
                    etat_realisation_budget: payload.etat_realisation_budget
                },
                // Environnement
                environnement_region: {
                    structure_gestion_risques: !!payload.structure_gestion_risques
                },
                // Staff de la région
                staff_region: {
                    gouverneur_nom: payload.gouverneur_nom,
                    gouverneur_sexe: payload.gouverneur_sexe,
                    gouverneur_telephone: payload.gouverneur_telephone,
                    gouverneur_statut_emploi: payload.gouverneur_statut_emploi,
                    gouverneur_niveau_instruction: payload.gouverneur_niveau_instruction,
                    gouverneur_diplome: payload.gouverneur_diplome,
                    gouverneur_statut: !!payload.gouverneur_statut,

                    secretaire_nom: payload.secretaire_nom,
                    secretaire_sexe: payload.secretaire_sexe,
                    secretaire_telephone: payload.secretaire_telephone,
                    secretaire_statut_emploi: payload.secretaire_statut_emploi,
                    secretaire_niveau_instruction: payload.secretaire_niveau_instruction,
                    secretaire_diplome: payload.secretaire_diplome,
                    secretaire_statut: !!payload.secretaire_statut,

                    directeur_cabinet_nom: payload.directeur_cabinet_nom,
                    directeur_cabinet_sexe: payload.directeur_cabinet_sexe,
                    directeur_cabinet_telephone: payload.directeur_cabinet_telephone,
                    directeur_cabinet_statut_emploi: payload.directeur_cabinet_statut_emploi,
                    directeur_cabinet_niveau_instruction: payload.directeur_cabinet_niveau_instruction,
                    directeur_cabinet_diplome: payload.directeur_cabinet_diplome,
                    directeur_cabinet_statut: !!payload.directeur_cabinet_statut,

                    daf_nom: payload.daf_nom,
                    daf_sexe: payload.daf_sexe,
                    daf_telephone: payload.daf_telephone,
                    daf_statut_emploi: payload.daf_statut_emploi,
                    daf_niveau_instruction: payload.daf_niveau_instruction,
                    daf_diplome: payload.daf_diplome,
                    daf_statut: !!payload.daf_statut,

                    directeur_admin_nom: payload.directeur_admin_nom,
                    directeur_admin_sexe: payload.directeur_admin_sexe,
                    directeur_admin_telephone: payload.directeur_admin_telephone,
                    directeur_admin_statut_emploi: payload.directeur_admin_statut_emploi,
                    directeur_admin_niveau_instruction: payload.directeur_admin_niveau_instruction,
                    directeur_admin_diplome: payload.directeur_admin_diplome,
                    directeur_admin_statut: !!payload.directeur_admin_statut,

                    directeur_infra_nom: payload.directeur_infra_nom,
                    directeur_infra_sexe: payload.directeur_infra_sexe,
                    directeur_infra_telephone: payload.directeur_infra_telephone,
                    directeur_infra_statut_emploi: payload.directeur_infra_statut_emploi,
                    directeur_infra_niveau_instruction: payload.directeur_infra_niveau_instruction,
                    directeur_infra_diplome: payload.directeur_infra_diplome,
                    directeur_infra_statut: !!payload.directeur_infra_statut
                },
                // Staff CROC
                staff_croc_region: {
                    documentaliste_nom: payload.documentaliste_nom,
                    documentaliste_sexe: payload.documentaliste_sexe,
                    documentaliste_telephone: payload.documentaliste_telephone,
                    documentaliste_statut_emploi: payload.documentaliste_statut_emploi,
                    documentaliste_niveau_instruction: payload.documentaliste_niveau_instruction,
                    documentaliste_diplome: payload.documentaliste_diplome,
                    documentaliste_statut: !!payload.documentaliste_statut,

                    responsable_bdd_nom: payload.responsable_bdd_nom,
                    responsable_bdd_sexe: payload.responsable_bdd_sexe,
                    responsable_bdd_telephone: payload.responsable_bdd_telephone,
                    responsable_bdd_statut_emploi: payload.responsable_bdd_statut_emploi,
                    responsable_bdd_niveau_instruction: payload.responsable_bdd_niveau_instruction,
                    responsable_bdd_diplome: payload.responsable_bdd_diplome,
                    responsable_bdd_statut: !!payload.responsable_bdd_statut,

                    responsable_comm_nom: payload.responsable_comm_nom,
                    responsable_comm_sexe: payload.responsable_comm_sexe,
                    responsable_comm_telephone: payload.responsable_comm_telephone,
                    responsable_comm_statut_emploi: payload.responsable_comm_statut_emploi,
                    responsable_comm_niveau_instruction: payload.responsable_comm_niveau_instruction,
                    responsable_comm_diplome: payload.responsable_comm_diplome,
                    responsable_comm_statut: !!payload.responsable_comm_statut,

                    responsable_se_nom: payload.responsable_se_nom,
                    responsable_se_sexe: payload.responsable_se_sexe,
                    responsable_se_telephone: payload.responsable_se_telephone,
                    responsable_se_statut_emploi: payload.responsable_se_statut_emploi,
                    responsable_se_niveau_instruction: payload.responsable_se_niveau_instruction,
                    responsable_se_diplome: payload.responsable_se_diplome,
                    responsable_se_statut: !!payload.responsable_se_statut
                },
                // Indicateurs sectoriels
                indicateurs_sectoriels: {
                    taux_acces_eau_base: typeof payload.taux_acces_eau_base === 'string' ?
                        Number(payload.taux_acces_eau_base) || 0 : payload.taux_acces_eau_base,
                    taux_acces_assainissement_base: typeof payload.taux_acces_assainissement_base === 'string' ?
                        Number(payload.taux_acces_assainissement_base) || 0 : payload.taux_acces_assainissement_base,
                    nombre_commune_odf: typeof payload.nombre_commune_odf === 'string' ?
                        Number(payload.nombre_commune_odf) || 0 : payload.nombre_commune_odf,
                    taux_acces_electricite: typeof payload.taux_acces_electricite === 'string' ?
                        Number(payload.taux_acces_electricite) || 0 : payload.taux_acces_electricite,
                    effectif_certificats_fonciers_distribues: typeof payload.effectif_certificats_fonciers_distribues === 'string' ?
                        Number(payload.effectif_certificats_fonciers_distribues) || 0 : payload.effectif_certificats_fonciers_distribues,
                    effectif_titres_cadastres_distribues: typeof payload.effectif_titres_cadastres_distribues === 'string' ?
                        Number(payload.effectif_titres_cadastres_distribues) || 0 : payload.effectif_titres_cadastres_distribues,
                    taux_brut_scolarisation_primaire: typeof payload.taux_brut_scolarisation_primaire === 'string' ?
                        Number(payload.taux_brut_scolarisation_primaire) || 0 : payload.taux_brut_scolarisation_primaire,
                    taux_abandon_scolaire_primaire: typeof payload.taux_abandon_scolaire_primaire === 'string' ?
                        Number(payload.taux_abandon_scolaire_primaire) || 0 : payload.taux_abandon_scolaire_primaire,
                    ratio_fs_fonctionnel_population: typeof payload.ratio_fs_fonctionnel_population === 'string' ?
                        Number(payload.ratio_fs_fonctionnel_population) || 0 : payload.ratio_fs_fonctionnel_population,
                    ratio_personnel_sante_population: typeof payload.ratio_personnel_sante_population === 'string' ?
                        Number(payload.ratio_personnel_sante_population) || 0 : payload.ratio_personnel_sante_population,
                    taux_malnutrition_aigue: typeof payload.taux_malnutrition_aigue === 'string' ?
                        Number(payload.taux_malnutrition_aigue) || 0 : payload.taux_malnutrition_aigue,
                    taux_insecurite_alimentaire: typeof payload.taux_insecurite_alimentaire === 'string' ?
                        Number(payload.taux_insecurite_alimentaire) || 0 : payload.taux_insecurite_alimentaire,
                    nombre_beneficiaire_filet_securite_sociale: typeof payload.nombre_beneficiaire_filet_securite_sociale === 'string' ?
                        Number(payload.nombre_beneficiaire_filet_securite_sociale) || 0 : payload.nombre_beneficiaire_filet_securite_sociale,
                    culture_phare: !!payload.culture_phare,
                    culture_phare_details: payload.culture_phare_details,
                    rendement_culture_ha: typeof payload.rendement_culture_ha === 'string' ?
                        Number(payload.rendement_culture_ha) || 0 : payload.rendement_culture_ha,
                    elevage_phare: !!payload.elevage_phare,
                    elevage_phare_details: payload.elevage_phare_details,
                    nombre_tete_elevage: typeof payload.nombre_tete_elevage === 'string' ?
                        Number(payload.nombre_tete_elevage) || 0 : payload.nombre_tete_elevage,
                    produit_halieutique_phare: !!payload.produit_halieutique_phare,
                    produit_halieutique_details: payload.produit_halieutique_details,
                    production_halieutique_tonnes: typeof payload.production_halieutique_tonnes === 'string' ?
                        Number(payload.production_halieutique_tonnes) || 0 : payload.production_halieutique_tonnes,
                    nombre_entreprises_region: typeof payload.nombre_entreprises_region === 'string' ?
                        Number(payload.nombre_entreprises_region) || 0 : payload.nombre_entreprises_region
                }
            };

            // Utiliser l'API directement au lieu du proxy
            const result = await dbregionApi.updateRegion(
                region.id_situation_geographique,
                parsedPayload,
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
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Modifier les données de la région –
                        ID: {region.id_situation_geographique}</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4 border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-5 mb-4">
                            <TabsTrigger value="info-base">Informations de base</TabsTrigger>
                            <TabsTrigger value="gouvernance">Gouvernance</TabsTrigger>
                            <TabsTrigger value="staff-region">Staff Région</TabsTrigger>
                            <TabsTrigger value="staff-croc">Staff CROC</TabsTrigger>
                            <TabsTrigger value="indicateurs">Indicateurs sectoriels</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info-base" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderInput("Nom de la région", "region_nom")}
                                {renderInput("Région située au nord", "region_situee_nord")}
                                {renderInput("Région située au sud", "region_situee_sud")}
                                {renderInput("Région située à l'ouest", "region_situee_ouest")}
                                {renderInput("Région située à l'est", "region_situee_est")}
                                {renderInput("Effectif de communes", "effectif_commune", "number")}
                                {renderInput("Effectif de districts", "effectif_district", "number")}
                                {renderInput("Superficie (km²)", "superficie_region_km2", "number")}
                            </div>
                        </TabsContent>

                        <TabsContent value="gouvernance" className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {renderSwitch("SRC opérationnelle", "src_operationnelle")}
                                {renderSwitch("SRAT à jour", "srat_a_jour")}
                                {renderSwitch("Volet changement climatique", "volet_changement_climatique")}
                                {renderSwitch("PRD à jour", "prd_a_jour")}
                                {renderSwitch("Accès plateforme web", "acces_plateforme_web")}
                                {renderSelect("État réalisation budget", "etat_realisation_budget", [
                                    {value: "Non réalisé", label: "Non réalisé"},
                                    {value: "En cours", label: "En cours"},
                                    {value: "Réalisé", label: "Réalisé"}
                                ])}
                                {renderSwitch("Structure gestion des risques", "structure_gestion_risques")}
                            </div>
                        </TabsContent>

                        <TabsContent value="staff-region" className="space-y-4">
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Gouverneur</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "gouverneur_nom")}
                                    {renderSelect("Sexe", "gouverneur_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "gouverneur_telephone")}
                                    {renderInput("Statut d'emploi", "gouverneur_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "gouverneur_niveau_instruction")}
                                    {renderInput("Diplôme", "gouverneur_diplome")}
                                    {renderSwitch("Statut actif", "gouverneur_statut")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Secrétaire</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "secretaire_nom")}
                                    {renderSelect("Sexe", "secretaire_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "secretaire_telephone")}
                                    {renderInput("Statut d'emploi", "secretaire_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "secretaire_niveau_instruction")}
                                    {renderInput("Diplôme", "secretaire_diplome")}
                                    {renderSwitch("Statut actif", "secretaire_statut")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Directeur de Cabinet</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "directeur_cabinet_nom")}
                                    {renderSelect("Sexe", "directeur_cabinet_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "directeur_cabinet_telephone")}
                                    {renderInput("Statut d'emploi", "directeur_cabinet_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "directeur_cabinet_niveau_instruction")}
                                    {renderInput("Diplôme", "directeur_cabinet_diplome")}
                                    {renderSwitch("Statut actif", "directeur_cabinet_statut")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">DAF</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "daf_nom")}
                                    {renderSelect("Sexe", "daf_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "daf_telephone")}
                                    {renderInput("Statut d'emploi", "daf_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "daf_niveau_instruction")}
                                    {renderInput("Diplôme", "daf_diplome")}
                                    {renderSwitch("Statut actif", "daf_statut")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Directeur Administratif</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "directeur_admin_nom")}
                                    {renderSelect("Sexe", "directeur_admin_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "directeur_admin_telephone")}
                                    {renderInput("Statut d'emploi", "directeur_admin_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "directeur_admin_niveau_instruction")}
                                    {renderInput("Diplôme", "directeur_admin_diplome")}
                                    {renderSwitch("Statut actif", "directeur_admin_statut")}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-3">Directeur Infrastructure</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "directeur_infra_nom")}
                                    {renderSelect("Sexe", "directeur_infra_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "directeur_infra_telephone")}
                                    {renderInput("Statut d'emploi", "directeur_infra_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "directeur_infra_niveau_instruction")}
                                    {renderInput("Diplôme", "directeur_infra_diplome")}
                                    {renderSwitch("Statut actif", "directeur_infra_statut")}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="staff-croc" className="space-y-4">
                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Documentaliste</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "documentaliste_nom")}
                                    {renderSelect("Sexe", "documentaliste_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "documentaliste_telephone")}
                                    {renderInput("Statut d'emploi", "documentaliste_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "documentaliste_niveau_instruction")}
                                    {renderInput("Diplôme", "documentaliste_diplome")}
                                    {renderSwitch("Statut actif", "documentaliste_statut")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Responsable BDD</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "responsable_bdd_nom")}
                                    {renderSelect("Sexe", "responsable_bdd_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "responsable_bdd_telephone")}
                                    {renderInput("Statut d'emploi", "responsable_bdd_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "responsable_bdd_niveau_instruction")}
                                    {renderInput("Diplôme", "responsable_bdd_diplome")}
                                    {renderSwitch("Statut actif", "responsable_bdd_statut")}
                                </div>
                            </div>

                            <div className="border-b pb-4 mb-4">
                                <h3 className="font-semibold text-lg mb-3">Responsable Communication</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "responsable_comm_nom")}
                                    {renderSelect("Sexe", "responsable_comm_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "responsable_comm_telephone")}
                                    {renderInput("Statut d'emploi", "responsable_comm_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "responsable_comm_niveau_instruction")}
                                    {renderInput("Diplôme", "responsable_comm_diplome")}
                                    {renderSwitch("Statut actif", "responsable_comm_statut")}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-3">Responsable Suivi-Évaluation</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderInput("Nom", "responsable_se_nom")}
                                    {renderSelect("Sexe", "responsable_se_sexe", [
                                        {value: "M", label: "Masculin"},
                                        {value: "F", label: "Féminin"}
                                    ])}
                                    {renderInput("Téléphone", "responsable_se_telephone")}
                                    {renderInput("Statut d'emploi", "responsable_se_statut_emploi")}
                                    {renderInput("Niveau d'instruction", "responsable_se_niveau_instruction")}
                                    {renderInput("Diplôme", "responsable_se_diplome")}
                                    {renderSwitch("Statut actif", "responsable_se_statut")}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="indicateurs" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <h3 className="font-medium text-lg col-span-2">Eau et Assainissement</h3>
                                {renderInput("Taux d'accès à l'eau de base (%)", "taux_acces_eau_base", "number")}
                                {renderInput("Taux d'accès à l'assainissement de base (%)", "taux_acces_assainissement_base", "number")}
                                {renderInput("Nombre de communes ODF", "nombre_commune_odf", "number")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Énergie et Foncier</h3>
                                {renderInput("Taux d'accès à l'électricité (%)", "taux_acces_electricite", "number")}
                                {renderInput("Effectif certificats fonciers distribués", "effectif_certificats_fonciers_distribues", "number")}
                                {renderInput("Effectif titres cadastres distribués", "effectif_titres_cadastres_distribues", "number")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Éducation</h3>
                                {renderInput("Taux brut scolarisation primaire (%)", "taux_brut_scolarisation_primaire", "number")}
                                {renderInput("Taux abandon scolaire primaire (%)", "taux_abandon_scolaire_primaire", "number")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Santé et Sécurité Alimentaire</h3>
                                {renderInput("Ratio FS fonctionnel/population", "ratio_fs_fonctionnel_population", "number")}
                                {renderInput("Ratio personnel santé/population", "ratio_personnel_sante_population", "number")}
                                {renderInput("Taux malnutrition aiguë (%)", "taux_malnutrition_aigue", "number")}
                                {renderInput("Taux insécurité alimentaire (%)", "taux_insecurite_alimentaire", "number")}
                                {renderInput("Nombre bénéficiaire filet sécurité sociale", "nombre_beneficiaire_filet_securite_sociale", "number")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Agriculture</h3>
                                {renderSwitch("Culture phare", "culture_phare")}
                                {renderInput("Détails culture phare", "culture_phare_details", "text")}
                                {renderInput("Rendement culture (ha)", "rendement_culture_ha", "number")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Élevage</h3>
                                {renderSwitch("Élevage phare", "elevage_phare")}
                                {renderInput("Détails élevage phare", "elevage_phare_details", "text")}
                                {renderInput("Nombre de têtes d'élevage", "nombre_tete_elevage", "number")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Pêche</h3>
                                {renderSwitch("Produit halieutique phare", "produit_halieutique_phare")}
                                {renderInput("Détails produit halieutique", "produit_halieutique_details", "text")}
                                {renderInput("Production halieutique (tonnes)", "production_halieutique_tonnes", "number")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Économie</h3>
                                {renderInput("Nombre d'entreprises dans la région", "nombre_entreprises_region", "number")}
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
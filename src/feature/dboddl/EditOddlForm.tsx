"use client";

import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";
import {Input} from "@/components/ui/atomes/input";
import {Label} from "@/components/ui/atomes/label";
import {Button} from "@/components/ui/atomes/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Switch} from "@/components/ui/atomes/switch";
import {Oddl} from "@/services/types/oddO.type";
import {useSession} from "next-auth/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {oddlApi} from "@/services/api/oddl/get-odd.api";

// Define the interface for the form data
interface OddlFormData {
    id?: number;
    province?: string;
    region?: string;
    district?: string;
    commune?: string;
    categorie_commune?: string;
    // Champs de gouvernance_commune
    id_gouvernance_commune?: number | null;
    evaluation_externe?: boolean;
    notes_igl?: number | string;
    notes_pillier_a?: number | string;
    notes_pillier_b?: number | string;
    notes_pillier_c?: number | string;
    notes_pillier_d?: number | string;
    notes_scoring_moc?: number | string;
    notes_scoring_mr?: number | string;
    notes_scoring_cgf?: number | string;
    scoring_ec?: number | string;
    scoring_grh?: number | string;
    niveau_satisfaction_population_public_services?: string;

    // Montants
    montant_recettes_budgetaires_propres?: number | string;
    montant_realisation_recettes_propres?: number | string;
    montant_prevision_recettes_propres?: number | string;
    montant_recettes_previsionnelles_fonctionnements?: number | string;
    montant_realisation_recettes_fonctionnement?: number | string;
    montant_depenses_reelles_investissements?: number | string;
    montant_depenses_previsionnelles_investissements?: number | string;
    montant_realisation_recettes_fiscales?: number | string;
    montant_prevision_recettes_fiscales?: number | string;
    montant_realisation_recettes_non_fiscales?: number | string;
    montant_depenses_reelles_fonctionnements?: number | string;
    montant_realisation_depenses_fonctionnement?: number | string;
    montant_realisation_prevision_depenses_fonctionnement?: number | string;
    montant_prevision_recettes_non_fiscales?: number | string;
    montant_depenses_investissement_hors_subvention?: number | string;
    montant_realisation_recettes_hors_subventions?: number | string;
    montant_realisation_depenses_investissements_hors_subvention?: number | string;
    montant_realisation_charge_personnel?: number | string;
    montant_realisation_depenses_obligatoires?: number | string;
    montant_subventions_transferees_communes?: number | string;
    montant_depenses_engagees_par_etat?: number | string;

    // Booléens
    existence_compte_administratif?: boolean;
    existence_compte_gestion_annexes_financieres?: boolean;
    effectivite_maitrise_ouvrage_competences_transferees?: boolean;
    existence_outil_planification?: boolean;

    [key: string]: string | number | boolean | null | undefined; // Index signature for dynamic access
}

interface Props {
    odd: Oddl;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function EditOddlForm({odd, isOpen, onClose, onSave}: Props) {
    const {data: session} = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<OddlFormData>({});
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("info-base");

    useEffect(() => {
        if (odd) {
            const {
                id_localisation,
                province,
                region,
                district,
                commune,
                categorie_commune,
                gouvernance_commune
            } = odd;

            setFormData({
                id: id_localisation,
                province,
                region,
                district,
                commune,
                categorie_commune,
                // Champs de gouvernance_commune
                id_gouvernance_commune: gouvernance_commune?.id_gouvernance_commune ?? null,
                evaluation_externe: gouvernance_commune?.evaluation_externe ?? false,
                notes_igl: gouvernance_commune?.notes_igl ?? "",
                notes_pillier_a: gouvernance_commune?.notes_pillier_a ?? "",
                notes_pillier_b: gouvernance_commune?.notes_pillier_b ?? "",
                notes_pillier_c: gouvernance_commune?.notes_pillier_c ?? "",
                notes_pillier_d: gouvernance_commune?.notes_pillier_d ?? "",
                notes_scoring_moc: gouvernance_commune?.notes_scoring_moc ?? "",
                notes_scoring_mr: gouvernance_commune?.notes_scoring_mr ?? "",
                notes_scoring_cgf: gouvernance_commune?.notes_scoring_cgf ?? "",
                scoring_ec: gouvernance_commune?.scoring_ec ?? "",
                scoring_grh: gouvernance_commune?.scoring_grh ?? "",
                niveau_satisfaction_population_public_services: gouvernance_commune?.niveau_satisfaction_population_public_services ?? "",

                // Montants
                montant_recettes_budgetaires_propres: gouvernance_commune?.montant_recettes_budgetaires_propres ?? "",
                montant_realisation_recettes_propres: gouvernance_commune?.montant_realisation_recettes_propres ?? "",
                montant_prevision_recettes_propres: gouvernance_commune?.montant_prevision_recettes_propres ?? "",
                montant_recettes_previsionnelles_fonctionnements: gouvernance_commune?.montant_recettes_previsionnelles_fonctionnements ?? "",
                montant_realisation_recettes_fonctionnement: gouvernance_commune?.montant_realisation_recettes_fonctionnement ?? "",
                montant_depenses_reelles_investissements: gouvernance_commune?.montant_depenses_reelles_investissements ?? "",
                montant_depenses_previsionnelles_investissements: gouvernance_commune?.montant_depenses_previsionnelles_investissements ?? "",
                montant_realisation_recettes_fiscales: gouvernance_commune?.montant_realisation_recettes_fiscales ?? "",
                montant_prevision_recettes_fiscales: gouvernance_commune?.montant_prevision_recettes_fiscales ?? "",
                montant_realisation_recettes_non_fiscales: gouvernance_commune?.montant_realisation_recettes_non_fiscales ?? "",
                montant_depenses_reelles_fonctionnements: gouvernance_commune?.montant_depenses_reelles_fonctionnements ?? "",
                montant_realisation_depenses_fonctionnement: gouvernance_commune?.montant_realisation_depenses_fonctionnement ?? "",
                montant_realisation_prevision_depenses_fonctionnement: gouvernance_commune?.montant_realisation_prevision_depenses_fonctionnement ?? "",
                montant_prevision_recettes_non_fiscales: gouvernance_commune?.montant_prevision_recettes_non_fiscales ?? "",
                montant_depenses_investissement_hors_subvention: gouvernance_commune?.montant_depenses_investissement_hors_subvention ?? "",
                montant_realisation_recettes_hors_subventions: gouvernance_commune?.montant_realisation_recettes_hors_subventions ?? "",
                montant_realisation_depenses_investissements_hors_subvention: gouvernance_commune?.montant_realisation_depenses_investissements_hors_subvention ?? "",
                montant_realisation_charge_personnel: gouvernance_commune?.montant_realisation_charge_personnel ?? "",
                montant_realisation_depenses_obligatoires: gouvernance_commune?.montant_realisation_depenses_obligatoires ?? "",
                montant_subventions_transferees_communes: gouvernance_commune?.montant_subventions_transferees_communes ?? "",
                montant_depenses_engagees_par_etat: gouvernance_commune?.montant_depenses_engagees_par_etat ?? "",

                // Booléens
                existence_compte_administratif: gouvernance_commune?.existence_compte_administratif ?? false,
                existence_compte_gestion_annexes_financieres: gouvernance_commune?.existence_compte_gestion_annexes_financieres ?? false,
                effectivite_maitrise_ouvrage_competences_transferees: gouvernance_commune?.effectivite_maitrise_ouvrage_competences_transferees ?? false,
                existence_outil_planification: gouvernance_commune?.existence_outil_planification ?? false
            });
        }
    }, [odd]);

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
            const payload = {...formData};

            // Exclure l'ID qui est déjà dans l'URL
            delete payload.id;

            // Utiliser la nouvelle API au lieu du proxy
            const result = await oddlApi.updateOddl(odd.id_localisation, payload, token);

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

    const renderInput = (label: string, name: string, type = "number") => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                step="any"
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
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Modifier les données ODDL – ID: {odd.id_localisation}</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4 border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-4">
                            <TabsTrigger value="info-base">Informations de base</TabsTrigger>
                            <TabsTrigger value="notes">Notes & Scores</TabsTrigger>
                            <TabsTrigger value="finances">Finances</TabsTrigger>
                            <TabsTrigger value="gestion">Indicateurs de gestion</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info-base" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderInput("Province", "province", "text")}
                                {renderInput("Région", "region", "text")}
                                {renderInput("District", "district", "text")}
                                {renderInput("Commune", "commune", "text")}
                                {renderInput("Catégorie de indcommune", "categorie_commune", "text")}
                                {renderSelect("Niveau satisfaction population", "niveau_satisfaction_population_public_services", [
                                    {value: "Satisfait", label: "Satisfait"},
                                    {value: "Moyennement satisfait", label: "Moyennement satisfait"},
                                    {value: "Insatisfait", label: "Insatisfait"}
                                ])}
                                {renderSwitch("Évaluation externe", "evaluation_externe")}
                            </div>
                        </TabsContent>

                        <TabsContent value="notes" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {renderInput("Notes IGL", "notes_igl")}
                                {renderInput("Notes Pilier A", "notes_pillier_a")}
                                {renderInput("Notes Pilier B", "notes_pillier_b")}
                                {renderInput("Notes Pilier C", "notes_pillier_c")}
                                {renderInput("Notes Pilier D", "notes_pillier_d")}
                                {renderInput("Scoring MOC", "notes_scoring_moc")}
                                {renderInput("Scoring MR", "notes_scoring_mr")}
                                {renderInput("Scoring CGF", "notes_scoring_cgf")}
                                {renderInput("Scoring EC", "scoring_ec")}
                                {renderInput("Scoring GRH", "scoring_grh")}
                            </div>
                        </TabsContent>

                        <TabsContent value="finances" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <h3 className="font-medium text-lg col-span-2">Recettes</h3>
                                {renderInput("Montant recettes budgétaires propres", "montant_recettes_budgetaires_propres")}
                                {renderInput("Montant réalisation recettes propres", "montant_realisation_recettes_propres")}
                                {renderInput("Montant prévision recettes propres", "montant_prevision_recettes_propres")}
                                {renderInput("Montant recettes prévisionnelles fonctionnement", "montant_recettes_previsionnelles_fonctionnements")}
                                {renderInput("Montant réalisation recettes fonctionnement", "montant_realisation_recettes_fonctionnement")}
                                {renderInput("Montant réalisation recettes fiscales", "montant_realisation_recettes_fiscales")}
                                {renderInput("Montant prévision recettes fiscales", "montant_prevision_recettes_fiscales")}
                                {renderInput("Montant réalisation recettes non fiscales", "montant_realisation_recettes_non_fiscales")}
                                {renderInput("Montant prévision recettes non fiscales", "montant_prevision_recettes_non_fiscales")}
                                {renderInput("Montant réalisation recettes hors subventions", "montant_realisation_recettes_hors_subventions")}
                                {renderInput("Montant subventions transférées communes", "montant_subventions_transferees_communes")}

                                <h3 className="font-medium text-lg col-span-2 mt-4">Dépenses</h3>
                                {renderInput("Montant dépenses réelles investissements", "montant_depenses_reelles_investissements")}
                                {renderInput("Montant dépenses prévisionnelles investissements", "montant_depenses_previsionnelles_investissements")}
                                {renderInput("Montant dépenses réelles fonctionnements", "montant_depenses_reelles_fonctionnements")}
                                {renderInput("Montant réalisation dépenses fonctionnement", "montant_realisation_depenses_fonctionnement")}
                                {renderInput("Montant réalisation prévision dépenses fonctionnement", "montant_realisation_prevision_depenses_fonctionnement")}
                                {renderInput("Montant dépenses prévisionnelles et de recettes prévisionnelles", "montant_depenses_investissement_hors_subvention")}
                                {renderInput("Montant réalisation dépenses investissements hors subvention", "montant_realisation_depenses_investissements_hors_subvention")}
                                {renderInput("Montant réalisation charge personnel", "montant_realisation_charge_personnel")}
                                {renderInput("Montant réalisation dépenses obligatoires", "montant_realisation_depenses_obligatoires")}
                                {renderInput("Montant dépenses engagées par état", "montant_depenses_engagees_par_etat")}
                            </div>
                        </TabsContent>

                        <TabsContent value="gestion" className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {renderSwitch("Existence compte administratif", "existence_compte_administratif")}
                                {renderSwitch("Existence compte gestion annexes financières", "existence_compte_gestion_annexes_financieres")}
                                {renderSwitch("Effectivité maîtrise ouvrage compétences transférées", "effectivite_maitrise_ouvrage_competences_transferees")}
                                {renderSwitch("Existence outil planification", "existence_outil_planification")}
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
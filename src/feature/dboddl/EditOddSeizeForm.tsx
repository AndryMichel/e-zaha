"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {Label} from "@/components/ui/atomes/label";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";
import {OddSeize} from "@/services/types/odd-seize.type";
import {useSession} from "next-auth/react";
import {updateOddSeize} from "@/services/api/oddl/get-odd-seize.api"; // Import de la nouvelle fonction d'API
import {toast} from "sonner"; // Ajout de toast pour les notifications

interface EditOddSeizeFormProps {
    odd?: OddSeize;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function EditOddSeizeForm({odd, isOpen, onClose, onSave}: EditOddSeizeFormProps) {
    const {data: session} = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        proportion_jeunes_femmes_hommes_violences_sexuelles: 0,
        proportion_victimes_signalees_violences: 0,
        proportion_population_carcérale_instance_jugement: 0,
        nombre_vindictes_populaires: 0,
        valeur_flux_financiers_illicites: 0,
        indice_perception_corruption: 0,
        proportion_population_satisfaction_services_publics: 0,
        repartition_postes_publics_sexe_âge_handicap: 0,
        proportion_population_prise_decisions_ouverte_reactive: 0,
    });

    // Mettre à jour les valeurs du formulaire lorsque les données ODD sont chargées
    useEffect(() => {
        if (odd) {
            setFormData({
                proportion_jeunes_femmes_hommes_violences_sexuelles: odd.proportion_jeunes_femmes_hommes_violences_sexuelles,
                proportion_victimes_signalees_violences: odd.proportion_victimes_signalees_violences,
                proportion_population_carcérale_instance_jugement: odd.proportion_population_carcérale_instance_jugement,
                nombre_vindictes_populaires: odd.nombre_vindictes_populaires,
                valeur_flux_financiers_illicites: odd.valeur_flux_financiers_illicites,
                indice_perception_corruption: odd.indice_perception_corruption,
                proportion_population_satisfaction_services_publics: odd.proportion_population_satisfaction_services_publics,
                repartition_postes_publics_sexe_âge_handicap: odd.repartition_postes_publics_sexe_âge_handicap,
                proportion_population_prise_decisions_ouverte_reactive: odd.proportion_population_prise_decisions_ouverte_reactive,
            });
        }
    }, [odd]);

    // Helper function to prevent NaN values
    const safeValue = (value: number | null | undefined): string => {
        return value === null || value === undefined || isNaN(value) ? '' : value.toString();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        // Check if the value is empty
        if (value === '') {
            setFormData(prev => ({
                ...prev,
                [name]: 0 // Default to 0 when empty
            }));
            return;
        }

        // Parse the value correctly depending on the field
        const numericValue = name === 'nombre_vindictes_populaires'
            ? parseInt(value)
            : parseFloat(value);

        // Only update if it's a valid number
        if (!isNaN(numericValue)) {
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!odd) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const token = session?.user?.token || "";

            // Utilisation de la fonction d'API au lieu d'un appel fetch direct
            const result = await updateOddSeize(
                odd.id_odds_16.toString(),
                formData,
                token
            );

            if (result.success) {
                toast.success("Données ODD 16 mises à jour avec succès");
                onSave();
                onClose();
            } else {
                throw new Error(result.message || "Une erreur est survenue lors de la mise à jour");
            }
        } catch (err: unknown) {
            console.error("Erreur lors de la mise à jour:", err);
            if (err instanceof Error) {
                setError(err.message);
                toast.error(`Erreur: ${err.message}`);
            } else {
                setError("Une erreur s'est produite lors de la mise à jour des données");
                toast.error("Une erreur inattendue s'est produite");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Modifier les données ODD 16 – ID: {odd?.id_odds_16}</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="proportion_jeunes_femmes_hommes_violences_sexuelles">
                                Violences sexuelles (%)
                            </Label>
                            <Input
                                id="proportion_jeunes_femmes_hommes_violences_sexuelles"
                                name="proportion_jeunes_femmes_hommes_violences_sexuelles"
                                type="number"
                                step="0.01"
                                value={safeValue(formData.proportion_jeunes_femmes_hommes_violences_sexuelles)}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="proportion_victimes_signalees_violences">
                                Victimes signalées (%)
                            </Label>
                            <Input
                                id="proportion_victimes_signalees_violences"
                                name="proportion_victimes_signalees_violences"
                                type="number"
                                step="0.01"
                                value={safeValue(formData.proportion_victimes_signalees_violences)}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="proportion_population_carcérale_instance_jugement">
                                Population carcérale sans jugement (%)
                            </Label>
                            <Input
                                id="proportion_population_carcérale_instance_jugement"
                                name="proportion_population_carcérale_instance_jugement"
                                type="number"
                                step="0.01"
                                value={safeValue(formData.proportion_population_carcérale_instance_jugement)}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nombre_vindictes_populaires">
                                Vindictes populaires
                            </Label>
                            <Input
                                id="nombre_vindictes_populaires"
                                name="nombre_vindictes_populaires"
                                type="number"
                                step="1"
                                value={safeValue(formData.nombre_vindictes_populaires)}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="valeur_flux_financiers_illicites">
                                Flux financiers illicites (MGA)
                            </Label>
                            <Input
                                id="valeur_flux_financiers_illicites"
                                name="valeur_flux_financiers_illicites"
                                type="number"
                                step="1000"
                                value={safeValue(formData.valeur_flux_financiers_illicites)}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="indice_perception_corruption">
                                Indice de corruption (0-10)
                            </Label>
                            <Input
                                id="indice_perception_corruption"
                                name="indice_perception_corruption"
                                type="number"
                                step="0.1"
                                value={safeValue(formData.indice_perception_corruption)}
                                onChange={handleChange}
                                min="0"
                                max="10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="proportion_population_satisfaction_services_publics">
                                Satisfaction services publics (%)
                            </Label>
                            <Input
                                id="proportion_population_satisfaction_services_publics"
                                name="proportion_population_satisfaction_services_publics"
                                type="number"
                                step="0.01"
                                value={safeValue(formData.proportion_population_satisfaction_services_publics)}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="repartition_postes_publics_sexe_âge_handicap">
                                Répartition postes (%)
                            </Label>
                            <Input
                                id="repartition_postes_publics_sexe_âge_handicap"
                                name="repartition_postes_publics_sexe_âge_handicap"
                                type="number"
                                step="0.01"
                                value={safeValue(formData.repartition_postes_publics_sexe_âge_handicap)}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="proportion_population_prise_decisions_ouverte_reactive">
                                Prise de décision ouverte (%)
                            </Label>
                            <Input
                                id="proportion_population_prise_decisions_ouverte_reactive"
                                name="proportion_population_prise_decisions_ouverte_reactive"
                                type="number"
                                step="0.01"
                                value={safeValue(formData.proportion_population_prise_decisions_ouverte_reactive)}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditOddSeizeForm;
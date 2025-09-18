"use client";

import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {Button} from "@/components/ui/atomes/button";
import {Oddl} from "@/services/types/oddO.type";
import EditOddlForm from "./EditOddlForm";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";
import {useSession} from "next-auth/react";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/molécules/dialog";
import {oddlApi} from "@/services/api/oddl/get-odd.api";

export function ODDLRow({odd, onDelete}: { odd: Oddl; onDelete: (id: string) => void }) {
    const {data: session} = useSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const token = session?.user?.token || "";
            const data = await oddlApi.deleteOddl(odd.id_localisation, token);

            if (data.success) {
                onDelete(odd.id_localisation.toString());
            } else {
                throw new Error(data.message || "Erreur lors de la suppression");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`Erreur: ${error.message}`);
            } else {
                alert("Une erreur est survenue lors de la suppression.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    // Formatter pour les valeurs monétaires
    const formatCurrency = (value: number | null | undefined) => {
        if (value == null || isNaN(value)) {
            return "0 MGA";
        }
        return value.toLocaleString() + " MGA";
    };

// Formatter pour les valeurs booléennes
    const formatBoolean = (value: boolean | null | undefined) => {
        if (value == null) {
            return "Non";
        }
        return value ? "Oui" : "Non";
    };

    return (
        <>
            <TableRow>
                <TableCell>{odd.id_localisation}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_igl}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_pillier_a}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_pillier_b}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_pillier_c}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_pillier_d}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_scoring_moc}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_scoring_mr}</TableCell>
                <TableCell>{odd.gouvernance_commune.notes_scoring_cgf}</TableCell>
                <TableCell>{odd.gouvernance_commune.scoring_ec}</TableCell>
                <TableCell>{odd.gouvernance_commune.scoring_grh}</TableCell>
                <TableCell>{odd.gouvernance_commune.niveau_satisfaction_population_public_services}</TableCell>
                <TableCell>
                    {odd.commune}<br/>
                    <span className="text-xs text-gray-500">
                        ({odd.district}, {odd.region}, {odd.province})
                    </span>
                </TableCell>
                <TableCell>{odd.categorie_commune}</TableCell>
                <TableCell>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(true)}>
                            Détails
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>Éditer</Button>
                        <Button variant="outline" size="sm" className="text-red-600"
                                onClick={() => setIsDeleteOpen(true)}>
                            Supprimer
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {/* Modal pour afficher tous les détails */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Détails ODDL - {odd.commune}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-bold mb-2">Informations générales</h3>
                            <table className="w-full">
                                <tbody>
                                <tr>
                                    <td className="py-1 font-medium">ID Localisation:</td>
                                    <td>{odd.id_localisation}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Commune:</td>
                                    <td>{odd.commune}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Catégorie:</td>
                                    <td>{odd.categorie_commune}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">District:</td>
                                    <td>{odd.district}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Région:</td>
                                    <td>{odd.region}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Province:</td>
                                    <td>{odd.province}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-bold mb-2">Notes et évaluations</h3>
                            <table className="w-full">
                                <tbody>
                                <tr>
                                    <td className="py-1 font-medium">IGL:</td>
                                    <td>{odd.gouvernance_commune.notes_igl}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Pilier A:</td>
                                    <td>{odd.gouvernance_commune.notes_pillier_a}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Pilier B:</td>
                                    <td>{odd.gouvernance_commune.notes_pillier_b}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Pilier C:</td>
                                    <td>{odd.gouvernance_commune.notes_pillier_c}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Pilier D:</td>
                                    <td>{odd.gouvernance_commune.notes_pillier_d}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Scoring MOC:</td>
                                    <td>{odd.gouvernance_commune.notes_scoring_moc}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Scoring MR:</td>
                                    <td>{odd.gouvernance_commune.notes_scoring_mr}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Scoring CGF:</td>
                                    <td>{odd.gouvernance_commune.notes_scoring_cgf}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Scoring EC:</td>
                                    <td>{odd.gouvernance_commune.scoring_ec}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Scoring GRH:</td>
                                    <td>{odd.gouvernance_commune.scoring_grh}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-bold mb-2">Recettes et prévisions</h3>
                            <table className="w-full">
                                <tbody>
                                <tr>
                                    <td className="py-1 font-medium">Recettes budgétaires propres:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_recettes_budgetaires_propres)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation recettes propres:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_recettes_propres)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Prévisions recettes de fonctionnement:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_recettes_previsionnelles_fonctionnements)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation recettes de fonctionnement:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_recettes_fonctionnement)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Prévisions recettes fiscales:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_prevision_recettes_fiscales)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation recettes fiscales:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_recettes_fiscales)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Prévisions recettes non fiscales:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_prevision_recettes_non_fiscales)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation recettes non fiscales:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_recettes_non_fiscales)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation recettes hors subventions:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_recettes_hors_subventions)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-bold mb-2">Dépenses</h3>
                            <table className="w-full">
                                <tbody>
                                <tr>
                                    <td className="py-1 font-medium">Dépenses réelles investissements:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_depenses_reelles_investissements)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Dépenses prévisionnelles investissements:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_depenses_previsionnelles_investissements)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Dépenses réelles fonctionnements:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_depenses_reelles_fonctionnements)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation dépenses fonctionnement:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_depenses_fonctionnement)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Prévision dépenses fonctionnement:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_prevision_depenses_fonctionnement)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Dépenses prévisionnelles et de recettes prévisionnelles:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_depenses_investissement_hors_subvention)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation dépenses investissements hors
                                        subvention:
                                    </td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_depenses_investissements_hors_subvention)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation charge personnel:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_charge_personnel)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Réalisation dépenses obligatoires:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_realisation_depenses_obligatoires)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-bold mb-2">Subventions et transferts</h3>
                            <table className="w-full">
                                <tbody>
                                <tr>
                                    <td className="py-1 font-medium">Subventions transférées communes:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_subventions_transferees_communes)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Dépenses engagées par l&#39;État:</td>
                                    <td>{formatCurrency(odd.gouvernance_commune.montant_depenses_engagees_par_etat)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-bold mb-2">Autres informations</h3>
                            <table className="w-full">
                                <tbody>
                                <tr>
                                    <td className="py-1 font-medium">Satisfaction de la population:</td>
                                    <td>{odd.gouvernance_commune.niveau_satisfaction_population_public_services || "Non défini"}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Évaluation externe:</td>
                                    <td>{formatBoolean(odd.gouvernance_commune.evaluation_externe)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Existence compte administratif:</td>
                                    <td>{formatBoolean(odd.gouvernance_commune.existence_compte_administratif)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Existence compte gestion et annexes:</td>
                                    <td>{formatBoolean(odd.gouvernance_commune.existence_compte_gestion_annexes_financieres)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Effectivité maîtrise d&#39;ouvrage:</td>
                                    <td>{formatBoolean(odd.gouvernance_commune.effectivite_maitrise_ouvrage_competences_transferees)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-medium">Existence outil planification:</td>
                                    <td>{formatBoolean(odd.gouvernance_commune.existence_outil_planification)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <EditOddlForm
                odd={odd}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={() => onDelete(odd.id_localisation.toString())}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={odd.id_localisation.toString()}
                isDeleting={isDeleting}

            />
        </>
    );
}
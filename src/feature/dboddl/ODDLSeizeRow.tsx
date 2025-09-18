"use client";

import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {OddSeize} from "@/services/types/odd-seize.type";
import {Button} from "@/components/ui/atomes/button";
import {useSession} from "next-auth/react";
import EditOddSeizeForm from "./EditOddSeizeForm";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";
import {toast} from "sonner";
import {deleteOddSeize} from "@/services/api/oddl/get-odd-seize.api";

export function ODDLSeizeRow({odd, onDelete}: { odd: OddSeize; onDelete: (id: string) => void }) {
    const {data: session} = useSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const token = session?.user?.token || "";

            // Utilisation de la fonction d'API pour la suppression
            const result = await deleteOddSeize(
                odd.id_odds_16.toString(),
                token
            );

            if (result.success) {
                onDelete(odd.id_odds_16.toString());
                toast.success("Indicateur ODD 16 supprimé avec succès");
            } else {
                throw new Error(result.message || "Une erreur est survenue lors de la suppression");
            }
        } catch (error: unknown) {
            console.error("Erreur lors de la suppression:", error);

            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`);
            } else {
                toast.error(`Une erreur inattendue s'est produite: ${String(error)}`);
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        // Après sauvegarde réussie, nous rechargeons les données
        onDelete(odd.id_odds_16.toString()); // Cette fonction est en fait utilisée pour rafraîchir les données
    };

    return (
        <>
            <TableRow>
                <TableCell>{odd.id_odds_16}</TableCell>
                <TableCell>{odd.proportion_jeunes_femmes_hommes_violences_sexuelles}%</TableCell>
                <TableCell>{odd.proportion_victimes_signalees_violences}%</TableCell>
                <TableCell>{odd.proportion_population_carcérale_instance_jugement}%</TableCell>
                <TableCell>{odd.nombre_vindictes_populaires}</TableCell>
                <TableCell>{odd.valeur_flux_financiers_illicites.toLocaleString()} MGA</TableCell>
                <TableCell>{odd.indice_perception_corruption}</TableCell>
                <TableCell>{odd.proportion_population_satisfaction_services_publics}%</TableCell>
                <TableCell>{odd.repartition_postes_publics_sexe_âge_handicap}%</TableCell>
                <TableCell>{odd.proportion_population_prise_decisions_ouverte_reactive}%</TableCell>
                <TableCell>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                            Éditer
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                        >
                            Supprimer
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            <EditOddSeizeForm
                odd={odd}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={odd.id_odds_16.toString()}
                isDeleting={isDeleting}
                title="Supprimer l'indicateur ODD 16"
                message={`Êtes-vous sûr de vouloir supprimer cet indicateur ODD 16 ? Cette action est irréversible.`}
            />
        </>
    );
}

export default ODDLSeizeRow;
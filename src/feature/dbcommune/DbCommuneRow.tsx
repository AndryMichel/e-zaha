"use client";

import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {Button} from "@/components/ui/atomes/button";
import {Commune} from "@/services/types/dbcommune.type";
import {useSession} from "next-auth/react";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/molécules/dialog";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";
import {DbCommuneInfoGenRow} from "./dbcommunerow/DbCommuneInfoGenRow";
import {DbCommunePersonnelRow} from "./dbcommunerow/DbCommunePersonnelRow";
import {DbCommuneDemographieRow} from "./dbcommunerow/DbCommuneDemographieRow";
import {DbCommuneSanteRow} from "./dbcommunerow/DbCommuneSanteRow";
import {DbCommuneEducationRow} from "./dbcommunerow/DbCommuneEducationRow";
import {DbCommuneInfrastructureRow} from "./dbcommunerow/DbCommuneInfrastructureRow";
import {DbCommuneSecuriteRow} from "./dbcommunerow/DbCommuneSecuriteRow";
import {DbCommuneEconomieRow} from "./dbcommunerow/DbCommuneEconomieRow";
import {DbCommuneEnvironnementRow} from "./dbcommunerow/DbCommuneEnvironnementRow";
import {DbCommuneGouvernanceRow} from "./dbcommunerow/DbCommuneGouvernanceRow";
import {toast} from "sonner";
import {deleteCommune} from "@/services/api/commune/get-dbCommune.api";
import EditCommuneForm from "./EditCommuneForm";

export function DbCommuneRow({commune, onDelete}: { commune: Commune; onDelete: (id: number) => void }) {
    const {data: session} = useSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const token = session?.user?.token || "";

            await deleteCommune(
                commune.id_situation_geographique,
                token
            );
            onDelete(commune.id_situation_geographique);
            toast.success("Commune supprimée avec succès");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`);
            } else {
                toast.error(`Une erreur inattendue s'est produite: ${String(error)}`);
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    const formatValue = (value: string | number | boolean | null | undefined) => {
        if (value === null || value === undefined) return "N/A";
        if (typeof value === 'number') return value.toLocaleString();
        return String(value);
    };

    return (
        <>
            <TableRow className="hover:bg-gray-50/50">
                <TableCell className="min-w-[120px] max-w-[120px] px-4 font-mono text-sm">
                    <div className="break-words">
                        {commune.id_situation_geographique}
                    </div>
                </TableCell>
                <TableCell className="min-w-[180px] max-w-[180px] px-4 font-medium">
                    <div className="break-words leading-tight">
                        {commune.localisation.commune}
                    </div>
                </TableCell>
                <TableCell className="min-w-[170px] max-w-[170px] px-4">
                    <div className="break-words leading-tight">
                        {commune.localisation.district}
                    </div>
                </TableCell>
                <TableCell className="min-w-[160px] max-w-[160px] px-4">
                    <div className="break-words leading-tight">
                        {commune.localisation.region}
                    </div>
                </TableCell>
                <TableCell className="min-w-[160px] max-w-[160px] px-4">
                    <div className="break-words leading-tight">
                        {commune.localisation.province}
                    </div>
                </TableCell>
                <TableCell className="min-w-[140px] max-w-[140px] px-4 text-right">
                    <div className="break-words">
                        {formatValue(commune.superficie)} km²
                    </div>
                </TableCell>
                <TableCell className="min-w-[150px] max-w-[150px] px-4">
                    <div className="break-words leading-tight">
                        {commune.personnel_cle.maire.nom_prenoms}
                    </div>
                </TableCell>
                <TableCell className="min-w-[120px] max-w-[120px] px-4 text-right">
                    <div className="break-words">
                        {formatValue(commune.situation_demographique.effectif_total)}
                    </div>
                </TableCell>
                <TableCell className="min-w-[140px] max-w-[140px] px-4 text-center">
                    <div className="break-words">
                        {formatValue(commune.etablissements_educatifs.primaire.effectif_total)}
                    </div>
                </TableCell>
                <TableCell className="min-w-[80px] max-w-[80px] px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        commune.centres_de_sante.csb1.dispose
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        {formatBoolean(commune.centres_de_sante.csb1.dispose)}
                    </span>
                </TableCell>
                <TableCell className="min-w-[80px] max-w-[80px] px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        commune.centres_de_sante.csb2.dispose
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        {formatBoolean(commune.centres_de_sante.csb2.dispose)}
                    </span>
                </TableCell>
                <TableCell className="min-w-[200px] px-4">
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDetailsOpen(true)}
                            className="text-xs px-2 py-1 h-7"
                        >
                            Détails
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditOpen(true)}
                            className="text-xs px-2 py-1 h-7"
                        >
                            Éditer
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 text-xs px-2 py-1 h-7"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            Supprimer
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Détails de la commune - {commune.localisation.commune}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <DbCommuneInfoGenRow commune={commune}/>
                        <DbCommunePersonnelRow personnel={commune.personnel_cle}/>
                        <DbCommuneDemographieRow demographie={commune.situation_demographique}/>
                        <DbCommuneSanteRow sante={commune.centres_de_sante}/>
                        <DbCommuneEducationRow education={commune.etablissements_educatifs}/>
                        <DbCommuneInfrastructureRow infrastructure={commune.eau_assainissement_electricite}/>
                        <DbCommuneSecuriteRow securite={commune.securite}/>
                        <DbCommuneEconomieRow economie={commune.situation_economique}/>
                        <DbCommuneEnvironnementRow environnement={commune.environnement}/>
                        <DbCommuneGouvernanceRow gouvernance={commune.gouvernance}/>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            onClick={() => setIsDetailsOpen(false)}
                            variant="outline"
                        >
                            Fermer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Ajout du composant EditCommuneForm */}
            {isEditOpen && (
                <EditCommuneForm
                    commune={commune}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSave={() => {
                        // Rafraîchir les données après la sauvegarde
                        onDelete(commune.id_situation_geographique);
                    }}
                />
            )}

            {/* Delete confirmation modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={commune.id_situation_geographique.toString()}
                isDeleting={isDeleting}
                title="Supprimer la commune"
                message={`Êtes-vous sûr de vouloir supprimer la commune ${commune.localisation.commune} ? Cette action est irréversible.`}
            />
        </>
    );
}
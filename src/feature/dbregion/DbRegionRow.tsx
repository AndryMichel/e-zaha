"use client";

import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {Button} from "@/components/ui/atomes/button";
import {Region} from "@/services/types/dbregion.type";
import EditDbRegionForm from "./EditRegionForm";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";
import {useSession} from "next-auth/react";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/molécules/dialog";
import {DbRegionInfoGenRow} from "./dbregionrow/DbRegionInfoGenRow";
import {DbRegionSectorielRow} from "./dbregionrow/DbRegionSectorielRow";
import {DbRegionGouvernanceRow} from "./dbregionrow/DbRegionGouvernanceRow";
import {DbRegionEnvironnementRow} from "./dbregionrow/DbRegionEnvironnementRow";
import {DbRegionStaffRow} from "@/feature/dbregion/dbregionrow/DbRegionStaffRow";
import {DbRegionStaffCROCRow} from "@/feature/dbregion/dbregionrow/DbRegionStaffCROCRow";
import {dbregionApi} from "@/services/api/region/get-dbregion.api";

export function DbRegionRow({region, onDelete}: { region: Region; onDelete: (id: number) => void }) {
    const {data: session} = useSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const token = session?.user?.token || "";

            // Utiliser l'API directement au lieu du proxy
            const result = await dbregionApi.deleteRegion(
                region.id_situation_geographique,
                token
            );

            if (result.success) {
                onDelete(region.id_situation_geographique);
            } else {
                throw new Error(result.message || "Erreur lors de la suppression");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`Erreur: ${error.message}`);
            } else {
                alert(`Une erreur inattendue s'est produite: ${String(error)}`);
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    // Formatter pour les valeurs booléennes
    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    // Formatter pour les valeurs en pourcentage
    const formatPercentage = (value: unknown) => {
        const num = Number(value);
        return isNaN(num) ? "N/A" : `${num.toFixed(1)}%`;
    };

    return (
        <>
            <TableRow>
                <TableCell>{region.id_situation_geographique}</TableCell>
                <TableCell>{region.region_nom}</TableCell>
                <TableCell>{region.effectif_commune}</TableCell>
                <TableCell>{region.effectif_district}</TableCell>
                <TableCell>{region.superficie_region_km2} km²</TableCell>
                <TableCell>{formatBoolean(region.gouvernance_region.src_operationnelle)}</TableCell>
                <TableCell>{formatBoolean(region.gouvernance_region.srat_a_jour)}</TableCell>
                <TableCell>{formatBoolean(region.gouvernance_region.prd_a_jour)}</TableCell>
                <TableCell>{formatBoolean(region.environnement_region.structure_gestion_risques)}</TableCell>
                <TableCell>{region.staff_region.gouverneur_nom}</TableCell>
                <TableCell>{formatPercentage(region.indicateurs_sectoriels.taux_acces_eau_base)}</TableCell>
                <TableCell>{formatPercentage(region.indicateurs_sectoriels.taux_acces_electricite)}</TableCell>
                <TableCell>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(true)}>
                            Détails
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                            Éditer
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600"
                                onClick={() => setIsDeleteOpen(true)}>
                            Supprimer
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {/* Modal pour afficher tous les détails en utilisant les composants sectionnels */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Détails de la région - {region.region_nom}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Informations générales */}
                        <DbRegionInfoGenRow region={region}/>
                        <DbRegionGouvernanceRow gouvernance={region.gouvernance_region}/>
                    </div>

                    {/* Personnel régional */}
                    <DbRegionStaffRow StaffRegion={region.staff_region}/>

                    {/* Personnel CROC régional */}
                    <DbRegionStaffCROCRow StaffCrocRegion={region.staff_croc_region}/>

                    {/* Section pour les indicateurs sectoriels utilisant le composant dédié */}
                    <h3 className="font-bold my-4 text-xl text-blue-700">Indicateurs sectoriels</h3>
                    <DbRegionSectorielRow indicateurs={region.indicateurs_sectoriels}/>

                    {/* Environnement */}
                    <DbRegionEnvironnementRow EnvironnementRegion={region.environnement_region}/>

                    <div className="flex justify-end mt-6">
                        <Button onClick={() => setIsDetailsOpen(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white">
                            Fermer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit form */}
            {isEditOpen && (
                <EditDbRegionForm
                    region={region}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSave={() => onDelete(region.id_situation_geographique)}
                />
            )}

            {/* Delete confirmation modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={region.id_situation_geographique.toString()}
                isDeleting={isDeleting}
                title="Supprimer la région"
                message={`Êtes-vous sûr de vouloir supprimer la région ${region.region_nom} ? Cette action est irréversible.`}
            />
        </>
    );
}
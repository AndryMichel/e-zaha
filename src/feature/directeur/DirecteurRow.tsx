// DirecteurRow.tsx
"use client";

import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {Button} from "@/components/ui/atomes/button";
import {Badge} from "@/components/ui/atomes/badge";
import {Crown, Edit, Eye, Trash2} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import Image from "next/image";
import {DirecteurItem} from "@/services/types/directeur.type";
import {deleteDirecteur} from "@/services/api/directeur/directeur.api";
import {getImageUrl} from "@/services/helpers/imageUtils";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";
import {EditDirecteurModal} from "@/feature/directeur/EditDirecteurModal";

interface DirecteurRowProps {
    directeurItem: DirecteurItem;
    isActuel: boolean;
    onDelete: () => void;
    onUpdate: () => void;
    formatDate: (date: string) => string;
}

export function DirecteurRow({
                                 directeurItem,
                                 isActuel,
                                 onDelete,
                                 onUpdate,
                                 formatDate
                             }: DirecteurRowProps) {
    const {data: session} = useSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const token = session?.user?.token || "";

            const result = await deleteDirecteur(directeurItem.id, token);

            if (result.success) {
                onDelete();
                toast.success("Directeur supprimé avec succès");
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
        onUpdate();
        setIsEditModalOpen(false);
    };

    const getFullName = () => {
        return `${directeurItem.nom}${directeurItem.prenom ? ` ${directeurItem.prenom}` : ''}`;
    };

    return (
        <>
            <TableRow
                className={`hover:bg-gray-50 transition-colors ${isActuel ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
                {/* ID */}
                <TableCell className="font-medium text-gray-900">
                    #{directeurItem.id}
                </TableCell>

                {/* Photo */}
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div
                            className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            <Image
                                src={getImageUrl(directeurItem.image_url)}
                                alt={`Photo de ${getFullName()}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform"
                                sizes="64px"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsImageModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Eye className="h-4 w-4 mr-1"/>
                            Voir
                        </Button>
                    </div>
                </TableCell>

                {/* Nom */}
                <TableCell>
                    <div className="font-medium text-gray-900">{directeurItem.nom}</div>
                </TableCell>

                {/* Prénom */}
                <TableCell>
                    <div className="text-gray-700">{directeurItem.prenom || "-"}</div>
                </TableCell>

                {/* Description */}
                <TableCell>
                    <div className="max-w-xs text-sm text-gray-600">
                        {directeurItem.description ? (
                            <div className="truncate" title={directeurItem.description}>
                                {directeurItem.description}
                            </div>
                        ) : (
                            <span className="text-gray-400 italic">Aucune description</span>
                        )}
                    </div>
                </TableCell>

                {/* Date de création */}
                <TableCell>
                    <div className="text-sm text-gray-700">
                        {formatDate(directeurItem.created_at)}
                    </div>
                    {directeurItem.updated_at !== directeurItem.created_at && (
                        <div className="text-xs text-gray-500">
                            Modifié: {formatDate(directeurItem.updated_at)}
                        </div>
                    )}
                </TableCell>

                {/* Statut */}
                <TableCell>
                    {isActuel ? (
                        <Badge variant="default" className="bg-green-600 text-white">
                            <Crown className="h-3 w-3 mr-1"/>
                            Directeur actuel
                        </Badge>
                    ) : (
                        <Badge variant="outline">
                            Archivé
                        </Badge>
                    )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="hover:bg-blue-50 hover:border-blue-300"
                        >
                            <Edit className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            className="hover:bg-red-50 hover:border-red-300 text-red-600"
                        >
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {/* Modal d'édition */}
            <EditDirecteurModal
                directeurItem={directeurItem}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={directeurItem.id.toString()}
                isDeleting={isDeleting}
                title="Supprimer le directeur"
                message={`Êtes-vous sûr de vouloir supprimer "${getFullName()}" ? Cette action est irréversible.${isActuel ? '\n\nAttention: Ce directeur est actuellement affiché au public !' : ''}`}
            />

            {/* Modal d'affichage de la photo en grand */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div className="relative max-w-2xl max-h-[80vh] w-full h-full">
                        <Image
                            src={getImageUrl(directeurItem.image_url)}
                            alt={`Photo de ${getFullName()}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 768px"
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-4 right-4"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            Fermer
                        </Button>
                        <div
                            className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-3 rounded-lg">
                            <div className="text-lg font-medium">{getFullName()}</div>
                            {directeurItem.description && (
                                <div className="text-sm opacity-80">{directeurItem.description}</div>
                            )}
                            <div className="text-xs opacity-60 mt-1">
                                Créé le {formatDate(directeurItem.created_at)}
                            </div>
                            {isActuel && (
                                <Badge variant="default" className="bg-green-600 text-white mt-2">
                                    <Crown className="h-3 w-3 mr-1"/>
                                    Directeur actuel
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DirecteurRow;
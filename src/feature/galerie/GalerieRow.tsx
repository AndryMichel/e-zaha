"use client";

import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {Button} from "@/components/ui/atomes/button";
import {Badge} from "@/components/ui/atomes/badge";
import {Edit, Eye, Trash2} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import Image from "next/image";
import {GalerieItem} from "@/services/types/galerie.type";
import {deleteGalerie} from "@/services/api/galerie/galerie.api";
import {getImageUrl} from "@/services/helpers/imageUtils";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";
import EditGalerieModal from "@/feature/galerie/EditGalerieModal";

interface GalerieRowProps {
    galerieItem: GalerieItem;
    onDelete: () => void;
    onUpdate: () => void;
    formatDate: (date: string) => string;
    getCategoryVariant: (category: string) => "default" | "secondary" | "destructive" | "outline";
    getCategoryLabel: (category: string) => string;
}

export function GalerieRow({
                               galerieItem,
                               onDelete,
                               onUpdate,
                               formatDate,
                               getCategoryVariant,
                               getCategoryLabel
                           }: GalerieRowProps) {
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

            const result = await deleteGalerie(galerieItem.id, token);

            if (result.success) {
                onDelete();
                toast.success("Image supprimée avec succès");
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

    return (
        <>
            <TableRow className="hover:bg-gray-50 transition-colors">
                {/* ID */}
                <TableCell className="font-medium text-gray-900">
                    #{galerieItem.id}
                </TableCell>

                {/* Image */}
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div
                            className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            <Image
                                src={getImageUrl(galerieItem.image_url)}
                                alt={`Image ${galerieItem.category}`}
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

                {/* Catégorie */}
                <TableCell>
                    <Badge variant={getCategoryVariant(galerieItem.category)}>
                        {getCategoryLabel(galerieItem.category)}
                    </Badge>
                </TableCell>

                {/* Date de création */}
                <TableCell>
                    <div className="text-sm text-gray-700">
                        {formatDate(galerieItem.created_at)}
                    </div>
                    {galerieItem.updated_at !== galerieItem.created_at && (
                        <div className="text-xs text-gray-500">
                            Modifié: {formatDate(galerieItem.updated_at)}
                        </div>
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
            <EditGalerieModal
                galerieItem={galerieItem}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={galerieItem.id.toString()}
                isDeleting={isDeleting}
                title="Supprimer l'image"
                message={`Êtes-vous sûr de vouloir supprimer cette image de la catégorie "${getCategoryLabel(galerieItem.category)}" ? Cette action est irréversible.`}
            />

            {/* Modal d'affichage de l'image en grand */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
                        <Image
                            src={getImageUrl(galerieItem.image_url)}
                            alt={`Image ${galerieItem.category}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1200px) 100vw, 1200px"
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
                            className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
                            <div className="text-sm font-medium">{getCategoryLabel(galerieItem.category)}</div>
                            <div className="text-xs opacity-80">{formatDate(galerieItem.created_at)}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default GalerieRow;
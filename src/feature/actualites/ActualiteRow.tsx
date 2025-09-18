"use client";

import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {Button} from "@/components/ui/atomes/button";
import {Badge} from "@/components/ui/atomes/badge";
import {Edit, ExternalLink, Image as ImageIcon, Trash2} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import Image from "next/image";
import Link from "next/link";
import {Actualite} from "@/services/types/actualite.type";
import {deleteActualite} from "@/services/api/actualites/actualite.api";
import {getImageUrl} from "@/services/helpers/imageUtils";
import EditActualiteModal from "./EditActualiteModal";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";

interface ActualiteRowProps {
    actualite: Actualite;
    onDelete: () => void;
    onUpdate: () => void;
    formatDate: (date: string) => string;
    getTypeVariant: (type: string) => "default" | "secondary" | "destructive" | "outline";
}

export function ActualiteRow({
                                 actualite,
                                 onDelete,
                                 onUpdate,
                                 formatDate,
                                 getTypeVariant
                             }: ActualiteRowProps) {
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

            const result = await deleteActualite(actualite.id, token);

            if (result.success) {
                onDelete();
                toast.success("Actualité supprimée avec succès");
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

    // Tronquer le contenu pour l'affichage dans le tableau
    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    };

    return (
        <>
            <TableRow className="hover:bg-gray-50 transition-colors">
                {/* ID */}
                <TableCell className="font-medium text-gray-900">
                    #{actualite.id}
                </TableCell>

                {/* Titre */}
                <TableCell className="max-w-xs">
                    <div className="font-medium text-gray-900 mb-1">
                        {actualite.titre}
                    </div>
                    <Link
                        href={`/actualites/${actualite.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        target="_blank"
                    >
                        Voir public <ExternalLink className="h-3 w-3"/>
                    </Link>
                </TableCell>

                {/* Contenu */}
                <TableCell className="max-w-md">
                    <div className="text-sm text-gray-700">
                        {truncateContent(actualite.contenu)}
                    </div>
                </TableCell>

                {/* Type */}
                <TableCell>
                    <Badge variant={getTypeVariant(actualite.type)}>
                        {actualite.type === "actualite" ? "Actualité" : "Annonce"}
                    </Badge>
                </TableCell>

                {/* Image */}
                <TableCell>
                    {actualite.image_url ? (
                        <div className="flex items-center gap-2">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                                <Image
                                    src={getImageUrl(actualite.image_url)}
                                    alt={actualite.titre}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                />
                            </div>
                            <div className="text-xs text-green-600 flex items-center gap-1">
                                <ImageIcon className="h-3 w-3"/>
                                Image
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                            <ImageIcon className="h-3 w-3"/>
                            Aucune image
                        </div>
                    )}
                </TableCell>

                {/* Date de création */}
                <TableCell>
                    <div className="text-sm text-gray-700">
                        {formatDate(actualite.created_at)}
                    </div>
                    {actualite.updated_at !== actualite.created_at && (
                        <div className="text-xs text-gray-500">
                            Modifié: {formatDate(actualite.updated_at)}
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
            <EditActualiteModal
                actualite={actualite}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={actualite.id.toString()}
                isDeleting={isDeleting}
                title="Supprimer l'actualité"
                message={`Êtes-vous sûr de vouloir supprimer l'actualité "${actualite.titre}" ? Cette action est irréversible.`}
            />
        </>
    );
}

export default ActualiteRow;
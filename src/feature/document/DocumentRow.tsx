import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/organismes/table";
import {Button} from "@/components/ui/atomes/button";
import {Badge} from "@/components/ui/atomes/badge";
import {Download, Edit, ExternalLink, FileText, Trash2} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import {CATEGORY_LABELS, CATEGORY_URLS, Document} from "@/services/types/document.type";
import {deleteDocument} from "@/services/api/documents/document.api";
import {getDocumentUrl, getFileIcon} from "@/services/helpers/documentUtils";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";
import {EditDocumentModal} from "@/feature/document/EditDocumentModal";

interface DocumentRowProps {
    document: Document;
    onDelete: () => void;
    onUpdate: () => void;
    formatDate: (date: string) => string;
    getCategoryVariant: (category: string) => "default" | "secondary" | "destructive" | "outline";
}

export function DocumentRow({
                                document: doc,
                                onDelete,
                                onUpdate,
                                formatDate,
                                getCategoryVariant
                            }: DocumentRowProps) {
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

            const result = await deleteDocument(doc.id_doc, token);

            if (result.success) {
                onDelete();
                toast.success("Document supprimé avec succès");
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

    // Tronquer la description pour l'affichage dans le tableau
    const truncateDescription = (description: string, maxLength: number = 100) => {
        if (!description) return "-";
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength) + "...";
    };

    const getFileExtension = (fileUrl: string) => {
        return fileUrl.split('.').pop()?.toUpperCase() || 'FILE';
    };

    return (
        <>
            <TableRow className="hover:bg-gray-50 transition-colors">
                {/* ID */}
                <TableCell className="font-medium text-gray-900">
                    #{doc.id_doc}
                </TableCell>

                {/* Catégorie */}
                <TableCell>
                    <Badge variant={getCategoryVariant(doc.category)}>
                        {CATEGORY_LABELS[doc.category]}
                    </Badge>
                </TableCell>

                {/* Titre */}
                <TableCell className="max-w-xs">
                    <div className="font-medium text-gray-900 mb-1">
                        {doc.titre}
                    </div>
                    <a
                        href={CATEGORY_URLS[doc.category]}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Voir dans {CATEGORY_LABELS[doc.category]} <ExternalLink className="h-3 w-3"/>
                    </a>
                </TableCell>

                {/* Description */}
                <TableCell className="max-w-md">
                    <div className="text-sm text-gray-700">
                        {truncateDescription(doc.description)}
                    </div>
                </TableCell>

                {/* Fichier */}
                <TableCell>
                    {doc.file_url ? (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{getFileIcon(doc.file_url)}</span>
                                <div className="text-xs">
                                    <div className="font-medium text-gray-700">
                                        {getFileExtension(doc.file_url)}
                                    </div>
                                    <a
                                        href={getDocumentUrl(doc.file_url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        Ouvrir <ExternalLink className="h-2.5 w-2.5"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                            <FileText className="h-3 w-3"/>
                            Aucun fichier
                        </div>
                    )}
                </TableCell>

                {/* Date de création */}
                <TableCell>
                    <div className="text-sm text-gray-700">
                        {formatDate(doc.created_at)}
                    </div>
                    {doc.updated_at !== doc.created_at && (
                        <div className="text-xs text-gray-500">
                            Modifié: {formatDate(doc.updated_at)}
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
                        {doc.file_url && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = getDocumentUrl(doc.file_url);
                                    link.download = doc.titre + '.' + getFileExtension(doc.file_url).toLowerCase();
                                    link.click();
                                }}
                                className="hover:bg-green-50 hover:border-green-300"
                            >
                                <Download className="h-4 w-4"/>
                            </Button>
                        )}
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
            <EditDocumentModal
                document={doc}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
            />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={doc.id_doc.toString()}
                isDeleting={isDeleting}
                title="Supprimer le document"
                message={`Êtes-vous sûr de vouloir supprimer le document "${doc.titre}" ? Cette action est irréversible.`}
            />
        </>
    );
}
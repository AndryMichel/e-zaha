import React, {useEffect, useRef, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/molécules/dialog";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {Textarea} from "@/components/ui/atomes/textarea";
import {Label} from "@/components/ui/atomes/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {FileText, Loader2, Save, X} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import {updateDocument, uploadDocument} from "@/services/api/documents/document.api";
import {ALLOWED_EXTENSIONS, CATEGORY_LABELS, Document, UpdateDocumentRequest} from "@/services/types/document.type";
import {getFileIcon} from "@/services/helpers/documentUtils";

interface EditDocumentModalProps {
    document: Document;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function EditDocumentModal({document, isOpen, onClose, onSave}: EditDocumentModalProps) {
    const {data: session} = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UpdateDocumentRequest>({
        id_doc: document.id_doc,
        category: document.category,
        titre: document.titre,
        description: document.description,
        file_url: document.file_url
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentFileUrl, setCurrentFileUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Réinitialiser le formulaire quand le document change
    useEffect(() => {
        if (document) {
            setFormData({
                id_doc: document.id_doc,
                category: document.category,
                titre: document.titre,
                description: document.description || "",
                file_url: document.file_url
            });

            setCurrentFileUrl(document.file_url || "");
            setSelectedFile(null);
        }
    }, [document]);

    const resetForm = () => {
        setFormData({
            id_doc: document.id_doc,
            category: document.category,
            titre: document.titre,
            description: document.description || "",
            file_url: document.file_url
        });
        setCurrentFileUrl(document.file_url || "");
        setSelectedFile(null);
        setIsUploading(false);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (field: keyof UpdateDocumentRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validation de l'extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !(ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
            toast.error("Type de fichier non autorisé. Utilisez PDF, Word, Excel ou PowerPoint");
            return;
        }

        // Validation de la taille (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error("Le fichier est trop volumineux. Taille maximum: 10MB");
            return;
        }

        setSelectedFile(file);
    };

    const handleRemoveCurrentFile = () => {
        setCurrentFileUrl("");
        setFormData(prev => ({
            ...prev,
            file_url: ""
        }));
    };

    const handleRemoveNewFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadDocument = async (): Promise<string | null> => {
        if (!selectedFile) return null;

        try {
            setIsUploading(true);
            const token = session?.user?.token || "";

            const result = await uploadDocument(selectedFile, token);

            if (result.success && result.file_url) {
                toast.success("Document uploadé avec succès");
                return result.file_url;
            } else {
                throw new Error(result.message || "Erreur lors de l'upload");
            }
        } catch (error) {
            console.error("Erreur upload:", error);
            toast.error("Erreur lors de l'upload du document");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault();

        if (!formData.titre?.trim()) {
            toast.error("Le titre est obligatoire");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = session?.user?.token || "";

            // Déterminer l'URL du fichier final
            let finalFileUrl = formData.file_url;

            // Si un nouveau fichier a été sélectionné, l'uploader
            if (selectedFile) {
                const uploadedUrl = await handleUploadDocument();
                if (uploadedUrl) {
                    finalFileUrl = uploadedUrl;
                }
            }

            // Préparer les données de mise à jour
            const dataToSubmit: UpdateDocumentRequest = {
                id_doc: document.id_doc,
                category: formData.category,
                titre: formData.titre.trim(),
                description: formData.description?.trim() || "",
                file_url: finalFileUrl
            };

            const result = await updateDocument(dataToSubmit, token);

            if (result.success) {
                toast.success("Document mis à jour avec succès");
                onSave();
                handleClose();
            } else {
                throw new Error(result.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.error("Erreur mise à jour:", error);
            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`);
            } else {
                toast.error("Une erreur inattendue s'est produite");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier le document</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de ce document. ID: #{document.id_doc}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Catégorie */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Catégorie *</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange("category", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la catégorie"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ressources">{CATEGORY_LABELS.ressources}</SelectItem>
                                <SelectItem value="textes">{CATEGORY_LABELS.textes}</SelectItem>
                                <SelectItem value="travail">{CATEGORY_LABELS.travail}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Titre */}
                    <div className="space-y-2">
                        <Label htmlFor="titre">Titre *</Label>
                        <Input
                            id="titre"
                            value={formData.titre}
                            onChange={(e) => handleInputChange("titre", e.target.value)}
                            placeholder="Ex: Guide du Maire"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optionnel)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Description du document"
                            rows={3}
                        />
                    </div>

                    {/* Gestion des fichiers */}
                    <div className="space-y-4">
                        <Label>Fichier</Label>

                        {/* Fichier actuel */}
                        {currentFileUrl && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700">Fichier actuel:</div>
                                <div className="relative">
                                    <div
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <span className="text-3xl">{getFileIcon(currentFileUrl)}</span>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                Document actuel
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {currentFileUrl.split('/').pop()}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveCurrentFile}
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Nouveau fichier sélectionné */}
                        {selectedFile && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700">Nouveau fichier:</div>
                                <div className="relative">
                                    <div
                                        className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <span className="text-3xl">{getFileIcon(selectedFile.name)}</span>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveNewFile}
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sélecteur de nouveau fichier */}
                        <div>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2"/>
                                <div className="text-sm text-gray-600 mb-1">
                                    {currentFileUrl || selectedFile ? "Remplacer le fichier" : "Sélectionner un fichier"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    PDF, Word, Excel ou PowerPoint - Max 10MB
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting || isUploading}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isUploading || !formData.titre?.trim()}
                        className="min-w-[120px]"
                    >
                        {isSubmitting || isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                {isUploading ? "Upload..." : "Sauvegarde..."}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2"/>
                                Sauvegarder
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
"use client";

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
import {Image as ImageIcon, Loader2, Save, X} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import Image from "next/image";
import {updateActualite, uploadImage} from "@/services/api/actualites/actualite.api";
import {Actualite, UpdateActualiteRequest} from "@/services/types/actualite.type";

interface EditActualiteModalProps {
    actualite: Actualite;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function EditActualiteModal({actualite, isOpen, onClose, onSave}: EditActualiteModalProps) {
    const {data: session} = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UpdateActualiteRequest>({
        id: actualite.id,
        titre: actualite.titre,
        contenu: actualite.contenu,
        type: actualite.type,
        image_url: actualite.image_url || ""
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Réinitialiser le formulaire quand l'actualité change
    useEffect(() => {
        if (actualite) {
            setFormData({
                id: actualite.id,
                titre: actualite.titre,
                contenu: actualite.contenu,
                type: actualite.type,
                image_url: actualite.image_url || ""
            });

            setCurrentImageUrl(actualite.image_url || "");
            setSelectedFile(null);
            setPreviewUrl("");
        }
    }, [actualite]);

    const resetForm = () => {
        setFormData({
            id: actualite.id,
            titre: actualite.titre,
            contenu: actualite.contenu,
            type: actualite.type,
            image_url: actualite.image_url || ""
        });
        setCurrentImageUrl(actualite.image_url || "");
        setSelectedFile(null);
        setPreviewUrl("");
        setIsUploading(false);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (field: keyof UpdateActualiteRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validation du type de fichier
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Type de fichier non autorisé. Utilisez JPG, PNG ou WebP");
            return;
        }

        // Validation de la taille (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Le fichier est trop volumineux. Taille maximum: 5MB");
            return;
        }

        setSelectedFile(file);

        // Créer une preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveCurrentImage = () => {
        setCurrentImageUrl("");
        setFormData(prev => ({
            ...prev,
            image_url: ""
        }));
    };

    const handleRemoveNewImage = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadImage = async (): Promise<string | null> => {
        if (!selectedFile) return null;

        try {
            setIsUploading(true);
            const token = session?.user?.token || "";

            const result = await uploadImage(selectedFile, token);

            if (result.success && result.image_url) {
                toast.success("Image uploadée avec succès");
                return result.image_url;
            } else {
                throw new Error(result.message || "Erreur lors de l'upload");
            }
        } catch (error) {
            console.error("Erreur upload:", error);
            toast.error("Erreur lors de l'upload de l'image");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.titre?.trim() || !formData.contenu?.trim()) {
            toast.error("Le titre et le contenu sont obligatoires");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = session?.user?.token || "";

            // Déterminer l'URL de l'image finale
            let finalImageUrl = formData.image_url;

            // Si une nouvelle image a été sélectionnée, l'uploader
            if (selectedFile) {
                const uploadedUrl = await handleUploadImage();
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                }
            }

            // Préparer les données de mise à jour
            const dataToSubmit: UpdateActualiteRequest = {
                id: actualite.id,
                titre: formData.titre.trim(),
                contenu: formData.contenu.trim(),
                type: formData.type,
                image_url: finalImageUrl
            };

            const result = await updateActualite(dataToSubmit, token);

            if (result.success) {
                toast.success("Actualité mise à jour avec succès");
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

    const displayImageUrl = (url: string) => {
        if (!url) return "";
        return url.startsWith('http') ? url : `https://observatoireddl.mg${url}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier l&#39;actualité</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de cette actualité. ID: #{actualite.id}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Titre */}
                    <div className="space-y-2">
                        <Label htmlFor="titre">Titre *</Label>
                        <Input
                            id="titre"
                            value={formData.titre}
                            onChange={(e) => handleInputChange("titre", e.target.value)}
                            placeholder="Entrez le titre de l'actualité"
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => handleInputChange("type", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="actualite">Actualité</SelectItem>
                                <SelectItem value="annonce">Annonce</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Contenu */}
                    <div className="space-y-2">
                        <Label htmlFor="contenu">Contenu *</Label>
                        <Textarea
                            id="contenu"
                            value={formData.contenu}
                            onChange={(e) => handleInputChange("contenu", e.target.value)}
                            placeholder="Entrez le contenu de l'actualité"
                            rows={6}
                            required
                        />
                    </div>

                    {/* Gestion des images */}
                    <div className="space-y-4">
                        <Label>Image</Label>

                        {/* Image actuelle */}
                        {currentImageUrl && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700">Image actuelle:</div>
                                <div className="relative">
                                    <div
                                        className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={displayImageUrl(currentImageUrl)}
                                            alt="Image actuelle"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={handleRemoveCurrentImage}
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Nouvelle image sélectionnée */}
                        {previewUrl && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700">Nouvelle image:</div>
                                <div className="relative">
                                    <div
                                        className="relative w-full h-48 rounded-lg overflow-hidden border border-green-200">
                                        <Image
                                            src={previewUrl}
                                            alt="Nouvelle image"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={handleRemoveNewImage}
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Sélecteur de nouvelle image */}
                        <div>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2"/>
                                <div className="text-sm text-gray-600 mb-1">
                                    {currentImageUrl || previewUrl ? "Remplacer l'image" : "Sélectionner une image"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    JPG, PNG ou WebP - Max 5MB
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                </form>

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
                        disabled={isSubmitting || isUploading || !formData.titre?.trim() || !formData.contenu?.trim()}
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

export default EditActualiteModal;
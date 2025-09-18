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
import {Label} from "@/components/ui/atomes/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Image as ImageIcon, Loader2, Save, X} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import Image from "next/image";
import {updateGalerie, uploadGalerieImage} from "@/services/api/galerie/galerie.api";
import {GALERIE_CATEGORIES, GalerieItem, UpdateGalerieRequest} from "@/services/types/galerie.type";
import {getImageUrl} from "@/services/helpers/imageUtils";

interface EditGalerieModalProps {
    galerieItem: GalerieItem;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function EditGalerieModal({galerieItem, isOpen, onClose, onSave}: EditGalerieModalProps) {
    const {data: session} = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UpdateGalerieRequest>({
        id: galerieItem.id,
        category: galerieItem.category,
        image_url: galerieItem.image_url
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Réinitialiser le formulaire quand l'item change
    useEffect(() => {
        if (galerieItem) {
            setFormData({
                id: galerieItem.id,
                category: galerieItem.category,
                image_url: galerieItem.image_url
            });

            setCurrentImageUrl(galerieItem.image_url);
            setSelectedFile(null);
            setPreviewUrl("");
        }
    }, [galerieItem]);

    const resetForm = () => {
        setFormData({
            id: galerieItem.id,
            category: galerieItem.category,
            image_url: galerieItem.image_url
        });
        setCurrentImageUrl(galerieItem.image_url);
        setSelectedFile(null);
        setPreviewUrl("");
        setIsUploading(false);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            category: value as UpdateGalerieRequest['category']
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

            const result = await uploadGalerieImage(selectedFile, token);

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

        // Vérifier qu'il y a au moins une image (actuelle ou nouvelle)
        if (!currentImageUrl && !selectedFile) {
            toast.error("Une image est obligatoire");
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
            const dataToSubmit: UpdateGalerieRequest = {
                id: galerieItem.id,
                category: formData.category,
                image_url: finalImageUrl
            };

            const result = await updateGalerie(dataToSubmit, token);

            if (result.success) {
                toast.success("Image mise à jour avec succès");
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier l&#39;image de galerie</DialogTitle>
                    <DialogDescription>
                        Modifiez la catégorie ou remplacez l&#39;image. ID: #{galerieItem.id}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Catégorie */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Catégorie *</Label>
                        <Select
                            value={formData.category}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie"/>
                            </SelectTrigger>
                            <SelectContent>
                                {GALERIE_CATEGORIES.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gestion des images */}
                    <div className="space-y-4">
                        <Label>Image *</Label>

                        {/* Image actuelle */}
                        {currentImageUrl && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700">Image actuelle:</div>
                                <div className="relative">
                                    <div
                                        className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={getImageUrl(currentImageUrl)}
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
                        disabled={isSubmitting || isUploading || (!currentImageUrl && !selectedFile)}
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

export default EditGalerieModal;
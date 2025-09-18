// EditDirecteurModal.tsx
"use client";

import {DirecteurItem, UpdateDirecteurRequest} from "@/services/types/directeur.type";
import {useSession} from "next-auth/react";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {updateDirecteur, uploadDirecteurImage} from "@/services/api/directeur/directeur.api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/molécules/dialog";
import {Label} from "@/components/ui/atomes/label";
import {Input} from "@/components/ui/atomes/input";
import {Textarea} from "@/components/ui/atomes/textarea";
import Image from "next/image";
import {getImageUrl} from "@/services/helpers/imageUtils";
import {Button} from "@/components/ui/atomes/button";
import {Image as ImageIcon, Loader2, Save, X} from "lucide-react";

interface EditDirecteurModalProps {
    directeurItem: DirecteurItem;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function EditDirecteurModal({directeurItem, isOpen, onClose, onSave}: EditDirecteurModalProps) {
    const {data: session} = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UpdateDirecteurRequest>({
        id: directeurItem.id,
        nom: directeurItem.nom,
        prenom: directeurItem.prenom || "",
        description: directeurItem.description || "",
        image_url: directeurItem.image_url
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Réinitialiser le formulaire quand l'item change
    useEffect(() => {
        if (directeurItem) {
            setFormData({
                id: directeurItem.id,
                nom: directeurItem.nom,
                prenom: directeurItem.prenom || "",
                description: directeurItem.description || "",
                image_url: directeurItem.image_url
            });

            setCurrentImageUrl(directeurItem.image_url);
            setSelectedFile(null);
            setPreviewUrl("");
        }
    }, [directeurItem]);

    const resetForm = () => {
        setFormData({
            id: directeurItem.id,
            nom: directeurItem.nom,
            prenom: directeurItem.prenom || "",
            description: directeurItem.description || "",
            image_url: directeurItem.image_url
        });
        setCurrentImageUrl(directeurItem.image_url);
        setSelectedFile(null);
        setPreviewUrl("");
        setIsUploading(false);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (field: keyof UpdateDirecteurRequest, value: string) => {
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

            const result = await uploadDirecteurImage(selectedFile, token);

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

        if (!formData.nom?.trim()) {
            toast.error("Le nom est obligatoire");
            return;
        }

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
            const dataToSubmit: UpdateDirecteurRequest = {
                id: directeurItem.id,
                nom: formData.nom?.trim(),
                prenom: formData.prenom?.trim(),
                description: formData.description?.trim(),
                image_url: finalImageUrl
            };

            const result = await updateDirecteur(dataToSubmit, token);

            if (result.success) {
                toast.success("Directeur mis à jour avec succès");
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
                    <DialogTitle>Modifier le directeur</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du directeur. ID: #{directeurItem.id}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom */}
                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                            id="nom"
                            value={formData.nom || ""}
                            onChange={(e) => handleInputChange("nom", e.target.value)}
                            placeholder="Nom du directeur"
                            required
                        />
                    </div>

                    {/* Prénom */}
                    <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                            id="prenom"
                            value={formData.prenom || ""}
                            onChange={(e) => handleInputChange("prenom", e.target.value)}
                            placeholder="Prénom du directeur"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Description ou titre du directeur"
                            rows={3}
                        />
                    </div>

                    {/* Gestion des images */}
                    <div className="space-y-4">
                        <Label>Photo *</Label>

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
                                    {currentImageUrl || previewUrl ? "Remplacer la photo" : "Sélectionner une photo"}
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
                        disabled={isSubmitting || isUploading || (!currentImageUrl && !selectedFile) || !formData.nom?.trim()}
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
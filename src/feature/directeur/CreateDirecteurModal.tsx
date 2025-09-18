// CreateDirecteurModal.tsx
"use client";

import React, {useRef, useState} from "react";
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
import {Input} from "@/components/ui/atomes/input";
import {Textarea} from "@/components/ui/atomes/textarea";
import {Image as ImageIcon, Loader2, Upload, X} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import Image from "next/image";
import {createDirecteur, uploadDirecteurImage} from "@/services/api/directeur/directeur.api";
import {CreateDirecteurRequest} from "@/services/types/directeur.type";


interface CreateDirecteurModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateDirecteurModal({isOpen, onClose, onSuccess}: CreateDirecteurModalProps) {
    const {data: session} = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<CreateDirecteurRequest>({
        nom: "",
        prenom: "",
        description: "",
        image_url: ""
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setFormData({
            nom: "",
            prenom: "",
            description: "",
            image_url: ""
        });
        setSelectedFile(null);
        setPreviewUrl("");
        setIsUploading(false);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (field: keyof CreateDirecteurRequest, value: string) => {
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

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setFormData(prev => ({
            ...prev,
            image_url: ""
        }));
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

        if (!formData.nom.trim()) {
            toast.error("Le nom est obligatoire");
            return;
        }

        if (!selectedFile) {
            toast.error("Veuillez sélectionner une image");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = session?.user?.token || "";

            // Upload de l'image
            const uploadedUrl = await handleUploadImage();
            if (!uploadedUrl) {
                throw new Error("Échec de l'upload de l'image");
            }

            // Création du directeur
            const dataToSubmit: CreateDirecteurRequest = {
                nom: formData.nom.trim(),
                prenom: formData.prenom?.trim() || "",
                description: formData.description?.trim() || "",
                image_url: uploadedUrl
            };

            const result = await createDirecteur(dataToSubmit, token);

            if (result.success) {
                toast.success("Directeur créé avec succès");
                onSuccess();
                handleClose();
            } else {
                throw new Error(result.message || "Erreur lors de la création");
            }
        } catch (error) {
            console.error("Erreur création:", error);
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
                    <DialogTitle>Ajouter un directeur</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations du directeur et ajoutez sa photo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom */}
                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                            id="nom"
                            value={formData.nom}
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

                    {/* Upload d'image */}
                    <div className="space-y-2">
                        <Label>Photo *</Label>

                        {previewUrl ? (
                            <div className="relative">
                                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4"/>
                                <div className="text-lg font-medium text-gray-600 mb-2">
                                    Cliquez pour sélectionner une photo
                                </div>
                                <div className="text-sm text-gray-500">
                                    JPG, PNG ou WebP - Max 5MB
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
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
                        disabled={isSubmitting || isUploading || !selectedFile || !formData.nom.trim()}
                        className="min-w-[120px]"
                    >
                        {isSubmitting || isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                {isUploading ? "Upload..." : "Création..."}
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2"/>
                                Créer
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


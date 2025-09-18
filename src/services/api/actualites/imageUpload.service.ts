// src/services/api/actualites/imageUpload.service.ts

import {IMAGE_CONFIG} from "@/services/helpers/constant-api";

/**
 * Service d'upload d'images pour les actualités
 * Utilise la configuration centralisée dans constant-api.ts
 */

export interface ImageUploadResponse {
    success: boolean;
    message: string;
    image_url?: string;
    file_info?: {
        filename: string;
        file_size: number;
        content_type: string;
        upload_timestamp: string;
    };
}

/**
 * Upload une image d'actualité
 * Utilise l'URL configurée dans constant-api.ts
 */
export const uploadImageToProduction = async (
    file: File,
    token: string
): Promise<ImageUploadResponse> => {
    try {
        // Validation côté client
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error("Type de fichier non autorisé. Utilisez JPG, PNG ou WebP");
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error("Le fichier est trop volumineux. Taille maximum: 5MB");
        }

        // Préparer FormData
        const formData = new FormData();
        formData.append('image', file);

        // Obtenir l'URL depuis la configuration centralisée
        const uploadUrl = IMAGE_CONFIG.getUploadUrl();
        console.log('🚀 Upload actualité vers:', uploadUrl);

        // Upload
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Ne pas définir Content-Type, le navigateur s'en charge pour FormData
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Upload actualité réussi:', result);
        return result;

    } catch (error) {
        console.error("Erreur upload image actualité:", error);
        throw error;
    }
};

/**
 * Alternative : Upload via base64 si FormData pose problème
 */
export const uploadImageBase64ToProduction = async (
    file: File,
    token: string
): Promise<ImageUploadResponse> => {
    try {
        // Convertir le fichier en base64
        const base64 = await fileToBase64(file);

        const payload = {
            image_data: base64,
            filename: file.name,
            content_type: file.type,
            size: file.size
        };

        const uploadUrl = IMAGE_CONFIG.getUploadUrl();
        const base64Url = `${uploadUrl}-base64`;

        const response = await fetch(base64Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Erreur upload base64 actualité:", error);
        throw error;
    }
};

/**
 * Utilitaire pour convertir un fichier en base64
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Enlever le préfixe "data:image/...;base64,"
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
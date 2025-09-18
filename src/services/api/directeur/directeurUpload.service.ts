// src/services/api/directeur/directeurUpload.service.ts

import {IMAGE_CONFIG} from "@/services/helpers/constant-api";

/**
 * Service d'upload d'images pour le directeur qui utilise la configuration centralisée
 */

export interface DirecteurImageUploadResponse {
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
 * Upload une image de directeur avec fallback automatique
 * Utilise la configuration centralisée dans constant-api.ts
 */
export const uploadDirecteurImageToProduction = async (
    file: File,
    token: string
): Promise<DirecteurImageUploadResponse> => {
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

        // Obtenir les URLs depuis la configuration centralisée
        // Pour le directeur, on utilisera l'endpoint directeur ou fallback sur actualités
        const directeurUrl = IMAGE_CONFIG.getDirecteurUploadUrl();
        const fallbackUrl = IMAGE_CONFIG.getDirecteurFallbackUrl();

        console.log('🚀 Essai endpoint directeur:', directeurUrl);

        // Essayer d'abord l'endpoint directeur
        let response = await fetch(directeurUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        // Si 404, utiliser le fallback
        if (response.status === 404) {
            console.log('⚠️ Endpoint directeur non trouvé, utilisation du fallback actualités');
            console.log('🔄 Fallback vers:', fallbackUrl);

            response = await fetch(fallbackUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
        }

        console.log('📡 Réponse statut:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Upload directeur réussi:', result);

        return result;

    } catch (error) {
        console.error("Erreur upload image directeur:", error);
        throw error;
    }
};
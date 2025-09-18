// src/services/api/documents/documentUpload.service.ts

import {IMAGE_CONFIG} from "@/services/helpers/constant-api";
import {ALLOWED_MIME_TYPES} from "@/services/types/document.type";

/**
 * Service d'upload de documents
 * Utilise la configuration centralisée dans constant-api.ts
 */

export interface DocumentUploadResponse {
    success: boolean;
    message: string;
    file_url?: string;
    file_info?: {
        filename: string;
        original_name: string;
        file_size: number;
        content_type: string;
        upload_timestamp: string;
    };
}

/**
 * Upload un document
 * Utilise l'URL configurée dans constant-api.ts
 */
export const uploadDocumentToProduction = async (
    file: File,
    token: string
): Promise<DocumentUploadResponse> => {
    try {
        // Validation côté client
        if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {

            throw new Error("Type de fichier non autorisé. Utilisez PDF, Word, Excel ou PowerPoint");
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error("Le fichier est trop volumineux. Taille maximum: 10MB");
        }

        // Préparer FormData
        const formData = new FormData();
        formData.append('document', file);

        // Obtenir l'URL depuis la configuration centralisée
        const baseUrl = IMAGE_CONFIG.getBaseUrl();
        const uploadUrl = `${baseUrl}/api/documents-upload/upload-document`;

        console.log('🚀 Upload document vers:', uploadUrl);

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
        console.log('✅ Upload document réussi:', result);
        return result;

    } catch (error) {
        console.error("Erreur upload document:", error);
        throw error;
    }
};

/**
 * Alternative : Upload via base64 si FormData pose problème
 */
export const uploadDocumentBase64ToProduction = async (
    file: File,
    token: string
): Promise<DocumentUploadResponse> => {
    try {
        // Convertir le fichier en base64
        const base64 = await fileToBase64(file);

        const payload = {
            document_data: base64,
            filename: file.name,
            content_type: file.type,
            size: file.size
        };

        const baseUrl = IMAGE_CONFIG.getBaseUrl();
        const uploadUrl = `${baseUrl}/api/documents-upload/upload-document-base64`;

        const response = await fetch(uploadUrl, {
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
        console.error("Erreur upload base64 document:", error);
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
            // Enlever le préfixe "data:...;base64,"
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
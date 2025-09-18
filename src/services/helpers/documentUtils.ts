// src/services/helpers/documentUtils.ts
import {IMAGE_CONFIG} from './constant-api';

/**
 * Obtient l'URL complète d'un document à partir d'un chemin relatif
 */
export const getDocumentUrl = (documentPath: string | null | undefined): string => {
    if (!documentPath) {
        return "";
    }

    // Si l'URL est déjà complète, la retourner telle quelle
    if (documentPath.startsWith('http')) {
        return documentPath;
    }

    // Construire l'URL complète
    return IMAGE_CONFIG.getImageUrl(documentPath) || "";
};

/**
 * Obtient l'icône appropriée selon le type de fichier
 */
export const getFileIcon = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf':
            return '📄';
        case 'doc':
        case 'docx':
            return '📝';
        case 'xls':
        case 'xlsx':
            return '📊';
        case 'ppt':
        case 'pptx':
            return '📊';
        default:
            return '📎';
    }
};

/**
 * Formate la taille du fichier
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
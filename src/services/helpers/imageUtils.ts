// src/services/helpers/imageUtils.ts
import {IMAGE_CONFIG} from './constant-api';

/**
 * Obtient l'URL complète d'une image à partir d'un chemin relatif
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) {
        return IMAGE_CONFIG.DEFAULT_PLACEHOLDER;
    }

    // Si l'URL est déjà complète, la retourner telle quelle
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Construire l'URL complète
    return IMAGE_CONFIG.getImageUrl(imagePath) || IMAGE_CONFIG.DEFAULT_PLACEHOLDER;
};


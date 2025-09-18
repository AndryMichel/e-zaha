// src/services/helpers/constant-api.ts

// URLs de base configurées via variables d'environnement
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://observatoireddl.mg";

// Configuration des URLs pour les images
export const IMAGE_CONFIG = {
    // URL de base pour l'affichage des images
    DISPLAY_BASE_URL: IMAGE_BASE_URL,

    // URLs de base pour les uploads (toujours le serveur de production)
    UPLOAD_BASE_URL: IMAGE_BASE_URL,

    // Chemins relatifs pour les uploads
    ACTUALITES_UPLOADS_PATH: "/uploads/actualites",
    GALERIE_UPLOADS_PATH: "/uploads/galerie",
    DIRECTEUR_UPLOADS_PATH: "/uploads/directeur",
    DOCUMENTS_UPLOADS_PATH: "/uploads/documents",

    // URLs complètes pour les uploads
    UPLOAD_URLS: {
        ACTUALITES: `${IMAGE_BASE_URL}/api/actualites-image/upload-image`,
        GALERIE: `${IMAGE_BASE_URL}/api/galerie-image/upload-image`,
        DIRECTEUR: `${IMAGE_BASE_URL}/api/directeur-image/upload-image`,
        // Fallbacks : utiliser l'endpoint actualités si nécessaire
        GALERIE_FALLBACK: `${IMAGE_BASE_URL}/api/actualites-image/upload-image`,
        DIRECTEUR_FALLBACK: `${IMAGE_BASE_URL}/api/actualites-image/upload-image`
    },

    // URL complète pour les images (affichage)
    getImageUrl: (relativePath: string | null) => {
        if (!relativePath) return null;

        // Si l'URL est déjà complète, la retourner telle quelle
        if (relativePath.startsWith('http')) {
            return relativePath;
        }

        // Construire l'URL complète pour l'affichage
        return `${IMAGE_CONFIG.DISPLAY_BASE_URL}${relativePath}`;
    },

    // URL de base pour construire des endpoints personnalisés
    getBaseUrl: () => {
        return IMAGE_CONFIG.UPLOAD_BASE_URL;
    },

    // URL pour l'upload actualités
    getUploadUrl: () => {
        return IMAGE_CONFIG.UPLOAD_URLS.ACTUALITES;
    },

    // Alias pour getUploadUrl (pour la compatibilité)
    getActualiteUploadUrl: () => {
        return IMAGE_CONFIG.UPLOAD_URLS.ACTUALITES;
    },

    // URL pour l'upload galerie
    getGalerieUploadUrl: () => {
        return IMAGE_CONFIG.UPLOAD_URLS.GALERIE;
    },

    // URL de fallback pour la galerie (utilise l'endpoint actualités)
    getGalerieFallbackUrl: () => {
        return IMAGE_CONFIG.UPLOAD_URLS.GALERIE_FALLBACK;
    },

    // URL pour l'upload directeur
    getDirecteurUploadUrl: () => {
        return IMAGE_CONFIG.UPLOAD_URLS.DIRECTEUR;
    },

    // URL de fallback pour le directeur (utilise l'endpoint actualités)
    getDirecteurFallbackUrl: () => {
        return IMAGE_CONFIG.UPLOAD_URLS.DIRECTEUR_FALLBACK;
    },

    // Placeholders par défaut
    DEFAULT_PLACEHOLDER: "/assets/placeholder-actualite.jpg",
    GALERIE_PLACEHOLDER: "/assets/placeholder-galerie.jpg",
    DIRECTEUR_PLACEHOLDER: "/assets/placeholder-directeur.jpg"
};

// Messages d'état pour le développement
export const DEV_CONFIG = {
    isLocalDev: process.env.NODE_ENV === 'development' && API_URL.includes('localhost'),
    isProductionImages: IMAGE_BASE_URL.includes('observatoireddl.mg'),

    getUploadMessage: () => {
        if (DEV_CONFIG.isLocalDev && DEV_CONFIG.isProductionImages) {
            return "🔄 Mode développement : API locale → Images serveur de production";
        } else if (DEV_CONFIG.isLocalDev) {
            return "🏠 Mode développement : API locale → Images locales";
        } else {
            return "🌐 Mode production : API serveur → Images serveur";
        }
    },

    getGalerieUploadMessage: () => {
        const baseMessage = DEV_CONFIG.getUploadMessage();
        return `${baseMessage} (Galerie)`;
    },

    getDirecteurUploadMessage: () => {
        const baseMessage = DEV_CONFIG.getUploadMessage();
        return `${baseMessage} (Directeur)`;
    },

    // Informations de debug
    getConfigInfo: () => {
        return {
            API_URL,
            IMAGE_BASE_URL,
            actualitesUploadUrl: IMAGE_CONFIG.getActualiteUploadUrl(),
            galerieUploadUrl: IMAGE_CONFIG.getGalerieUploadUrl(),
            directeurUploadUrl: IMAGE_CONFIG.getDirecteurUploadUrl(),
            isLocalDev: DEV_CONFIG.isLocalDev,
            isProductionImages: DEV_CONFIG.isProductionImages
        };
    }
};

// Utilitaires pour vérifier les endpoints
export const ENDPOINT_UTILS = {
    // Teste si un endpoint existe
    testEndpoint: async (url: string, token?: string): Promise<boolean> => {
        try {
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers,
            });

            // 404 = endpoint n'existe pas
            // Autre erreur = endpoint existe mais il y a un problème (normal sans fichier)
            return response.status !== 404;
        } catch {
            return false;
        }
    },

    // Teste spécifiquement l'endpoint galerie
    testGalerieEndpoint: async (token: string): Promise<boolean> => {
        return ENDPOINT_UTILS.testEndpoint(IMAGE_CONFIG.getGalerieUploadUrl(), token);
    },

    // Teste l'endpoint actualités
    testActualitesEndpoint: async (token: string): Promise<boolean> => {
        return ENDPOINT_UTILS.testEndpoint(IMAGE_CONFIG.getActualiteUploadUrl(), token);
    },

    // Teste l'endpoint directeur
    testDirecteurEndpoint: async (token: string): Promise<boolean> => {
        return ENDPOINT_UTILS.testEndpoint(IMAGE_CONFIG.getDirecteurUploadUrl(), token);
    }
};
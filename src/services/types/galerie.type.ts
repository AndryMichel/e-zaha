// src/services/types/galerie.type.ts

export interface GalerieItem {
    id: number;
    category: "formation" | "atelier" | "descente" | "partenariat" | "directeurs" | "divers";
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface CreateGalerieRequest {
    category: "formation" | "atelier" | "descente" | "partenariat" | "directeurs" | "divers";
    image_url: string;
}

export interface UpdateGalerieRequest {
    id: number;
    category?: "formation" | "atelier" | "descente" | "partenariat" | "directeurs" | "divers";
    image_url?: string;
}

export interface GetAllGalerieParams extends Record<string, unknown> {
    page?: number;
    limit?: number | string;
    category?: "formation" | "atelier" | "descente" | "partenariat" | "directeurs" | "divers" | "all";
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface GetAllGalerieResponse {
    success: boolean;
    data: GalerieItem[];
    total: number;
    page: number;
    total_pages: number;
}

export interface CreateGalerieResponse {
    success: boolean;
    message: string;
    data?: GalerieItem;
}

export interface UpdateGalerieResponse {
    success: boolean;
    message: string;
    data?: GalerieItem;
}

export interface DeleteGalerieResponse {
    success: boolean;
    message: string;
}

export interface UploadGalerieImageResponse {
    success: boolean;
    message: string;
    image_url?: string;
}

// Catégories disponibles
export const GALERIE_CATEGORIES = [
    {id: 'formation', name: 'Formation'},
    {id: 'atelier', name: 'Atelier'},
    {id: 'descente', name: 'Descente sur terrain'},
    {id: 'partenariat', name: 'Partenariat'},
    {id: 'directeurs', name: 'Directeurs de l\'ODDL'},
    {id: 'divers', name: 'Divers'}
] as const;
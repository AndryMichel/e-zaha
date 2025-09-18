// src/services/types/actualite.type.ts

export interface Actualite {
    id: number;
    titre: string;
    contenu: string;
    type: "actualite" | "annonce";
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateActualiteRequest {
    titre: string;
    contenu: string;
    type: "actualite" | "annonce";
    image_url?: string;
}

export interface UpdateActualiteRequest {
    id: number;
    titre?: string;
    contenu?: string;
    type?: "actualite" | "annonce";
    image_url?: string;
}

export interface GetAllActualitesParams extends Record<string, unknown> {
    page?: number;
    limit?: number | string;
    search?: string;
    type?: "actualite" | "annonce" | "all";
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface GetAllActualitesResponse {
    success: boolean;
    data: Actualite[];
    total: number;
    page: number;
    total_pages: number;
}

export interface CreateActualiteResponse {
    success: boolean;
    message: string;
    data?: Actualite;
}

export interface UpdateActualiteResponse {
    success: boolean;
    message: string;
    data?: Actualite;
}

export interface DeleteActualiteResponse {
    success: boolean;
    message: string;
}

export interface UploadImageResponse {
    success: boolean;
    message: string;
    image_url?: string;
}
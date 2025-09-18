// src/services/types/directeur.type.ts

export interface DirecteurItem {
    id: number;
    nom: string;
    prenom?: string;
    description?: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface CreateDirecteurRequest {
    nom: string;
    prenom?: string;
    description?: string;
    image_url: string;
}

export interface UpdateDirecteurRequest {
    id: number;
    nom?: string;
    prenom?: string;
    description?: string;
    image_url?: string;
}

export interface GetAllDirecteurParams extends Record<string, unknown> {
    page?: number;
    limit?: number | string;
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface GetAllDirecteurResponse {
    success: boolean;
    data: DirecteurItem[];
    total: number;
    page: number;
    total_pages: number;
}

export interface GetDirecteurActuelResponse {
    success: boolean;
    data?: DirecteurItem;
    message?: string;
}

export interface CreateDirecteurResponse {
    success: boolean;
    message: string;
    data?: DirecteurItem;
}

export interface UpdateDirecteurResponse {
    success: boolean;
    message: string;
    data?: DirecteurItem;
}

export interface DeleteDirecteurResponse {
    success: boolean;
    message: string;
}

export interface UploadDirecteurImageResponse {
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
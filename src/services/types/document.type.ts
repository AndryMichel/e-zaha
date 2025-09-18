// src/services/types/document.type.ts

export interface Document {
    id_doc: number;
    category: "ressources" | "textes" | "travail";
    titre: string;
    description: string;
    file_url: string;
    created_at: string;
    updated_at: string;
}

export interface CreateDocumentRequest {
    category: "ressources" | "textes" | "travail";
    titre: string;
    description?: string;
    file_url: string;
}

export interface UpdateDocumentRequest {
    id_doc: number;
    category?: "ressources" | "textes" | "travail";
    titre?: string;
    description?: string;
    file_url?: string;
}

export interface GetAllDocumentsParams extends Record<string, unknown> {
    page?: number;
    limit?: number | string;
    search?: string;
    category?: "ressources" | "textes" | "travail" | "all";
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface GetAllDocumentsResponse {
    success: boolean;
    data: Document[];
    total: number;
    page: number;
    total_pages: number;
}

export interface CreateDocumentResponse {
    success: boolean;
    message: string;
    data?: Document;
}

export interface UpdateDocumentResponse {
    success: boolean;
    message: string;
    data?: Document;
}

export interface DeleteDocumentResponse {
    success: boolean;
    message: string;
}

export interface UploadDocumentResponse {
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

// Mapping des catégories pour l'affichage
export const CATEGORY_LABELS = {
    ressources: "Ressources",
    textes: "Textes et Lois",
    travail: "Document de travail"
} as const;

// Mapping des catégories vers les URLs
export const CATEGORY_URLS = {
    ressources: "/ressources",
    textes: "/textes",
    travail: "/document"
} as const;

// Extensions autorisées
export const ALLOWED_EXTENSIONS = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
] as const;

// Types MIME autorisés
export const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
] as const;
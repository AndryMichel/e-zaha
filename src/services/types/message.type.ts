// src/services/types/message.type.ts

export interface ContactMessage {
    id: number;
    nom: string;
    email: string;
    sujet: string;
    message: string;
    statut: "nouveau" | "lu" | "archive";
    created_at: string;
    updated_at: string;
}

export interface SendMessageRequest {
    nom: string;
    email: string;
    sujet: string;
    message: string;
}

export interface UpdateMessageStatutRequest {
    id: number;
    statut: "nouveau" | "lu" | "archive";
}

export interface GetMessagesParams extends Record<string, unknown> {
    page?: number;
    limit?: number | string;
    statut?: "nouveau" | "lu" | "archive" | "all";
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface GetMessagesResponse {
    success: boolean;
    data: ContactMessage[];
    total: number;
    page: number;
    total_pages: number;
}

export interface SendMessageResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        nom: string;
        email: string;
        sujet: string;
        date_envoi: string;
    };
}

export interface UpdateMessageResponse {
    success: boolean;
    message: string;
    data?: ContactMessage;
}

export interface DeleteMessageResponse {
    success: boolean;
    message: string;
}

export interface NotificationsCountResponse {
    success: boolean;
    data: {
        nouveaux_messages: number;
    };
}

// Constantes pour les statuts
export const MESSAGE_STATUTS = [
    {id: 'nouveau', name: 'Nouveau', color: 'bg-red-500'},
    {id: 'lu', name: 'Lu', color: 'bg-blue-500'},
    {id: 'archive', name: 'Archivé', color: 'bg-gray-500'}
] as const;
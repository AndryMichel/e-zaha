// src/services/api/message/message.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";

import {
    DeleteMessageResponse,
    GetMessagesParams,
    GetMessagesResponse,
    NotificationsCountResponse,
    SendMessageRequest,
    SendMessageResponse,
    UpdateMessageResponse,
    UpdateMessageStatutRequest
} from "@/services/types/message.type";

export const messageApi = {

    // 📝 Récupérer tous les messages (ADMIN)
    getAllMessages: async (
        token: string,
        params?: GetMessagesParams
    ): Promise<GetMessagesResponse> => {
        return await apiClient.get<GetMessagesResponse>(
            "/api/messages/get-messages",
            params,
            token
        );
    },

    // 🔔 Récupérer le nombre de notifications (ADMIN)
    getNotificationsCount: async (
        token: string
    ): Promise<NotificationsCountResponse> => {
        return await apiClient.get<NotificationsCountResponse>(
            "/api/messages/get-notifications-count",
            undefined,
            token
        );
    },

    // ✏️ Mettre à jour le statut d'un message (ADMIN)
    updateMessageStatut: async (
        data: UpdateMessageStatutRequest,
        token: string
    ): Promise<UpdateMessageResponse> => {
        return await apiClient.put<UpdateMessageResponse>(
            "/api/messages/update-message-statut",
            {id: data.id.toString()},
            data,
            token
        );
    },

    // 🗑️ Supprimer un message (ADMIN)
    deleteMessage: async (
        id: number,
        token: string
    ): Promise<DeleteMessageResponse> => {
        return await apiClient.delete<DeleteMessageResponse>(
            `/api/messages/delete-message/${id}`,
            undefined,
            token
        );
    },

    // 📧 Envoyer un message (PUBLIC)
    sendMessage: async (
        data: SendMessageRequest
    ): Promise<SendMessageResponse> => {
        return await apiClient.post<SendMessageResponse>(
            "/api/message-public/send-message",
            {},
            data
        );
    }
};

// 🔧 Hook pour récupérer les messages (ADMIN)
export const useGetAllMessages = (params: GetMessagesParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetMessagesResponse>(
        ["/api/messages/get-messages", params],
        (endpoint, token, params) => messageApi.getAllMessages(token, params)
    );

    return {
        data: data?.data || [],
        page: data?.page || 1,
        total: data?.total || 0,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// 🔔 Hook pour récupérer les notifications (ADMIN)
export const useGetNotificationsCount = () => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<NotificationsCountResponse>(
        ["/api/messages/get-notifications-count", {}], // Corriger: utiliser un tableau avec un objet vide
        (endpoint, token) => messageApi.getNotificationsCount(token),
        {
            refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
            revalidateOnFocus: true
        }
    );

    return {
        data: data?.data || {nouveaux_messages: 0},
        isLoading,
        isError: error,
        mutate,
        isAuthenticated
    };
};

// 🔧 Fonctions utilitaires pour les opérations
export const updateMessageStatut = async (
    data: UpdateMessageStatutRequest,
    token: string
): Promise<UpdateMessageResponse> => {
    return messageApi.updateMessageStatut(data, token);
};

export const deleteMessage = async (
    id: number,
    token: string
): Promise<DeleteMessageResponse> => {
    return messageApi.deleteMessage(id, token);
};

export const sendMessage = async (
    data: SendMessageRequest
): Promise<SendMessageResponse> => {
    return messageApi.sendMessage(data);
};
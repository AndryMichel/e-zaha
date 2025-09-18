// src/services/api/documents/document.api.ts
"use client"; // Add this directive to ensure client-side execution

import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import useSWR from "swr";
import {
    CreateDocumentRequest,
    CreateDocumentResponse,
    DeleteDocumentResponse,
    GetAllDocumentsParams,
    GetAllDocumentsResponse,
    UpdateDocumentRequest,
    UpdateDocumentResponse,
    UploadDocumentResponse
} from "@/services/types/document.type";
import {uploadDocumentToProduction} from "./documentUpload.service";

export const documentApi = {

    // 📋 Récupérer tous les documents (ADMIN)
    getAllDocuments: async (
        token: string,
        params?: GetAllDocumentsParams
    ): Promise<GetAllDocumentsResponse> => {
        return await apiClient.get<GetAllDocumentsResponse>(
            "/api/listdocuments/get-documents",
            params,
            token
        );
    },

    // 🌍 Récupérer tous les documents (PUBLIC - sans authentification)
    getAllDocumentsPublic: async (
        params?: GetAllDocumentsParams
    ): Promise<GetAllDocumentsResponse> => {
        return await apiClient.get<GetAllDocumentsResponse>(
            "/api/documents-public/get-documents-public",
            params
        );
    },

    // 📂 Récupérer les documents par catégorie (PUBLIC)
    getDocumentsByCategory: async (
        category: "ressources" | "textes" | "travail",
        limit?: number
    ): Promise<GetAllDocumentsResponse> => {
        const params = limit ? {limit} : {};
        return await apiClient.get<GetAllDocumentsResponse>(
            `/api/documents-public/get-documents-by-category/${category}`,
            params
        );
    },

    // 📝 Créer un nouveau document
    createDocument: async (
        data: CreateDocumentRequest,
        token: string
    ): Promise<CreateDocumentResponse> => {
        return await apiClient.post<CreateDocumentResponse>(
            "/api/listdocuments/create-document",
            {},
            data,
            token
        );
    },

    // ✏️ Mettre à jour un document
    updateDocument: async (
        data: UpdateDocumentRequest,
        token: string
    ): Promise<UpdateDocumentResponse> => {
        return await apiClient.put<UpdateDocumentResponse>(
            "/api/listdocuments/update-document",
            {id_doc: data.id_doc.toString()},
            data,
            token
        );
    },

    // 🗑️ Supprimer un document
    deleteDocument: async (
        id_doc: number,
        token: string
    ): Promise<DeleteDocumentResponse> => {
        return await apiClient.delete<DeleteDocumentResponse>(
            `/api/listdocuments/delete-document/${id_doc}`,
            undefined,
            token
        );
    },

    // 📤 Upload de document vers le serveur de production
    uploadDocument: async (
        file: File,
        token: string
    ): Promise<UploadDocumentResponse> => {
        return await uploadDocumentToProduction(file, token);
    }
};

// 🔧 Hook pour récupérer les documents (ADMIN)
export const useGetAllDocuments = (params: GetAllDocumentsParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllDocumentsResponse>(
        ["/api/listdocuments/get-documents", params],
        (endpoint, token, params) => documentApi.getAllDocuments(token, params)
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

// 🌍 Hook pour récupérer les documents (PUBLIC)
export const useGetAllDocumentsPublic = (params: GetAllDocumentsParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/documents-public/get-documents-public", params],
        () => documentApi.getAllDocumentsPublic(params)
    );

    return {
        data: data?.data || [],
        page: data?.page || 1,
        total: data?.total || 0,
        totalPages: data?.total_pages || 1,
        isLoading,
        isError: error,
        mutate
    };
};

// 📂 Hook pour récupérer les documents par catégorie
export const useGetDocumentsByCategory = (category: "ressources" | "textes" | "travail", limit?: number) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/documents-public/get-documents-by-category", category, limit],
        () => documentApi.getDocumentsByCategory(category, limit)
    );

    return {
        data: data?.data || [],
        total: data?.total || 0,
        isLoading,
        isError: error,
        mutate
    };
};

// 🔧 Fonctions utilitaires pour les opérations CRUD
export const createDocument = async (
    data: CreateDocumentRequest,
    token: string
): Promise<CreateDocumentResponse> => {
    return documentApi.createDocument(data, token);
};

export const updateDocument = async (
    data: UpdateDocumentRequest,
    token: string
): Promise<UpdateDocumentResponse> => {
    return documentApi.updateDocument(data, token);
};

export const deleteDocument = async (
    id_doc: number,
    token: string
): Promise<DeleteDocumentResponse> => {
    return documentApi.deleteDocument(id_doc, token);
};

// 📤 Upload de document
export const uploadDocument = async (
    file: File,
    token: string
): Promise<UploadDocumentResponse> => {
    return documentApi.uploadDocument(file, token);
};
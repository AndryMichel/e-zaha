// src/services/api/actualites/actualite.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import useSWR from "swr";
import {
    CreateActualiteRequest,
    CreateActualiteResponse,
    DeleteActualiteResponse,
    GetAllActualitesParams,
    GetAllActualitesResponse,
    UpdateActualiteRequest,
    UpdateActualiteResponse,
    UploadImageResponse
} from "@/services/types/actualite.type";
import {uploadImageToProduction} from "./imageUpload.service";

export const actualiteApi = {

    getAllActualites: async (
        token: string,
        params?: GetAllActualitesParams
    ): Promise<GetAllActualitesResponse> => {
        return await apiClient.get<GetAllActualitesResponse>(
            "/api/listactualites/get-actualites",
            params,
            token
        );
    },

    // 🌍 Récupérer toutes les actualités (PUBLIC - sans authentification)
    getAllActualitesPublic: async (
        params?: GetAllActualitesParams
    ): Promise<GetAllActualitesResponse> => {
        return await apiClient.get<GetAllActualitesResponse>(
            "/api/actualites-public/get-actualites-public",
            params
        );
    },

    // 📝 Créer une nouvelle actualité
    createActualite: async (
        data: CreateActualiteRequest,
        token: string
    ): Promise<CreateActualiteResponse> => {
        return await apiClient.post<CreateActualiteResponse>(
            "/api/listactualites/create-actualite",
            {},
            data,
            token
        );
    },

    // ✏️ Mettre à jour une actualité
    updateActualite: async (
        data: UpdateActualiteRequest,
        token: string
    ): Promise<UpdateActualiteResponse> => {
        return await apiClient.put<UpdateActualiteResponse>(
            "/api/listactualites/update-actualite",
            {id: data.id.toString()},
            data,
            token
        );
    },

    // 🗑️ Supprimer une actualité
    deleteActualite: async (
        id: number,
        token: string
    ): Promise<DeleteActualiteResponse> => {
        return await apiClient.delete<DeleteActualiteResponse>(
            `/api/listactualites/delete-actualite/${id}`,
            undefined,
            token
        );
    },

    // 📸 Upload d'image vers le serveur de production
    // Cette méthode utilise TOUJOURS le serveur de production
    uploadImage: async (
        file: File,
        token: string
    ): Promise<UploadImageResponse> => {
        return await uploadImageToProduction(file, token);
    }
};

// 🔧 Hook pour récupérer les actualités (ADMIN)
export const useGetAllActualites = (params: GetAllActualitesParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllActualitesResponse>(
        ["/api/listactualites/get-actualites", params],
        (endpoint, token, params) => actualiteApi.getAllActualites(token, params)
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

// 🌍 Hook pour récupérer les actualités (PUBLIC)
export const useGetAllActualitesPublic = (params: GetAllActualitesParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/actualites-public/get-actualites-public", params],
        () => actualiteApi.getAllActualitesPublic(params)
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

// 🔧 Fonctions utilitaires pour les opérations CRUD
export const createActualite = async (
    data: CreateActualiteRequest,
    token: string
): Promise<CreateActualiteResponse> => {
    return actualiteApi.createActualite(data, token);
};

export const updateActualite = async (
    data: UpdateActualiteRequest,
    token: string
): Promise<UpdateActualiteResponse> => {
    return actualiteApi.updateActualite(data, token);
};

export const deleteActualite = async (
    id: number,
    token: string
): Promise<DeleteActualiteResponse> => {
    return actualiteApi.deleteActualite(id, token);
};

// 📸 Upload d'image qui utilise TOUJOURS le serveur de production
export const uploadImage = async (
    file: File,
    token: string
): Promise<UploadImageResponse> => {
    return actualiteApi.uploadImage(file, token);
};
// src/services/api/galerie/galerie.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import useSWR from "swr";
import {
    CreateGalerieRequest,
    CreateGalerieResponse,
    DeleteGalerieResponse,
    GetAllGalerieParams,
    GetAllGalerieResponse,
    UpdateGalerieRequest,
    UpdateGalerieResponse,
    UploadGalerieImageResponse
} from "@/services/types/galerie.type";
import {uploadGalerieImageToProduction} from "./galerieUpload.service";

export const galerieApi = {

    getAllGalerie: async (
        token: string,
        params?: GetAllGalerieParams
    ): Promise<GetAllGalerieResponse> => {
        return await apiClient.get<GetAllGalerieResponse>(
            "/api/listgalerie/get-galerie",
            params,
            token
        );
    },

    // 🌍 Récupérer toutes les images de galerie (PUBLIC - sans authentification)
    getAllGaleriePublic: async (
        params?: GetAllGalerieParams
    ): Promise<GetAllGalerieResponse> => {
        return await apiClient.get<GetAllGalerieResponse>(
            "/api/galerie-public/get-galerie-public",
            params
        );
    },

    // 📝 Créer une nouvelle image de galerie
    createGalerie: async (
        data: CreateGalerieRequest,
        token: string
    ): Promise<CreateGalerieResponse> => {
        return await apiClient.post<CreateGalerieResponse>(
            "/api/listgalerie/create-galerie",
            {},
            data,
            token
        );
    },

    // ✏️ Mettre à jour une image de galerie
    updateGalerie: async (
        data: UpdateGalerieRequest,
        token: string
    ): Promise<UpdateGalerieResponse> => {
        return await apiClient.put<UpdateGalerieResponse>(
            "/api/listgalerie/update-galerie",
            {id: data.id.toString()},
            data,
            token
        );
    },

    // 🗑️ Supprimer une image de galerie
    deleteGalerie: async (
        id: number,
        token: string
    ): Promise<DeleteGalerieResponse> => {
        return await apiClient.delete<DeleteGalerieResponse>(
            `/api/listgalerie/delete-galerie/${id}`,
            undefined,
            token
        );
    },

    // 📸 Upload d'image vers le serveur de production
    // Cette méthode utilise TOUJOURS le serveur de production
    uploadImage: async (
        file: File,
        token: string
    ): Promise<UploadGalerieImageResponse> => {
        return await uploadGalerieImageToProduction(file, token);
    }
};

// 🔧 Hook pour récupérer les images de galerie (ADMIN)
export const useGetAllGalerie = (params: GetAllGalerieParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllGalerieResponse>(
        ["/api/listgalerie/get-galerie", params],
        (endpoint, token, params) => galerieApi.getAllGalerie(token, params)
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

// 🌍 Hook pour récupérer les images de galerie (PUBLIC)
export const useGetAllGaleriePublic = (params: GetAllGalerieParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/galerie-public/get-galerie-public", params],
        () => galerieApi.getAllGaleriePublic(params)
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
export const createGalerie = async (
    data: CreateGalerieRequest,
    token: string
): Promise<CreateGalerieResponse> => {
    return galerieApi.createGalerie(data, token);
};

export const updateGalerie = async (
    data: UpdateGalerieRequest,
    token: string
): Promise<UpdateGalerieResponse> => {
    return galerieApi.updateGalerie(data, token);
};

export const deleteGalerie = async (
    id: number,
    token: string
): Promise<DeleteGalerieResponse> => {
    return galerieApi.deleteGalerie(id, token);
};

// 📸 Upload d'image qui utilise TOUJOURS le serveur de production
export const uploadGalerieImage = async (
    file: File,
    token: string
): Promise<UploadGalerieImageResponse> => {
    return galerieApi.uploadImage(file, token);
};
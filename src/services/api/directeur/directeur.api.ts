// src/services/api/directeur/directeur.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {useAuthenticatedSWR} from "@/services/helpers/swrHelper";
import useSWR from "swr";
import {
    CreateDirecteurRequest,
    CreateDirecteurResponse,
    DeleteDirecteurResponse,
    GetAllDirecteurParams,
    GetAllDirecteurResponse,
    GetDirecteurActuelResponse,
    UpdateDirecteurRequest,
    UpdateDirecteurResponse,
    UploadDirecteurImageResponse
} from "@/services/types/directeur.type";
import {uploadDirecteurImageToProduction} from "./directeurUpload.service";

export const directeurApi = {

    getAllDirecteur: async (
        token: string,
        params?: GetAllDirecteurParams
    ): Promise<GetAllDirecteurResponse> => {
        return await apiClient.get<GetAllDirecteurResponse>(
            "/api/listdirecteur/get-directeur",
            params,
            token
        );
    },

    // 🌍 Récupérer le directeur actuel (PUBLIC - sans authentification)
    getDirecteurActuel: async (): Promise<GetDirecteurActuelResponse> => {
        return await apiClient.get<GetDirecteurActuelResponse>(
            "/api/directeur-public/get-directeur-actuel"
        );
    },

    // 🌍 Récupérer tous les directeurs (PUBLIC - sans authentification)
    getAllDirecteurPublic: async (
        params?: GetAllDirecteurParams
    ): Promise<GetAllDirecteurResponse> => {
        return await apiClient.get<GetAllDirecteurResponse>(
            "/api/directeur-public/get-all-directeurs",
            params
        );
    },

    // 📝 Créer un nouveau directeur
    createDirecteur: async (
        data: CreateDirecteurRequest,
        token: string
    ): Promise<CreateDirecteurResponse> => {
        return await apiClient.post<CreateDirecteurResponse>(
            "/api/listdirecteur/create-directeur",
            {},
            data,
            token
        );
    },

    // ✏️ Mettre à jour un directeur
    updateDirecteur: async (
        data: UpdateDirecteurRequest,
        token: string
    ): Promise<UpdateDirecteurResponse> => {
        return await apiClient.put<UpdateDirecteurResponse>(
            "/api/listdirecteur/update-directeur",
            {id: data.id.toString()},
            data,
            token
        );
    },

    // 🗑️ Supprimer un directeur
    deleteDirecteur: async (
        id: number,
        token: string
    ): Promise<DeleteDirecteurResponse> => {
        return await apiClient.delete<DeleteDirecteurResponse>(
            `/api/listdirecteur/delete-directeur/${id}`,
            undefined,
            token
        );
    },

    // 📸 Upload d'image vers le serveur de production
    uploadImage: async (
        file: File,
        token: string
    ): Promise<UploadDirecteurImageResponse> => {
        return await uploadDirecteurImageToProduction(file, token);
    }
};

// 🔧 Hook pour récupérer les directeurs (ADMIN)
export const useGetAllDirecteur = (params: GetAllDirecteurParams = {}) => {
    const {data, error, isLoading, mutate, isAuthenticated} = useAuthenticatedSWR<GetAllDirecteurResponse>(
        ["/api/listdirecteur/get-directeur", params],
        (endpoint, token, params) => directeurApi.getAllDirecteur(token, params)
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

// 🌍 Hook pour récupérer le directeur actuel (PUBLIC)
export const useGetDirecteurActuel = () => {
    const {data, error, isLoading, mutate} = useSWR(
        "/api/directeur-public/get-directeur-actuel",
        () => directeurApi.getDirecteurActuel()
    );

    // Les données arrivent parfois en tableau, il faut extraire le premier élément
    let directeurData = data?.data;

    // Si les données sont un tableau, prendre le premier élément
    if (Array.isArray(directeurData) && directeurData.length > 0) {
        directeurData = directeurData[0];
    }

    return {
        data: directeurData || null,
        isLoading,
        isError: error,
        mutate
    };
};

// 🌍 Hook pour récupérer tous les directeurs (PUBLIC)
export const useGetAllDirecteurPublic = (params: GetAllDirecteurParams = {}) => {
    const {data, error, isLoading, mutate} = useSWR(
        ["/api/directeur-public/get-all-directeurs", params],
        () => directeurApi.getAllDirecteurPublic(params)
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
export const createDirecteur = async (
    data: CreateDirecteurRequest,
    token: string
): Promise<CreateDirecteurResponse> => {
    return directeurApi.createDirecteur(data, token);
};

export const updateDirecteur = async (
    data: UpdateDirecteurRequest,
    token: string
): Promise<UpdateDirecteurResponse> => {
    return directeurApi.updateDirecteur(data, token);
};

export const deleteDirecteur = async (
    id: number,
    token: string
): Promise<DeleteDirecteurResponse> => {
    return directeurApi.deleteDirecteur(id, token);
};

// 📸 Upload d'image qui utilise TOUJOURS le serveur de production
export const uploadDirecteurImage = async (
    file: File,
    token: string
): Promise<UploadDirecteurImageResponse> => {
    return directeurApi.uploadImage(file, token);
};
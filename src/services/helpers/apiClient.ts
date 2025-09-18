// src/services/helpers/apiClient.ts
import {API_URL} from "@/services/helpers/constant-api";

function normalizeParams(params?: Record<string, unknown>): string {
    if (!params) return '';
    const searchParams = new URLSearchParams();

    for (const key in params) {
        const value = params[key];
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    }

    return '?' + searchParams.toString();
}

export const apiClient = {
    get: async <T>(endpoint: string, params?: Record<string, unknown>, token?: string): Promise<T> => {
        try {
            const queryParams = normalizeParams(params);
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
                method: 'GET',
                headers,
                mode: 'cors', // Ajouté pour être cohérent
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur GET sur ${endpoint}:`, error);
            throw error;
        }
    },

    // Nouvelle méthode pour récupérer les données au format Blob (pour les exports de fichiers)
    getBlob: async (endpoint: string, params?: Record<string, unknown>, token?: string): Promise<Blob> => {
        try {
            const queryParams = normalizeParams(params);
            const headers: Record<string, string> = {
                'Accept': '*/*', // Accepte tous les types de contenu
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
                method: 'GET',
                headers,
                mode: 'cors',
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Erreur inconnue');
                throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
            }

            return await response.blob();
        } catch (error) {
            console.error(`Erreur GET Blob sur ${endpoint}:`, error);
            throw error;
        }
    },

    post: async <T>(endpoint: string, params?: Record<string, unknown>, body?: unknown, token?: string): Promise<T> => {
        try {
            const queryParams = normalizeParams(params);
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
                method: 'POST',
                headers,
                body: body ? JSON.stringify(body) : undefined,
                mode: 'cors', // Ajouté pour être cohérent
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message?.[0] || errorData.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur POST sur ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * POST request avec FormData pour l'upload de fichiers
     */
    postForm: async <T>(
        endpoint: string,
        params?: Record<string, unknown>,
        formData?: FormData,
        token?: string
    ): Promise<T> => {
        try {
            const queryParams = normalizeParams(params);
            const headers: Record<string, string> = {};

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Ne pas définir Content-Type pour FormData - le navigateur le fera automatiquement
            // avec les bonnes boundaries pour multipart/form-data

            const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
                method: 'POST',
                headers,
                body: formData,
                mode: 'cors',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message?.[0] || errorData.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur POST FormData sur ${endpoint}:`, error);
            throw error;
        }
    },

    put: async <T>(endpoint: string, params?: Record<string, unknown>, body?: unknown, token?: string): Promise<T> => {
        try {
            const queryParams = normalizeParams(params);
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
                method: 'PUT',
                headers,
                body: body ? JSON.stringify(body) : undefined,
                mode: 'cors',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message?.[0] || errorData.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur PUT sur ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * PUT request avec FormData pour la mise à jour avec fichiers
     */
    putForm: async <T>(
        endpoint: string,
        params?: Record<string, unknown>,
        formData?: FormData,
        token?: string
    ): Promise<T> => {
        try {
            const queryParams = normalizeParams(params);
            const headers: Record<string, string> = {};

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Ne pas définir Content-Type pour FormData
            const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
                method: 'PUT',
                headers,
                body: formData,
                mode: 'cors',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message?.[0] || errorData.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur PUT FormData sur ${endpoint}:`, error);
            throw error;
        }
    },

    delete: async <T>(endpoint: string, params?: Record<string, unknown>, token?: string): Promise<T> => {
        try {
            const queryParams = normalizeParams(params);
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
                method: 'DELETE',
                headers,
                mode: 'cors',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur DELETE sur ${endpoint}:`, error);
            throw error;
        }
    }
};
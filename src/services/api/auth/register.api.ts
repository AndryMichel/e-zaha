// src/services/api/auth/register.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {RegisterFormData, RegisterResponse} from "@/services/types/register.type";

// Define a type for HTTP errors
interface HttpError {
    response?: {
        data?: RegisterResponse;
        status?: number;
        headers?: Record<string, string>;
    };
    request?: unknown;
    message?: string;
}

export const registerApi = {
    register: async (formData: RegisterFormData): Promise<RegisterResponse> => {
        const params: Record<string, string> = {
            nom: formData.nom,
            prenom: formData.prenom,
            phone: formData.phone,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            role: formData.role,
        };

        if (formData.id_register_users) {
            params.id_register_users = formData.id_register_users;
        }

        // Ajout des champs optionnels
        if (formData.gender) params.gender = formData.gender;
        if (formData.situation) params.situation = formData.situation;
        if (formData.description) params.description = formData.description;
        if (formData.date_of_birth) params.date_of_birth = formData.date_of_birth;

        try {
            const response = await apiClient.post<RegisterResponse>('/api/signup/signup', params);

            // Retourner directement la réponse - elle contient déjà success et message
            return response;
        } catch (error) {
            console.error("Erreur API register:", error);

            // Si l'erreur contient une réponse du serveur avec les détails
            if (error && typeof error === 'object' && 'response' in error) {
                const httpError = error as HttpError;
                if (httpError.response?.data) {
                    // Le serveur a retourné une réponse avec success: false
                    return httpError.response.data;
                }
            }

            // Pour les autres types d'erreurs (réseau, etc.)
            throw error;
        }
    }
};
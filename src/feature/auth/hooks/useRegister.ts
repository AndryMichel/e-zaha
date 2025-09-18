// src/feature/auth/hooks/useRegister.ts
"use client";

import {useState} from "react";
import {RegisterFormData} from "@/services/types/register.type";
import {registerApi} from "@/services/api/auth/register.api";

// Type definition for HTTP error responses
interface HttpErrorResponse {
    response?: {
        data?: {
            message?: string;
            error?: string;
        };
    };
}

function isHttpError(error: unknown): error is HttpErrorResponse {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as HttpErrorResponse).response === 'object'
    );
}

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const register = async (formData: RegisterFormData): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await registerApi.register(formData);

            // Debug: voir la réponse complète
            console.log("API Response:", response);

            // Gérer le format des données R (tableaux)
            const successValue = Array.isArray(response.success) ? response.success[0] : response.success;
            const messageValue = Array.isArray(response.message) ? response.message[0] : response.message;

            // Vérifier explicitement le champ success de la réponse
            if (response && successValue === true) {
                const successMessage = messageValue || "Inscription réussie ! Vous allez être redirigé vers la page de connexion.";
                setSuccess(successMessage);
                return true;
            } else {
                // Si success est false, traiter comme une erreur
                const errorMessage = messageValue || "Erreur lors de l'inscription";
                setError(errorMessage);
                return false;
            }
        } catch (err) {
            console.error("Erreur d'inscription:", err);

            let errorMessage = "Une erreur s'est produite lors de l'inscription";

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            if (isHttpError(err)) {
                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response?.data?.error) {
                    errorMessage = err.response.data.error;
                }
            }

            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {register, isLoading, error, success};
}
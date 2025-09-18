// src/lib/utils.ts
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Définition propre d'un type pour les erreurs API
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

// Fonction pour gérer les erreurs API
export const handleApiError = (error: ApiError): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return "Une erreur s'est produite. Veuillez réessayer plus tard.";
};

// Fonction pour extraire un token JWT des cookies
export const getTokenFromCookies = (): string | null => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "next-auth.session-token") {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Définir un type minimal pour l'utilisateur
interface User {
    role?: string;
}

// Fonction pour vérifier si un utilisateur est administrateur
export const isAdmin = (user: User | null | undefined): boolean => {
    return user?.role === "admin";
};

// src/services/types/register.type.ts (version mise à jour)
export type RegisterFormData = {
    nom: string;
    prenom: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    role: string;
    gender: string;
    situation: string;
    description: string;
    date_of_birth: string;
    id_register_users?: string;
    validated: boolean;
    // Informations de localisation
    province_name?: string;
    region_name?: string;
    district_name?: string;
    commune_name?: string;
};

export interface ValidateSignupParams {
    utilisateur: string;
    mot_de_passe: string;
}

export interface ValidateSignupResponse {
    success: boolean;
    message: string;
    user?: {
        utilisateur: string;
        province: string;
        region: string;
        district: string;
        commune: string;
        status_register: boolean;
        id_register_users: string;
    };
}

export type UserResponse = {
    admin_id: string | string[];
    nom: string | string[];
    prenom: string | string[];
    email: string | string[];
    username: string | string[];
    phone: string | string[];
    role: string | string[];
    status?: boolean | boolean[];
    location?: {
        province: string;
        region: string;
        district: string;
        commune: string;
    };
};

// Version mise à jour pour gérer les réponses R (avec tableaux)
export type RegisterResponse = {
    success: boolean | boolean[];  // R peut retourner [true] ou true
    message: string | string[];    // R peut retourner ['message'] ou 'message'
    token?: string | string[];
    user?: UserResponse;
    error?: string | string[];
};
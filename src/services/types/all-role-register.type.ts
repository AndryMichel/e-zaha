// src/services/types/all-role-register.type.ts

export interface RoleRegister {
    id_register_users: string;
    province_code: string;
    province_name: string;
    region_code: string;
    region_name: string;
    district_code: string;
    district_name: string;
    commune_code: string;
    commune_name: string;
    utilisateur: string;
    mot_de_passe?: string; // Ajouté pour inclure le mot de passe
    status_register: boolean;
}

export interface GetAllRoleRegisterResponse {
    success?: boolean;
    roles: RoleRegister[];
    total: number;
    page: number;
    total_pages: number;
}

export interface GetAllRoleRegisterParams extends Record<string, unknown> {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}

// Nouveau type pour la réponse de mise à jour du statut
export interface UpdateStatusResponse {
    success: boolean;
    message: string;
    user_id: string;
    new_status: boolean;
}
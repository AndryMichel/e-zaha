// services/types/all-user.type.ts

export interface User {
    admin_id: string;
    nom: string;
    prenom: string;
    phone: string;
    email: string;
    username: string;
    role: string;
    status: string;
    date_of_birth?: string;
    gender?: string;
    situation?: string;
    description?: string;
    created_at: string;
    updated_at?: string;
    province_name?: string;
    region_name?: string;
    district_name?: string;
    commune_name?: string;
}

export interface GetAllUsersParams extends Record<string, unknown> {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}

export interface GetAllUsersResponse {
    success: boolean;
    users: User[];
    page: number;
    total: number;
    total_pages: number;
    message?: string;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string;
}
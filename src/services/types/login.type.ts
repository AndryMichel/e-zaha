import "next-auth";

export type LoginCredentials = {
    identifier: string;
    password: string;
};

export type LocationInfo = {
    province: string[];
    province_code: string[];
    region: string[];
    region_code: string[];
    district: string[];
    district_code: string[];
    commune: string[];
    commune_code: string[];
    utilisateur: string[];
    status_base: boolean[];
    status_register: boolean[];
};

export type UserResponse = {
    admin_id: string[];
    nom: string[];
    prenom: string[];
    email: string[];
    username: string[];
    phone: string[];
    role: string[];
    id_register_users: string[];
    location?: LocationInfo;
    status?: boolean[];
};

export type LoginResponse = {
    success: boolean[];
    message: string[];
    token: string[];
    user: UserResponse;
};

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            username: string;
            phone: string;
            role: string;
            id_register_users: string;
            token: string;
            location: LocationInfo;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        username: string;
        phone: string;
        role: string;
        token: string;
        id_register_users: string;
        location: LocationInfo;
    }
}


export type AuthUser = {
    id: string;
    name: string;
    email: string;
    username: string;
    phone: string;
    role: string;
    token: string;
    id_register_users: string;
    location: LocationInfo;
};
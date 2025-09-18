// src/services/api/auth/login.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {LoginCredentials, LoginResponse} from "@/services/types/login.type";

export const loginApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const params = {
            identifier: credentials.identifier,
            password: credentials.password,
        };

        return await apiClient.get<LoginResponse>('/api/signin/signin', params);
    }
};
// src/services/api/auth/cancel-signup.api.ts
import {apiClient} from "@/services/helpers/apiClient";

export const cancelSignup = async (utilisateur: string): Promise<unknown> => {
    const params = {utilisateur};
    const response = await apiClient.post("/api/cancelvalidate/cancel-signup", params);
    return response;
};

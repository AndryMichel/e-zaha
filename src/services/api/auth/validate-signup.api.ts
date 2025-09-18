// src/services/api/auth/validate-signup.api.ts
import {apiClient} from "@/services/helpers/apiClient";
import {ValidateSignupParams, ValidateSignupResponse} from "@/services/types/register.type";

export const validateSignup = async (params: ValidateSignupParams): Promise<ValidateSignupResponse> => {
    const stringParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
        stringParams[key] = String(value);
    }
    return await apiClient.post<ValidateSignupResponse>('/api/validate/validate-signup', stringParams);
};
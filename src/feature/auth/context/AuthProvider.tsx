// src/context/AuthProvider.tsx
"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {signIn, signOut, useSession} from "next-auth/react";
import {LoginCredentials} from "@/services/types/login.type";
import type {Session} from "next-auth";

type AuthContextType = {
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: Session["user"] | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const {data: session, status} = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        if (status !== "loading") {
            setIsLoading(false);
        }
    }, [status]);

    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                identifier: credentials.identifier,
                password: credentials.password,
                redirect: false,
            });

            setIsLoading(false);

            if (result?.error) {
                return false;
            }

            return true;
        } catch (error) {
            setIsLoading(false);
            console.error("Erreur de connexion:", error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await signOut({redirect: false});
            router.push("/login");
        } catch (error) {
            console.error("Erreur de déconnexion:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        login,
        logout,
        isAuthenticated: !!session?.user,
        isLoading,
        user: session?.user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth doit être utilisé avec AuthProvider");
    }
    return context;
};
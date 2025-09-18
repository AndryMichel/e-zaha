// src/components/auth/ProtectedRoute.tsx
"use client";

import {useAuth} from "@/feature/auth/context/AuthProvider";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {Loader2} from "lucide-react";
import {ValidationGuard} from "@/feature/auth/vanguad";


interface ProtectedRouteProps {
    children: React.ReactNode;
    requiresValidation?: boolean;
}

export default function ProtectedRoute({children, requiresValidation = false}: ProtectedRouteProps) {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="size-12 animate-spin text-primary"/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }
    if (requiresValidation) {
        return <ValidationGuard>{children}</ValidationGuard>;
    }

    return <>{children}</>;
}
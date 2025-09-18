"use client";

import React, {createContext, useCallback, useContext, useState} from "react";
import {X} from "lucide-react";

// Types pour le système de Toast
type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

// Création du contexte
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Composant Toast individuel
function Toast({id, message, type, onClose}: ToastProps & { onClose: (id: string) => void }) {
    const bgColor = {
        success: "bg-green-100 border-green-400 text-green-700",
        error: "bg-red-100 border-red-400 text-red-700",
        info: "bg-blue-100 border-blue-400 text-blue-700",
        warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    };

    return (
        <div
            className={`${bgColor[type]} px-4 py-3 rounded border mb-2 flex justify-between items-center shadow-md`}
            role="alert"
        >
            <span>{message}</span>
            <button
                onClick={() => onClose(id)}
                className="ml-4 focus:outline-none"
                aria-label="Fermer"
            >
                <X size={18}/>
            </button>
        </div>
    );
}

// Provider du système de Toast
export function ToastProvider({children}: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    // Fonction pour supprimer un toast
    const removeToast = useCallback((id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    // Fonction pour afficher un nouveau toast
    const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
        const id = Date.now().toString();
        const newToast = {id, message, type, duration};
        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Auto-remove après la durée spécifiée
        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    }, [removeToast]);

    const contextValue = {showToast};

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2 min-w-[250px] max-w-sm">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// Hook pour utiliser le système de Toast
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
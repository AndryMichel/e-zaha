"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ValidateSignupForm} from "@/feature/auth/ValidateSignupForm";

interface ValidationGuardProps {
    children: React.ReactNode;
}

export function ValidationGuard({children}: ValidationGuardProps) {
    const [isValidated, setIsValidated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Vérifier si la validation a été effectuée
        const validationData = sessionStorage.getItem("validationData");
        if (validationData) {
            const parsedData = JSON.parse(validationData);
            if (parsedData.validated) {
                setIsValidated(true);
            } else {
                setShowValidationModal(true);
            }
        } else {
            setShowValidationModal(true);
        }
        setIsChecking(false);
    }, []);

    const handleValidationSuccess = () => {
        setIsValidated(true);
        setShowValidationModal(false);
    };

    if (isChecking) {
        return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
    }

    return (
        <>
            {isValidated ? children : (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Validation requise</h1>
                        <p className="mt-2 text-gray-600">
                            Vous devez valider votre compte avant de pouvoir accéder à cette page.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowValidationModal(true)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Valider mon compte
                    </button>
                </div>
            )}

            <ValidateSignupForm
                isOpen={showValidationModal}
                onClose={() => router.push('/')}
                onSuccess={handleValidationSuccess}
            />
        </>
    );
}
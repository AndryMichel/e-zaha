// src/app/(public)/layout.tsx
'use client'

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function PublicLayout({}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    useEffect(() => {
        // Redirection immédiate vers /login
        router.push('/login');
    }, [router]);

    // Affichage d'un loader pendant la redirection
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Redirection vers la page de connexion...</p>
            </div>
        </div>
    );
}
// src/app/layout.tsx
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {AuthSessionProvider} from "@/feature/auth/AuthSessionProvider";
import {AuthProvider} from "@/feature/auth/context/AuthProvider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "e-Zaha",
    description: "Plateforme de gestion des données territoriales",
    icons: {
        icon: "/oddl.ico"
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body className={inter.className}>
        <AuthSessionProvider>
            <AuthProvider>{children}</AuthProvider>
        </AuthSessionProvider>
        </body>
        </html>
    );
}
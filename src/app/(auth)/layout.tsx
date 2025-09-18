// src/app/(auth)/layout.tsx
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Authentification e-Zaha",
    description: "Se connecter ou s'inscrire",
    icons: {
        icon: "/oddl.ico"
    },
};

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            {children}
        </div>
    );
}
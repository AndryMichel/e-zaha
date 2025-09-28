// src/app/(public)/layout.tsx
import {PublicNavbar} from '@/components/public-navbar';
import {Footer} from '@/components/Footer';

export default function PublicLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            <main className="pt-32 lg:pt-48">
                {children}
            </main>
            <Footer />
        </div>
    );
}
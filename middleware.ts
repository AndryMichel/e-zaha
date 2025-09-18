// middleware.ts
import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    // const url = request.nextUrl.clone();

    // Liste des routes publiques à rediriger vers /login
    const publicRoutes = [
        '/',
        '/directeur',
        '/historique',
        '/mission',
        '/juridique',
        '/organigramme',
        '/partenaires',
        '/objectifs',
        '/ressources',
        '/galerie',
        '/contact',
        '/textes',
        '/document',
        '/igl',
        '/finance',
        '/structure',
        '/planification',
        '/odd'
    ];

    // Vérifier si le chemin contient un PDF ou est dans le dossier documents
    if (pathname.includes('.pdf') || pathname.includes('/documents/')) {
        return NextResponse.next();
    }

    // ⚠️ REDIRECTION DES PAGES PUBLIQUES VERS /login
    if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Vérifier si le chemin commence par "/dashboard"
    const isAdminPath = pathname.startsWith("/dashboard");

    // Récupérer le token depuis les cookies
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Si l'utilisateur essaie d'accéder au dashboard sans être connecté
    if (isAdminPath && !token) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("callbackUrl", encodeURI(pathname));
        return NextResponse.redirect(redirectUrl);
    }

    // Si l'utilisateur est déjà connecté et essaie d'accéder aux pages d'auth
    if ((pathname === "/login" || pathname === "/register") && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const requestHeaders = new Headers(request.headers);

    // Add CORS headers to Next.js API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    }

    return NextResponse.next();
}

// Configurer les chemins à vérifier avec le middleware
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
        '/',
        '/directeur/:path*',
        '/historique/:path*',
        '/mission/:path*',
        '/juridique/:path*',
        '/organigramme/:path*',
        '/partenaires/:path*',
        '/objectifs/:path*',
        '/ressources/:path*',
        '/galerie/:path*',
        '/contact/:path*',
        '/textes/:path*',
        '/document/:path*',
        '/directeur',
        '/historique',
        '/mission',
        '/juridique',
        '/organigramme',
        '/partenaires',
        '/objectifs',
        '/ressources',
        '/galerie',
        '/contact',
        '/textes',
        '/document',
        '/igl',
        '/finance',
        '/structure',
        '/planification',
        '/odd',
        '/api/:path*'
    ],
};
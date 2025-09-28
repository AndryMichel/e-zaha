// middleware.ts
import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Vérifier si le chemin contient un PDF ou est dans le dossier documents
    if (pathname.includes('.pdf') || pathname.includes('/documents/')) {
        return NextResponse.next();
    }

    // Routes d'authentification
    const authRoutes = ['/login', '/register'];

    // Routes du dashboard (privées)
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
    if (authRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Gérer les en-têtes CORS pour les routes API
    const requestHeaders = new Headers(request.headers);

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

    // Permettre l'accès à toutes les autres routes (publiques)
    return NextResponse.next();
}

// Configurer les chemins à vérifier avec le middleware
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
        '/api/:path*'
    ],
};
// src/featureauth/useLogin.ts
import {NextAuthOptions, Session} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {JWT} from "next-auth/jwt";

import {AuthUser, LocationInfo, LoginCredentials} from "@/services/types/login.type";
import {loginApi} from "@/services/api/auth/login.api";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: {label: "Identifier", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    console.log("Identifiants manquants");
                    return null;
                }

                try {
                    // Utilisation du type LoginCredentials pour typer les credentials
                    const loginCredentials: LoginCredentials = {
                        identifier: credentials.identifier,
                        password: credentials.password
                    };

                    const loginResponse = await loginApi.login(loginCredentials);

                    console.log("Réponse API complète:", JSON.stringify(loginResponse));

                    // Vérification plus précise des données reçues
                    if (loginResponse.success && loginResponse.success[0] === true && loginResponse.token && loginResponse.user) {
                        return {
                            id: loginResponse.user.admin_id[0],
                            name: `${loginResponse.user.prenom[0]} ${loginResponse.user.nom[0]}`,
                            email: loginResponse.user.email[0],
                            username: loginResponse.user.username[0],
                            phone: loginResponse.user.phone[0],
                            role: loginResponse.user.role[0],
                            token: loginResponse.token[0],
                            id_register_users: loginResponse.user.id_register_users[0],
                            location: loginResponse.user.location,

                        };
                    }

                    console.log("Format de données inattendu:", loginResponse);
                    return null;
                } catch (error) {
                    console.error("Erreur lors de l'autorisation:", error);
                    return null;
                }
            }
        }),
    ],
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({token, user}) {
            if (user && 'username' in user) {
                const authUser = user as unknown as AuthUser;
                token.id = authUser.id;
                token.name = authUser.name;
                token.email = authUser.email;
                token.username = authUser.username;
                token.phone = authUser.phone;
                token.role = authUser.role;
                token.token = authUser.token;
                token.id_register_users = authUser.id_register_users;
                token.location = authUser.location;
            }
            return token;
        },
        async session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    name: token.name as string,
                    email: token.email as string,
                    username: token.username as string,
                    phone: token.phone as string,
                    role: token.role as string,
                    token: token.token as string,
                    id_register_users: token.id_register_users as string,
                    location: token.location as LocationInfo,


                };
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 12 * 60 * 60, // 12 heures
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
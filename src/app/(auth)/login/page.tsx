// LoginPage.tsx - Version ultra-premium avec effets visuels avancés
'use client'
import {LoginForm} from "@/feature/auth/login/LoginForm"
import {Suspense} from 'react'

export default function LoginPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background sombre élégant */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
                <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-700/10 via-transparent to-transparent"></div>
                <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-700/10 via-transparent to-transparent"></div>
            </div>

            {/* Particules flottantes subtiles */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gray-300/5 rounded-full blur-3xl animate-pulse"
                     style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl animate-pulse"
                     style={{animationDelay: '4s'}}></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div
                    className="w-full max-w-7xl flex flex-col xl:flex-row bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">

                    {/* Section gauche - Hero avec image de fond */}
                    <div
                        className="xl:w-3/5 relative min-h-[500px] xl:min-h-[700px] flex flex-col justify-center items-center text-center p-8 xl:p-16">
                        {/* Image de fond avec overlay sophistiqué */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{backgroundImage: "url('/assets/bb.png')"}}
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-gray-800/80 via-slate-800/70 to-black/80"></div>
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        </div>

                        {/* Contenu héro */}
                        <div className="relative z-20 text-white max-w-2xl">
                            

                            {/* Titre principal avec animations */}
                            <div className="space-y-6 mb-8">
                                <h1 className="text-5xl xl:text-7xl font-black leading-tight">
                                    <span className="block animate-fadeInUp">Bienvenue sur</span>
                                    <span className="block text-4xl xl:text-6xl font-light mt-2 animate-fadeInUp"
                                          style={{animationDelay: '0.2s'}}>
                                        la plateforme
                                    </span>
                                    <span
                                        className="block text-5xl xl:text-7xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mt-4 animate-fadeInUp"
                                        style={{animationDelay: '0.4s'}}>
                                        e-Zaha
                                    </span>
                                </h1>
                            </div>

                        </div>

                        {/* Éléments décoratifs animés */}
                        <div
                            className="absolute top-12 right-12 w-40 h-40 border border-white/20 rounded-full opacity-30 animate-ping"
                            style={{animationDuration: '4s'}}></div>
                        <div
                            className="absolute bottom-16 left-12 w-32 h-32 border border-white/20 rounded-full opacity-40 animate-ping"
                            style={{animationDuration: '6s', animationDelay: '2s'}}></div>
                        <div className="absolute top-1/3 left-8 w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="absolute top-2/3 right-16 w-2 h-2 bg-white/80 rounded-full animate-pulse"
                             style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/2 right-8 w-1 h-1 bg-white rounded-full animate-pulse"
                             style={{animationDelay: '3s'}}></div>
                    </div>

                    {/* Section droite - Formulaire glassmorphism */}
                    <div
                        className="xl:w-2/5 p-8 xl:p-16 flex flex-col justify-center bg-white/95 backdrop-blur-xl border-l border-white/20">
                        <Suspense fallback={
                            <div className="flex items-center justify-center py-16">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                                    <div
                                        className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        }>
                            <LoginForm/>
                        </Suspense>

                        {/* Footer élégant */}
                        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500 font-medium">
                                © {new Date().getFullYear()} <span className="font-semibold">Observatoireddl</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Tous droits réservés</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
            `}</style>
        </div>
    )
}
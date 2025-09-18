// RegisterPage.tsx - Version simple avec formulaire plus large
'use client'
import {RegisterForm} from "@/feature/auth/register/RegisterForm"
import {Suspense} from 'react'

export default function RegisterPage() {
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
                {/* Formulaire centré plus large */}
                <div
                    className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="p-8 lg:p-16">
                        <Suspense fallback={
                            <div className="flex items-center justify-center py-16">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
                                    <div
                                        className="absolute top-0 left-0 w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        }>
                            <RegisterForm/>
                        </Suspense>

                        {/* Footer élégant */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500 font-medium">
                                © {new Date().getFullYear()} <span className="font-semibold">Observatoireddl</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Tous droits réservés</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
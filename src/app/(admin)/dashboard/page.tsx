'use client'

import {DashboardContent} from '@/feature/dashboard/DashboardContent';

export default function DashboardPage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <div className="w-full px-4 py-6 md:px-6 lg:px-8">
                {/* En-tête du dashboard */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Tableau de Bord e-Zaha
                            </h1>
                            <p className="text-slate-600 text-base md:text-lg max-w-2xl">
                                Vue d&#39;ensemble des indicateurs de développement de Madagascar
                            </p>
                        </div>

                        <div className="flex flex-col items-start lg:items-end space-y-1">
                            <div
                                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg shadow-sm">
                                <p className="text-sm font-medium text-slate-500">Dernière mise à jour</p>
                                <p className="text-sm font-semibold text-slate-700">
                                    {new Date().toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ligne de séparation décorative */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                {/* Contenu du dashboard */}
                <DashboardContent/>
            </div>
        </div>
    );
}
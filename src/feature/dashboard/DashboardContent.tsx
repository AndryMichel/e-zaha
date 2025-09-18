import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Activity, Building, Landmark, MapPin, RefreshCw, Users} from 'lucide-react';

import {
    type AdminRoleStats,
    formatNumber,
    formatPercentage,
    translateRole,
    useGetDashboardSummary
} from '@/services/api/dashboard/get-dashboard-summary.api';
import {Alert, AlertDescription} from "@/components/ui/atomes/alert";

export function DashboardContent() {
    const {
        dashboardData,
        generalStats,
        adminStats,
        chartsData,
        lastUpdated,
        isLoading,
        isError,
        isAuthenticated,
        refetch
    } = useGetDashboardSummary();

    // Gestion de l'état d'authentification
    if (!isAuthenticated) {
        return (
            <Alert className="mx-4">
                <AlertDescription>
                    Vous devez être connecté pour accéder au tableau de bord.
                </AlertDescription>
            </Alert>
        );
    }

    // Gestion du chargement
    if (isLoading) {
        return (
            <div className="w-full space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                    <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center">
                    <p className="text-slate-500">Chargement des données du tableau de bord....</p>
                </div>
            </div>
        );
    }

    // Gestion des erreurs
    if (isError) {
        return (
            <Alert className="mx-4">
                <AlertDescription>
                    <span>Erreur lors du chargement des données du tableau de bord</span>
                    <button
                        onClick={refetch}
                        className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4"/>
                        Réessayer
                    </button>
                </AlertDescription>
            </Alert>
        );
    }

    // Vérification des données
    if (!dashboardData || !generalStats || !adminStats || !chartsData) {
        return (
            <Alert className="mx-4">
                <AlertDescription>Aucune donnée disponible</AlertDescription>
            </Alert>
        );
    }

    // Calculer les pourcentages pour les barres de progression
    const regionsPercentage = generalStats.regions > 0 ? (generalStats.regions_verifiees / generalStats.regions) * 100 : 0;
    const communesPercentage = generalStats.communes > 0 ? (generalStats.communes_verifiees / generalStats.communes) * 100 : 0;
    const districtsPercentage = generalStats.districts > 0 ? (generalStats.districts_verifies / generalStats.districts) * 100 : 0;

    // Statistiques principales (3 cartes)
    const mainStats = [
        {
            title: 'Régions',
            value: `${formatNumber(generalStats.regions_verifiees)}/${formatNumber(generalStats.regions)}`,
            icon: Landmark,
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            description: 'Régions administratives',
            percentage: regionsPercentage
        },
        {
            title: 'Communes',
            // value: `${formatNumber(generalStats.communes_verifiees)}/${formatNumber(generalStats.communes )}`,
            value: `${formatNumber(generalStats.communes_verifiees)}/1695`,
            icon: MapPin,
            color: 'bg-blue-50 text-blue-600 border-blue-100',
            description: `${formatPercentage(generalStats.taux_verification_communes || 0)} vérifiées`,
            percentage: communesPercentage
        },
        {
            title: 'Districts',
            value: `${formatNumber(generalStats.districts_verifies)}/${formatNumber(generalStats.districts)}`,
            icon: Building,
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            description: 'Districts administratifs',
            percentage: districtsPercentage
        }
    ];

    // Statistiques secondaires (2 cartes)
    const adminStatusStats = [
        {
            title: 'Utilisateurs Admin',
            value: formatNumber(adminStats.total),
            icon: Users,
            color: 'bg-purple-50 text-purple-600 border-purple-100'
        },
        {
            title: 'Communes Vérifiées',
            value: formatNumber(generalStats.communes_verifiees),
            icon: Activity,
            color: 'bg-blue-50 text-blue-600 border-blue-100'
        }
    ];

    return (
        <div className="w-full space-y-8">
            {/* En-tête avec bouton de rafraîchissement */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-slate-500">
                        Dernière mise à jour
                        : {lastUpdated ? new Date(lastUpdated).toLocaleString('fr-FR') : 'Non disponible'}
                    </p>
                </div>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4"/>
                    Actualiser
                </button>
            </div>

            {/* Statistiques principales - 3 cartes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainStats.map((stat, index) => (
                    <Card key={index}
                          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2 flex-1">
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                                        {stat.value}
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-2">
                                        {stat.description}
                                    </p>

                                    {/* Barre de progression */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                stat.title === 'Régions' ? 'bg-emerald-500' :
                                                    stat.title === 'Communes' ? 'bg-blue-500' :
                                                        'bg-indigo-500'
                                            }`}
                                            style={{
                                                width: `${stat.percentage}%`
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {stat.percentage.toFixed(1)}% vérifié{stat.percentage !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div
                                    className={`rounded-2xl p-4 border-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="h-8 w-8"/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Statistiques secondaires - 2 cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminStatusStats.map((stat, index) => (
                    <Card key={index}
                          className="hover:shadow-md transition-shadow border-0 shadow-sm bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className={`rounded-xl p-3 ${stat.color}`}>
                                    <stat.icon className="h-5 w-5"/>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <h4 className="text-xl font-bold text-slate-800">{stat.value}</h4>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Cartes des rôles administrateurs */}
            <Card className="shadow-md bg-white/90 backdrop-blur-sm border-0">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Répartition des Administrateurs par Rôle
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adminStats.repartition_par_role.map((role: AdminRoleStats, index: number) => (
                            <Card key={index} className="border border-slate-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="text-center space-y-2">
                                        <h4 className="font-semibold text-slate-800 text-sm">
                                            {translateRole(role.role)}
                                        </h4>
                                        <div className="text-2xl font-bold text-slate-700">
                                            {formatNumber(role.count)}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            utilisateur{role.count > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
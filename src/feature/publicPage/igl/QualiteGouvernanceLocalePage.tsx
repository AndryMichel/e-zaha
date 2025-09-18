"use client";

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {
    useGetMoyenneNationaleNoteIglPublic,
    useGetPourcentageCommunesIglEnLignePublic,
    useGetPourcentageCommunesIglSuperieur6Public,
    useGetPourcentageCommunesPopulationSatisfaitePublic,
    useGetStatistiquesSatisfactionPopulationPublic
} from "@/services/api/oddl/indic-qualite-gouvernance-locale.api";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Info} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import {motion} from '@/components/ui/templates/motion';

export function QualiteGouvernanceLocalePage() {
    // Année actuelle comme année sélectionnée par défaut
    const currentYear = new Date().getFullYear();

    // Hooks pour récupérer les données de l'API (version publique)
    const {data: pourcentageIglSup6Data, isLoading: isLoadingIglSup6, isError: isErrorIglSup6} =
        useGetPourcentageCommunesIglSuperieur6Public({annee: currentYear});

    const {data: moyenneIglData, isLoading: isLoadingMoyenneIgl, isError: isErrorMoyenneIgl} =
        useGetMoyenneNationaleNoteIglPublic({annee: currentYear});

    const {data: pourcentageIglEnLigneData, isLoading: isLoadingIglEnLigne, isError: isErrorIglEnLigne} =
        useGetPourcentageCommunesIglEnLignePublic({annee: currentYear});

    const {data: pourcentageSatisfactionData, isLoading: isLoadingSatisfaction, isError: isErrorSatisfaction} =
        useGetPourcentageCommunesPopulationSatisfaitePublic({annee: currentYear});

    const {data: statistiquesSatisfactionData, isLoading: isLoadingStats, isError: isErrorStats} =
        useGetStatistiquesSatisfactionPopulationPublic({annee: currentYear});

    // Vérification si des données sont disponibles
    const hasNoDataPourcentageSup6 = pourcentageIglSup6Data && !pourcentageIglSup6Data.pourcentage_communes_igl_sup_6;
    const hasNoDataMoyenneIgl = moyenneIglData && !moyenneIglData.moyenne_nationale_note_igl;
    const hasNoDataIglEnLigne = pourcentageIglEnLigneData && !pourcentageIglEnLigneData.pourcentage_communes_igl_en_ligne;
    const hasNoDataSatisfaction = pourcentageSatisfactionData && !pourcentageSatisfactionData.pourcentage_communes_population_satisfaite;
    const hasNoDataStats = statistiquesSatisfactionData && !statistiquesSatisfactionData.statistiques;

    // Message d'absence de données
    const noDataMessage = "Aucune donnée disponible pour l'année en cours";

    // Vérification globale des données manquantes
    const hasNoData = hasNoDataPourcentageSup6 || hasNoDataMoyenneIgl || hasNoDataIglEnLigne ||
        hasNoDataSatisfaction || hasNoDataStats;

    // État de chargement global
    const isLoading = isLoadingIglSup6 || isLoadingMoyenneIgl || isLoadingIglEnLigne ||
        isLoadingSatisfaction || isLoadingStats;

    // État d'erreur global
    const hasError = isErrorIglSup6 || isErrorMoyenneIgl || isErrorIglEnLigne ||
        isErrorSatisfaction || isErrorStats;

    // Helper functions pour accéder aux données en toute sécurité
    const safeGetPourcentageSup6 = () => {
        return pourcentageIglSup6Data?.pourcentage_communes_igl_sup_6?.[0] ?? 0;
    };

    const safeGetTotalCommunes = () => {
        return pourcentageIglSup6Data?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesIglSup6 = () => {
        return pourcentageIglSup6Data?.communes_igl_sup_6?.[0] ?? 0;
    };

    const safeGetMoyenneNationaleIgl = () => {
        return moyenneIglData?.moyenne_nationale_note_igl?.[0] ?? 0;
    };

    const safeGetTotalCommunesMoyenne = () => {
        return moyenneIglData?.total_communes?.[0] ?? 0;
    };

    // Composant de cercle de pourcentage
    const PercentageCircle = ({percentage, color}: { percentage: number, color: string }) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="flex justify-center items-center relative">
                <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="transparent"
                        stroke="#e6e6e6"
                        strokeWidth="12"
                    />
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute text-2xl font-bold">{percentage}%</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Qualité de la Gouvernance Locale"
                subtitle="Visualisation des indicateurs clés pour mesurer la qualité de la gouvernance locale"
            />

            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Message d'erreur */}
                    {hasError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>
                                Une erreur est survenue lors du chargement des données. Veuillez réessayer.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Message d'absence de données */}
                    {!isLoading && !hasError && hasNoData && (
                        <Alert className="mb-6">
                            <Info className="h-4 w-4"/>
                            <AlertDescription>
                                {Array.isArray(noDataMessage) ? noDataMessage[0] : noDataMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Conteneur centré pour les 2 cartes */}
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto">
                        {/* Pourcentage des communes avec IGL > 6 */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.1}}
                            className="flex-1 max-w-md"
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                        IGL-01
                                        </span>
                                        Pourcentage de Communes ayant une note IGL supérieure ou égale à 6
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingIglSup6 ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : hasNoDataPourcentageSup6 ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle percentage={safeGetPourcentageSup6()} color="#0088FE"/>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                des communes ont un IGL supérieur ou égal à 6
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p>• Communes avec IGL ≥ 6: {safeGetCommunesIglSup6()}</p>
                                                <p>• Total des communes évaluées {safeGetTotalCommunes()}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Moyenne nationale de la note IGL */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                            className="flex-1 max-w-md"
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                        IGL-02
                                        </span>
                                        Moyenne nationale de la note IGL
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingMoyenneIgl ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : hasNoDataMoyenneIgl ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="flex justify-center items-center relative">
                                                <svg width="140" height="140" viewBox="0 0 140 140">
                                                    <circle
                                                        cx="70"
                                                        cy="70"
                                                        r="60"
                                                        fill="transparent"
                                                        stroke="#e6e6e6"
                                                        strokeWidth="12"
                                                    />
                                                    <circle
                                                        cx="70"
                                                        cy="70"
                                                        r="60"
                                                        fill="transparent"
                                                        stroke="#00C49F"
                                                        strokeWidth="12"
                                                        strokeDasharray={2 * Math.PI * 60}
                                                        strokeDashoffset={2 * Math.PI * 60 * (1 - safeGetMoyenneNationaleIgl() / 10)}
                                                        strokeLinecap="round"
                                                        className="transform -rotate-90 origin-center"
                                                    />
                                                </svg>
                                                <div
                                                    className="absolute text-2xl font-bold">{safeGetMoyenneNationaleIgl()}</div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                moyenne nationale de l&#39;indice de gouvernance locale
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p>• Sur une échelle de 0 à 10</p>
                                                <p>• Total des communes évaluées: {safeGetTotalCommunesMoyenne()}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
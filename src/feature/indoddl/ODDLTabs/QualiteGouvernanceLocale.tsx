'use client'

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {
    useGetMoyenneNationaleNoteIgl,
    useGetPourcentageCommunesIglSuperieur6,
    useGetPourcentageCommunesPopulationSatisfaite,
    useGetStatistiquesSatisfactionPopulation
} from "@/services/api/oddl/indic-qualite-gouvernance-locale.api";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Info} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {getPercentageColor, getPerformanceLevel} from "@/lib/color-number";

export function QualiteGouvernanceLocale() {
    // État pour l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        // Par défaut, on utilise l'année courante
        return new Date().getFullYear();
    });

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Hooks pour récupérer les données de l'API
    const {data: pourcentageIglSup6Data, isLoading: isLoadingIglSup6, isError: isErrorIglSup6} =
        useGetPourcentageCommunesIglSuperieur6({annee: selectedYear});

    const {data: moyenneIglData, isLoading: isLoadingMoyenneIgl, isError: isErrorMoyenneIgl} =
        useGetMoyenneNationaleNoteIgl({annee: selectedYear});

    // const {data: pourcentageIglEnLigneData, isLoading: isLoadingIglEnLigne, isError: isErrorIglEnLigne} =
    //     useGetPourcentageCommunesIglEnLigne({annee: selectedYear});

    const {data: pourcentageSatisfactionData, isLoading: isLoadingSatisfaction, isError: isErrorSatisfaction} =
        useGetPourcentageCommunesPopulationSatisfaite({annee: selectedYear});

    const {data: statistiquesSatisfactionData, isLoading: isLoadingStats, isError: isErrorStats} =
        useGetStatistiquesSatisfactionPopulation({annee: selectedYear});

    // Vérification si des données sont disponibles
    const hasNoDataPourcentageSup6 = pourcentageIglSup6Data && !pourcentageIglSup6Data.pourcentage_communes_igl_sup_6;
    const hasNoDataMoyenneIgl = moyenneIglData && !moyenneIglData.moyenne_nationale_note_igl;
    // const hasNoDataIglEnLigne = pourcentageIglEnLigneData && !pourcentageIglEnLigneData.pourcentage_communes_igl_en_ligne;
    const hasNoDataSatisfaction = pourcentageSatisfactionData && !pourcentageSatisfactionData.pourcentage_communes_population_satisfaite;
    const hasNoDataStats = statistiquesSatisfactionData && !statistiquesSatisfactionData.statistiques;

    // Vérification si un message d'absence de données est disponible
    const noDataMessage = "Aucune donnée disponible pour l'année sélectionnée";

    // Vérification globale des données manquantes
    const hasNoData = hasNoDataPourcentageSup6 || hasNoDataMoyenneIgl ||
        // hasNoDataIglEnLigne ||
        hasNoDataSatisfaction || hasNoDataStats;

    // État de chargement global
    const isLoading = isLoadingIglSup6 || isLoadingMoyenneIgl ||
        // isLoadingIglEnLigne ||
        isLoadingSatisfaction || isLoadingStats;

    // État d'erreur global
    const hasError = isErrorIglSup6 || isErrorMoyenneIgl ||
        // isErrorIglEnLigne ||
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

    // const safeGetPourcentageIglEnLigne = () => {
    //     return pourcentageIglEnLigneData?.pourcentage_communes_igl_en_ligne?.[0] ?? 0;
    // };

    // const safeGetTotalCommunesAvecIgl = () => {
    //     return pourcentageIglEnLigneData?.total_communes_avec_igl?.[0] ?? 0;
    // };

    // const safeGetCommunesIglEnLigne = () => {
    //     return pourcentageIglEnLigneData?.communes_igl_en_ligne?.[0] ?? 0;
    // };

    const safeGetPourcentageSatisfaction = () => {
        return pourcentageSatisfactionData?.pourcentage_communes_population_satisfaite?.[0] ?? 0;
    };

    const safeGetTotalCommunesSatisfaction = () => {
        return pourcentageSatisfactionData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesSatisfaites = () => {
        return pourcentageSatisfactionData?.communes_satisfaites?.[0] ?? 0;
    };

    // Convertir la moyenne IGL (0-10) en pourcentage pour les couleurs
    const moyenneIglPourcentage = (safeGetMoyenneNationaleIgl() / 10) * 100;

    return (
        <div className="space-y-6">
            {/* Sélecteur d'année */}
            <div className="flex justify-end mb-4">
                <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner l'année"/>
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Message d'erreur */}
            {hasError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertDescription>
                        Une erreur est survenue lors du chargement des données. Veuillez réessayer.
                    </AlertDescription>
                </Alert>
            )}

            {/* Message d'absence de données */}
            {!isLoading && !hasError && hasNoData && (
                <Alert>
                    <Info className="h-4 w-4"/>
                    <AlertDescription>
                        {Array.isArray(noDataMessage) ? noDataMessage[0] : noDataMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* Cartes d'indicateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Pourcentage des communes avec IGL > 6 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes ayant une note IGL supérieure ou égale à 6</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingIglSup6 ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataPourcentageSup6 ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageSup6()).text}`}>
                                        {safeGetPourcentageSup6()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageSup6()).bg} ${getPercentageColor(safeGetPourcentageSup6()).text} ${getPercentageColor(safeGetPourcentageSup6()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageSup6())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont un IGL supérieur ou égal à 6
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec IGL ≥ 6: {safeGetCommunesIglSup6()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunes()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Moyenne nationale de la note IGL */}
                <Card>
                    <CardHeader>
                        <CardTitle>Moyenne nationale de la note IGL</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMoyenneIgl ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataMoyenneIgl ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(moyenneIglPourcentage).text}`}>
                                        {safeGetMoyenneNationaleIgl()}
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(moyenneIglPourcentage).bg} ${getPercentageColor(moyenneIglPourcentage).text} ${getPercentageColor(moyenneIglPourcentage).border} border`}>
                                        {getPerformanceLevel(moyenneIglPourcentage)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    moyenne nationale de l&#39;indice de gouvernance locale
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Sur une échelle de 0 à 10</p>
                                    <p>• Total des communes: {safeGetTotalCommunesMoyenne()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Pourcentage des communes avec IGL en ligne - COMMENTÉ */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes disposant annuellement de valeur IGL accessible en ligne à
                            travers le portail ODDL</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingIglEnLigne ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataIglEnLigne ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageIglEnLigne()).text}`}>
                                        {safeGetPourcentageIglEnLigne()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageIglEnLigne()).bg} ${getPercentageColor(safeGetPourcentageIglEnLigne()).text} ${getPercentageColor(safeGetPourcentageIglEnLigne()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageIglEnLigne())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont publié leur IGL en ligne sur le portail ODDL
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec IGL en ligne: {safeGetCommunesIglEnLigne()}</p>
                                    <p>• Total des communes avec IGL: {safeGetTotalCommunesAvecIgl()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card> */}
            </div>

            {/* Cartes satisfaction et analyse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de communes dont la population est satisfaite des services
                            publics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingSatisfaction ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataSatisfaction ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageSatisfaction()).text}`}>
                                        {safeGetPourcentageSatisfaction()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageSatisfaction()).bg} ${getPercentageColor(safeGetPourcentageSatisfaction()).text} ${getPercentageColor(safeGetPourcentageSatisfaction()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageSatisfaction())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont une population satisfaite des services publics
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec population satisfaite: {safeGetCommunesSatisfaites()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesSatisfaction()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Espace pour un futur graphique */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analyse des performances</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span>0-25%: Faible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                                    <span>25-50%: Modéré</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                    <span>50-75%: Bon</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                    <span>75-100%: Excellent</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
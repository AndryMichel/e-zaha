'use client'

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {
    useGetPourcentageCommunesIndependanceFinanciere,
    useGetPourcentageCommunesInvestissement,
    useGetRatioIndependanceFinanciere,
    useGetRatioInvestissementsHorsSubventions
} from "@/services/api/oddl/indic-invest-oddl.api";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Info} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {getPercentageColor, getPerformanceLevel} from "@/lib/color-number";

export function InvestissementAutonomieFinanciere() {
    // État pour l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        // Par défaut, on utilise l'année courante
        return new Date().getFullYear();
    });

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Hooks pour récupérer les données de l'API
    const {data: investData, isLoading: isLoadingInvest, isError: isErrorInvest} =
        useGetPourcentageCommunesInvestissement({annee: selectedYear});

    const {data: ratioInvestData, isLoading: isLoadingRatioInvest, isError: isErrorRatioInvest} =
        useGetRatioInvestissementsHorsSubventions({annee: selectedYear});

    const {data: independanceData, isLoading: isLoadingIndependance, isError: isErrorIndependance} =
        useGetRatioIndependanceFinanciere({annee: selectedYear});

    const {data: pctIndependanceData, isLoading: isLoadingPctIndependance, isError: isErrorPctIndependance} =
        useGetPourcentageCommunesIndependanceFinanciere({annee: selectedYear});

    // const {data: poidsRecettesData, isLoading: isLoadingPoidsRecettes, isError: isErrorPoidsRecettes} =
    //     useGetPoidsRecettesFiscalesSurRecettesPropres({annee: selectedYear});

    // Vérification si des données sont disponibles
    const hasNoDataInvest = investData && !investData.pourcentage_communes_investissement_15_plus;
    const hasNoDataRatioInvest = ratioInvestData && !ratioInvestData.ratio_moyen_investissements_hors_subventions;
    const hasNoDataIndependance = independanceData && !independanceData.ratio_independance_financiere;
    const hasNoDataPctIndependance = pctIndependanceData && !pctIndependanceData.pourcentage_communes_indep_fin_sup_50;
    // const hasNoDataPoidsRecettes = poidsRecettesData && !poidsRecettesData.poids_recettes_fiscales_pourcentage;

    // Vérification si un message d'absence de données est disponible
    const noDataMessage =
        (investData && investData.message) ||
        (ratioInvestData && ratioInvestData.message) ||
        (independanceData && independanceData.message) ||
        (pctIndependanceData && pctIndependanceData.message) ||
        // (poidsRecettesData && poidsRecettesData.message) ||
        "Aucune donnée disponible pour l'année sélectionnée";

    // Vérification globale des données manquantes
    const hasNoData = hasNoDataInvest || hasNoDataRatioInvest || hasNoDataIndependance ||
        hasNoDataPctIndependance; // || hasNoDataPoidsRecettes;

    // État de chargement global
    const isLoading = isLoadingInvest || isLoadingRatioInvest || isLoadingIndependance ||
        isLoadingPctIndependance; // || isLoadingPoidsRecettes;

    // État d'erreur global
    const hasError = isErrorInvest || isErrorRatioInvest || isErrorIndependance ||
        isErrorPctIndependance; // || isErrorPoidsRecettes;

    // Helper functions pour accéder aux données en toute sécurité
    const safeGetPourcentageInvest = () => {
        return investData?.pourcentage_communes_investissement_15_plus?.[0] ?? 0;
    };

    const safeGetTotalCommunesInvest = () => {
        return investData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesInvest15Plus = () => {
        return investData?.communes_invest_15_plus?.[0] ?? 0;
    };

    const safeGetRatioInvest = () => {
        return ratioInvestData?.ratio_moyen_investissements_hors_subventions?.[0] ?? 0;
    };

    const safeGetTotalCommunesRatioInvest = () => {
        return ratioInvestData?.total_communes?.[0] ?? 0;
    };

    // const safeGetTotalRecettesPropres = () => {
    //     return independanceData?.total_recettes_propres?.[0] ?? 0;
    // };

    const safeGetPourcentageCommunesIndependance = () => {
        return pctIndependanceData?.pourcentage_communes_indep_fin_sup_50?.[0] ?? 0;
    };

    const safeGetTotalCommunesIndependance = () => {
        return pctIndependanceData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesIndepFinSup50 = () => {
        return pctIndependanceData?.communes_indep_fin_sup_50?.[0] ?? 0;
    };

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

            {/* Cartes d'indicateurs - Ligne unique avec 3 cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pourcentage communes investissement */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de communes ayant un taux d&#39;investissement sur recettes propres
                            supérieur ou égal à 15%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingInvest ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataInvest ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageInvest()).text}`}>
                                        {safeGetPourcentageInvest()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageInvest()).bg} ${getPercentageColor(safeGetPourcentageInvest()).text} ${getPercentageColor(safeGetPourcentageInvest()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageInvest())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes investissent au moins 15% de leurs recettes propres
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes concernées: {safeGetCommunesInvest15Plus()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesInvest()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Ratio investissements hors subventions */}
                <Card>
                    <CardHeader>
                        <CardTitle>ratio d&#39;autonomie financière</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingRatioInvest ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataRatioInvest ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetRatioInvest()).text}`}>
                                        {safeGetRatioInvest()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetRatioInvest()).bg} ${getPercentageColor(safeGetRatioInvest()).text} ${getPercentageColor(safeGetRatioInvest()).border} border`}>
                                        {getPerformanceLevel(safeGetRatioInvest())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    ratio moyen des investissements réalisés hors subventions
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Total des communes évaluées: {safeGetTotalCommunesRatioInvest()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>Représente la capacité des communes à financer leurs investissements sans
                                        dépendre des subventions</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Pourcentage communes indépendance financière */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de communes ayant un ratio autonomie financière supérieur ou
                            égal à 50 %</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingPctIndependance ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataPctIndependance ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageCommunesIndependance()).text}`}>
                                        {safeGetPourcentageCommunesIndependance()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageCommunesIndependance()).bg} ${getPercentageColor(safeGetPourcentageCommunesIndependance()).text} ${getPercentageColor(safeGetPourcentageCommunesIndependance()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageCommunesIndependance())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont une autonomie financière supérieure à 50%
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes concernées: {safeGetCommunesIndepFinSup50()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesIndependance()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>Mesure l&#39;autonomie financière des communes</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Poids des recettes fiscales - COMMENTÉ */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Poids des recettes fiscales sur recettes propres</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingPoidsRecettes ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataPoidsRecettes ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPoidsRecettesFiscales()).text}`}>
                                        {safeGetPoidsRecettesFiscales()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPoidsRecettesFiscales()).bg} ${getPercentageColor(safeGetPoidsRecettesFiscales()).text} ${getPercentageColor(safeGetPoidsRecettesFiscales()).border} border`}>
                                        {getPerformanceLevel(safeGetPoidsRecettesFiscales())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    poids des recettes fiscales sur l&#39;ensemble des recettes propres
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Recettes fiscales: {formatAmount(safeGetTotalRecettesFiscales())} Ariary</p>
                                    <p>• Recettes propres: {formatAmount(safeGetTotalRecettesPropres())} Ariary</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>Indique la dépendance aux impôts et taxes dans les ressources propres</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div> */}

            {/* Légende des couleurs */}
            <Card>
                <CardHeader>
                    <CardTitle>Légende des niveaux de performance financière</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <div>
                                <p className="font-medium text-red-600">Faible</p>
                                <p className="text-xs text-gray-500">0 - 25%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <div>
                                <p className="font-medium text-orange-600">Modéré</p>
                                <p className="text-xs text-gray-500">25 - 50%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <div>
                                <p className="font-medium text-yellow-600">Bon</p>
                                <p className="text-xs text-gray-500">50 - 75%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <div>
                                <p className="font-medium text-green-600">Excellent</p>
                                <p className="text-xs text-gray-500">75 - 100%</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
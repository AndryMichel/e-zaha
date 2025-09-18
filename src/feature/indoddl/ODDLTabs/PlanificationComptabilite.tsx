'use client'

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {
    useGetPourcentageCommunesAvecComptes,
    useGetPourcentageCommunesAvecPlanification,
    useGetPourcentageCommunesEfficacitePrevisionBudgets,
    useGetPourcentageCommunesMaitriseOuvrageEffective,
    useGetPourcentageCommunesStabiliteFinanciere
} from "@/services/api/oddl/indic-plan-oddl.api";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Info} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {getPercentageColor, getPerformanceLevel} from "@/lib/color-number";

export function PlanificationComptabilite() {
    // État pour l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        // Par défaut, on utilise l'année courante
        return new Date().getFullYear();
    });

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Hooks pour récupérer les données de l'API
    const {data: planificationData, isLoading: isLoadingPlanification, isError: isErrorPlanification} =
        useGetPourcentageCommunesAvecPlanification({annee: selectedYear});

    const {data: comptesData, isLoading: isLoadingComptes, isError: isErrorComptes} =
        useGetPourcentageCommunesAvecComptes({annee: selectedYear});

    const {data: maitriseOuvrageData, isLoading: isLoadingMaitriseOuvrage, isError: isErrorMaitriseOuvrage} =
        useGetPourcentageCommunesMaitriseOuvrageEffective({annee: selectedYear});

    const {
        data: efficacitePrevisionData,
        isLoading: isLoadingEfficacitePrevision,
        isError: isErrorEfficacitePrevision
    } =
        useGetPourcentageCommunesEfficacitePrevisionBudgets({annee: selectedYear});

    const {
        data: stabiliteFinanciereData,
        isLoading: isLoadingStabiliteFinanciere,
        isError: isErrorStabiliteFinanciere
    } =
        useGetPourcentageCommunesStabiliteFinanciere({annee: selectedYear});

    // Vérification si des données sont disponibles
    const hasNoDataPlanification = planificationData && !planificationData.pourcentage_communes_avec_planification;
    const hasNoDataComptes = comptesData && !comptesData.pourcentage_communes_avec_comptes;
    const hasNoDataMaitriseOuvrage = maitriseOuvrageData && !maitriseOuvrageData.pourcentage_communes_avec_maitrise_ouvrage_effective;
    const hasNoDataEfficacitePrevision = efficacitePrevisionData && !efficacitePrevisionData.pourcentage_communes_efficacite_prevision;
    const hasNoDataStabiliteFinanciere = stabiliteFinanciereData && !stabiliteFinanciereData.pourcentage_communes_stabilite_financiere;

    // Vérification si un message d'absence de données est disponible
    const noDataMessage = "Aucune donnée disponible pour l'année sélectionnée";

    // Vérification globale des données manquantes
    const hasNoData = hasNoDataPlanification || hasNoDataComptes || hasNoDataMaitriseOuvrage ||
        hasNoDataEfficacitePrevision || hasNoDataStabiliteFinanciere;

    // État de chargement global
    const isLoading = isLoadingPlanification || isLoadingComptes || isLoadingMaitriseOuvrage ||
        isLoadingEfficacitePrevision || isLoadingStabiliteFinanciere;

    // État d'erreur global
    const hasError = isErrorPlanification || isErrorComptes || isErrorMaitriseOuvrage ||
        isErrorEfficacitePrevision || isErrorStabiliteFinanciere;

    // Helper functions pour accéder aux données en toute sécurité
    const safeGetPourcentagePlanification = () => {
        return planificationData?.pourcentage_communes_avec_planification?.[0] ?? 0;
    };

    const safeGetTotalCommunesPlanification = () => {
        return planificationData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesAvecPlanification = () => {
        return planificationData?.communes_avec_planification?.[0] ?? 0;
    };

    const safeGetPourcentageComptes = () => {
        return comptesData?.pourcentage_communes_avec_comptes?.[0] ?? 0;
    };

    const safeGetTotalCommunesComptes = () => {
        return comptesData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesAvecComptes = () => {
        return comptesData?.communes_avec_comptes?.[0] ?? 0;
    };

    const safeGetPourcentageMaitriseOuvrage = () => {
        return maitriseOuvrageData?.pourcentage_communes_avec_maitrise_ouvrage_effective?.[0] ?? 0;
    };

    const safeGetTotalCommunesMaitriseOuvrage = () => {
        return maitriseOuvrageData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesAvecMaitriseOuvrage = () => {
        return maitriseOuvrageData?.communes_avec_mo_effective?.[0] ?? 0;
    };

    const safeGetPourcentageEfficacitePrevision = () => {
        return efficacitePrevisionData?.pourcentage_communes_efficacite_prevision?.[0] ?? 0;
    };

    const safeGetTotalCommunesEfficacitePrevision = () => {
        return efficacitePrevisionData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesEfficaces = () => {
        return efficacitePrevisionData?.communes_efficaces?.[0] ?? 0;
    };

    const safeGetPourcentageStabiliteFinanciere = () => {
        return stabiliteFinanciereData?.pourcentage_communes_stabilite_financiere?.[0] ?? 0;
    };

    const safeGetTotalCommunesStabiliteFinanciere = () => {
        return stabiliteFinanciereData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesStables = () => {
        return stabiliteFinanciereData?.communes_stables?.[0] ?? 0;
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
                        {noDataMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* Cartes d'indicateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* planification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes ayant au moins un outil de planification à jour</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingPlanification ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataPlanification ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentagePlanification()).text}`}>
                                        {safeGetPourcentagePlanification()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentagePlanification()).bg} ${getPercentageColor(safeGetPourcentagePlanification()).text} ${getPercentageColor(safeGetPourcentagePlanification()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentagePlanification())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes disposent d&#39;un plan de développement communal
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec planification: {safeGetCommunesAvecPlanification()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesPlanification()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Comptes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes produisant des comptes administratifs conformes aux normes
                            comptables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingComptes ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataComptes ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageComptes()).text}`}>
                                        {safeGetPourcentageComptes()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageComptes()).bg} ${getPercentageColor(safeGetPourcentageComptes()).text} ${getPercentageColor(safeGetPourcentageComptes()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageComptes())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes présentent leurs comptes administratifs et de gestion
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec comptes: {safeGetCommunesAvecComptes()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesComptes()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Maîtrise d'ouvrage */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes assurant la maîtrise d&#39;ouvrage totale des compétences
                            transférées</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMaitriseOuvrage ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataMaitriseOuvrage ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageMaitriseOuvrage()).text}`}>
                                        {safeGetPourcentageMaitriseOuvrage()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageMaitriseOuvrage()).bg} ${getPercentageColor(safeGetPourcentageMaitriseOuvrage()).text} ${getPercentageColor(safeGetPourcentageMaitriseOuvrage()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageMaitriseOuvrage())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont une maîtrise d&#39;ouvrage effective
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec MO effective: {safeGetCommunesAvecMaitriseOuvrage()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesMaitriseOuvrage()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Efficacité de prévision */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de communes ayant un taux d&#39;efficacité dans la prévision budgétaire
                            supérieur ou égal à 80 %</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingEfficacitePrevision ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataEfficacitePrevision ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageEfficacitePrevision()).text}`}>
                                        {safeGetPourcentageEfficacitePrevision()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageEfficacitePrevision()).bg} ${getPercentageColor(safeGetPourcentageEfficacitePrevision()).text} ${getPercentageColor(safeGetPourcentageEfficacitePrevision()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageEfficacitePrevision())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont une bonne efficacité de prévision budgétaire
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes efficaces: {safeGetCommunesEfficaces()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesEfficacitePrevision()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Stabilité financière */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de communes ayant un taux de stabilité financière supérieur ou égal à 100
                            %</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingStabiliteFinanciere ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataStabiliteFinanciere ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageStabiliteFinanciere()).text}`}>
                                        {safeGetPourcentageStabiliteFinanciere()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageStabiliteFinanciere()).bg} ${getPercentageColor(safeGetPourcentageStabiliteFinanciere()).text} ${getPercentageColor(safeGetPourcentageStabiliteFinanciere()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageStabiliteFinanciere())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes présentent une stabilité financière
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes stables: {safeGetCommunesStables()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesStabiliteFinanciere()}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Légende des couleurs */}
            <Card>
                <CardHeader>
                    <CardTitle>Analyse des performances de planification et comptabilité</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
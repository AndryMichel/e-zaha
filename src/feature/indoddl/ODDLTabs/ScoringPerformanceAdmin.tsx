'use client'

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {
    useGetPourcentageCommunesScoringCgfBplus,
    useGetPourcentageCommunesScoringEcBplus,
    useGetPourcentageCommunesScoringGrhBplus,
    useGetPourcentageCommunesScoringMocBplus,
    useGetPourcentageCommunesScoringMrBplus
} from "@/services/api/oddl/indic-scoring-oddl.api";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Info} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {getPercentageColor, getPerformanceLevel} from "@/lib/color-number";

export function ScoringPerformanceAdmin() {
    // État pour l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        // Par défaut, on utilise l'année courante
        return new Date().getFullYear();
    });

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Hooks pour récupérer les données de l'API
    const {data: mocData, isLoading: isLoadingMoc, isError: isErrorMoc} =
        useGetPourcentageCommunesScoringMocBplus({annee: selectedYear});

    const {data: mrData, isLoading: isLoadingMr, isError: isErrorMr} =
        useGetPourcentageCommunesScoringMrBplus({annee: selectedYear});

    const {data: cgfData, isLoading: isLoadingCgf, isError: isErrorCgf} =
        useGetPourcentageCommunesScoringCgfBplus({annee: selectedYear});

    const {data: ecData, isLoading: isLoadingEc, isError: isErrorEc} =
        useGetPourcentageCommunesScoringEcBplus({annee: selectedYear});

    const {data: grhData, isLoading: isLoadingGrh, isError: isErrorGrh} =
        useGetPourcentageCommunesScoringGrhBplus({annee: selectedYear});

    // Vérification si des données sont disponibles
    const hasNoDataMoc = mocData && !mocData.pourcentage_communes_moc_bplus;
    const hasNoDataMr = mrData && !mrData.pourcentage_communes_mr_bplus;
    const hasNoDataCgf = cgfData && !cgfData.pourcentage_communes_cgf_bplus;
    const hasNoDataEc = ecData && !ecData.pourcentage_communes_ec_bplus;
    const hasNoDataGrh = grhData && !grhData.pourcentage_communes_grh_bplus;

    // Vérification si un message d'absence de données est disponible
    const noDataMessage =
        (mocData && mocData.message) ||
        (mrData && mrData.message) ||
        (cgfData && cgfData.message) ||
        (ecData && ecData.message) ||
        (grhData && grhData.message) ||
        "Aucune donnée disponible pour l'année sélectionnée";

    // Vérification globale des données manquantes
    const hasNoData = hasNoDataMoc || hasNoDataMr || hasNoDataCgf || hasNoDataEc || hasNoDataGrh;

    // État de chargement global
    const isLoading = isLoadingMoc || isLoadingMr || isLoadingCgf || isLoadingEc || isLoadingGrh;

    // État d'erreur global
    const hasError = isErrorMoc || isErrorMr || isErrorCgf || isErrorEc || isErrorGrh;

    // Helper functions pour accéder aux données en toute sécurité
    const safeGetPourcentageMoc = () => {
        return mocData?.pourcentage_communes_moc_bplus?.[0] ?? 0;
    };

    const safeGetTotalCommunesMoc = () => {
        return mocData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesMocBplus = () => {
        return mocData?.communes_moc_bplus?.[0] ?? 0;
    };

    const safeGetPourcentageMr = () => {
        return mrData?.pourcentage_communes_mr_bplus?.[0] ?? 0;
    };

    const safeGetTotalCommunesMr = () => {
        return mrData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesMrBplus = () => {
        return mrData?.communes_mr_bplus?.[0] ?? 0;
    };

    const safeGetPourcentageCgf = () => {
        return cgfData?.pourcentage_communes_cgf_bplus?.[0] ?? 0;
    };

    const safeGetTotalCommunesCgf = () => {
        return cgfData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesCgfBplus = () => {
        return cgfData?.communes_cgf_bplus?.[0] ?? 0;
    };

    const safeGetPourcentageEc = () => {
        return ecData?.pourcentage_communes_ec_bplus?.[0] ?? 0;
    };

    const safeGetTotalCommunesEc = () => {
        return ecData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesEcBplus = () => {
        return ecData?.communes_ec_bplus?.[0] ?? 0;
    };

    const safeGetPourcentageGrh = () => {
        return grhData?.pourcentage_communes_grh_bplus?.[0] ?? 0;
    };

    const safeGetTotalCommunesGrh = () => {
        return grhData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesGrhBplus = () => {
        return grhData?.communes_grh_bplus?.[0] ?? 0;
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

            {/* Cartes d'indicateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* MOC B+ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes notée B+ au Scoring Maîtrise d&#39;Ouvrage communale
                            (SMOC)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMoc ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataMoc ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageMoc()).text}`}>
                                        {safeGetPourcentageMoc()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageMoc()).bg} ${getPercentageColor(safeGetPourcentageMoc()).text} ${getPercentageColor(safeGetPourcentageMoc()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageMoc())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont un score MOC de B+ ou supérieur
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec SMOC B+: {safeGetCommunesMocBplus()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesMoc()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>SMO: Mobilisation des Ressources Communales</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* MR B+ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes notée B+ au scoring Mobilisation des ressources communales
                            (SMR)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMr ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataMr ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageMr()).text}`}>
                                        {safeGetPourcentageMr()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageMr()).bg} ${getPercentageColor(safeGetPourcentageMr()).text} ${getPercentageColor(safeGetPourcentageMr()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageMr())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont un score MR de B+ ou supérieur
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec SMR B+: {safeGetCommunesMrBplus()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesMr()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>SMRL: Management des Ressources</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* CGF B+ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes notées B+ au Scoring Comptabilité Gestion Financière
                            (SCGF)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingCgf ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataCgf ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageCgf()).text}`}>
                                        {safeGetPourcentageCgf()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageCgf()).bg} ${getPercentageColor(safeGetPourcentageCgf()).text} ${getPercentageColor(safeGetPourcentageCgf()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageCgf())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont un score SCGF de B+ ou supérieur
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec SCGF B+: {safeGetCommunesCgfBplus()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesCgf()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>SCGF: Contrôle et Gestion Financière</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* EC B+ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes notée B+ au Scoring Etat civil (SEC)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingEc ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataEc ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageEc()).text}`}>
                                        {safeGetPourcentageEc()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageEc()).bg} ${getPercentageColor(safeGetPourcentageEc()).text} ${getPercentageColor(safeGetPourcentageEc()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageEc())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont un score SEC de B+ ou supérieur
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec SEC B+: {safeGetCommunesEcBplus()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesEc()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>SEC: État Civil</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* GRH B+ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de Communes notée B+ au Scoring Gestion des ressources humaines
                            (SGRH)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingGrh ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataGrh ? (
                            <p className="text-sm text-gray-500">Données non disponibles</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageGrh()).text}`}>
                                        {safeGetPourcentageGrh()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageGrh()).bg} ${getPercentageColor(safeGetPourcentageGrh()).text} ${getPercentageColor(safeGetPourcentageGrh()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageGrh())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont un score SGRH de B+ ou supérieur
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec SGRH B+: {safeGetCommunesGrhBplus()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesGrh()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>GRH: Gestion des Ressources Humaines</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Légende des couleurs */}
            <Card>
                <CardHeader>
                    <CardTitle>Légende des niveaux de performance</CardTitle>
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
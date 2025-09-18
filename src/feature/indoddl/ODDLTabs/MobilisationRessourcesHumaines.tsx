'use client'

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {
    useGetPourcentageCommunesEfficienceRh,
    useGetPourcentageCommunesMobilisationSecteurPrive
} from "@/services/api/oddl/indic-mobil-oddl.api";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Info} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {getPercentageColor, getPerformanceLevel} from "@/lib/color-number";

export function MobilisationRessourcesHumaines() {
    // État pour l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        // Par défaut, on utilise l'année courante
        return new Date().getFullYear();
    });

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Hooks pour récupérer les données de l'API
    const {data: mobilisationData, isLoading: isLoadingMobilisation, isError: isErrorMobilisation} =
        useGetPourcentageCommunesMobilisationSecteurPrive({annee: selectedYear});

    const {data: efficienceData, isLoading: isLoadingEfficience, isError: isErrorEfficience} =
        useGetPourcentageCommunesEfficienceRh({annee: selectedYear});

    // Vérification si des données sont disponibles
    const hasNoDataMobilisation = mobilisationData && !mobilisationData.pourcentage_communes_mobilisation_secteur_prive;
    const hasNoDataEfficience = efficienceData && !efficienceData.pourcentage_communes_efficience_rh_sup_50;

    // Vérification globale des données manquantes
    const hasNoData = hasNoDataMobilisation || hasNoDataEfficience;

    // État de chargement global
    const isLoading = isLoadingMobilisation || isLoadingEfficience;

    // État d'erreur global
    const hasError = isErrorMobilisation || isErrorEfficience;

    // Helper functions pour accéder aux données en toute sécurité - Mobilisation
    const safeGetPourcentageMobilisation = () => {
        return mobilisationData?.pourcentage_communes_mobilisation_secteur_prive?.[0] ?? 0;
    };

    const safeGetTotalCommunesMobilisation = () => {
        return mobilisationData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesMobilisationSuffisante = () => {
        return mobilisationData?.communes_mobilisation_suffisante?.[0] ?? 0;
    };

    // Helper functions pour accéder aux données en toute sécurité - Efficience RH
    const safeGetPourcentageEfficience = () => {
        return efficienceData?.pourcentage_communes_efficience_rh_sup_50?.[0] ?? 0;
    };

    const safeGetTotalCommunesEfficience = () => {
        return efficienceData?.total_communes?.[0] ?? 0;
    };

    const safeGetCommunesEfficienceRhSup50 = () => {
        return efficienceData?.communes_efficience_rh_sup_50?.[0] ?? 0;
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
                        Aucune donnée disponible pour l&#39;année sélectionnée ({selectedYear})
                    </AlertDescription>
                </Alert>
            )}

            {/* Cartes d'indicateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mobilisation du secteur privé et des citoyens */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de communes ayant un Poids des Recettes Fiscales sur les Recettes Propres
                            supérieur ou égal à 80 %</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMobilisation ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataMobilisation ? (
                            <p className="text-sm text-gray-500">Aucune donnée de mobilisation du secteur privé
                                disponible pour l&#39;année {selectedYear}</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageMobilisation()).text}`}>
                                        {safeGetPourcentageMobilisation()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageMobilisation()).bg} ${getPercentageColor(safeGetPourcentageMobilisation()).text} ${getPercentageColor(safeGetPourcentageMobilisation()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageMobilisation())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes mobilisent suffisamment le secteur privé et les citoyens
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec mobilisation
                                        suffisante: {safeGetCommunesMobilisationSuffisante()}</p>
                                    <p>• Total des communes: {safeGetTotalCommunesMobilisation()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>communes ayant un taux de mobilisation auprès du secteur privé et des citoyens
                                        supérieur ou égal à 80%</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Efficience des ressources humaines */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pourcentage de communes ayant un ratio d&#39;efficience des RH supérieur ou égal à
                            50%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingEfficience ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : hasNoDataEfficience ? (
                            <p className="text-sm text-gray-500">Aucune donnée d&#39;efficience des ressources humaines
                                disponible pour l&#39;année {selectedYear}</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageEfficience()).text}`}>
                                        {safeGetPourcentageEfficience()}%
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageEfficience()).bg} ${getPercentageColor(safeGetPourcentageEfficience()).text} ${getPercentageColor(safeGetPourcentageEfficience()).border} border`}>
                                        {getPerformanceLevel(safeGetPourcentageEfficience())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    des communes ont une efficience des RH ≥ 50%
                                </p>
                                <div className="mt-4 text-sm">
                                    <p>• Communes avec efficience RH ≥ 50%: {safeGetCommunesEfficienceRhSup50()}</p>
                                    <p>• Total des communes évaluées: {safeGetTotalCommunesEfficience()}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    <p>Efficience RH = (Charges personnel / Dépenses fonctionnement) × 100. Un ratio ≥
                                        50% indique une forte allocation aux ressources humaines</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Analyse et interprétation */}
            <Card>
                <CardHeader>
                    <CardTitle>Analyse des performances</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Interprétation Mobilisation */}

                        {/* Interprétation Efficience RH */}
                        <div>
                            <h4 className="font-semibold mb-2">Efficience Ressources Humaines</h4>
                            <div className="space-y-2 text-sm">
                                {!hasNoDataEfficience && (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-2xl font-bold ${getPercentageColor(safeGetPourcentageEfficience()).text}`}>
                                                {safeGetPourcentageEfficience()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageEfficience()).bg} ${getPercentageColor(safeGetPourcentageEfficience()).text} ${getPercentageColor(safeGetPourcentageEfficience()).border} border`}>
                        {getPerformanceLevel(safeGetPourcentageEfficience())}
                    </span>
                                        </div>
                                        <p className="text-gray-600">
                                            des communes ont une efficience RH ≥ 50%.
                                        </p>
                                        {safeGetPourcentageEfficience() >= 75 && (
                                            <p className="text-green-600">✓ Bonne maîtrise des coûts de personnel</p>
                                        )}
                                        {safeGetPourcentageEfficience() >= 50 && safeGetPourcentageEfficience() < 75 && (
                                            <p className="text-yellow-600">⚠ Équilibre correct mais optimisations
                                                possibles</p>
                                        )}
                                        {safeGetPourcentageEfficience() < 50 && (
                                            <p className="text-red-600">⚠ Faible efficience, révision de la structure RH
                                                nécessaire</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Légende des couleurs */}
            <Card>
                <CardHeader>
                    <CardTitle>Échelle de performance</CardTitle>
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
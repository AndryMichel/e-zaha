'use client'

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Info} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {
    useGetNiveauRealisationRessourcesCommune,
    useGetPourcentageCommunesMobilisationRessources,
    useGetTauxExecutionDepensesObligatoires,
    useGetTauxRealisationBudgetFonctionnement,
    useGetTauxRealisationRecettesFiscales,
} from "@/services/api/oddl/indic-perf-financiere-oddl.api";
import {getPercentageColor, getPerformanceLevel} from "@/lib/color-number";

export function PerformanceFinanciereBudgetaire() {
    // État pour l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        // Par défaut, on utilise l'année courante
        return new Date().getFullYear();
    });

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Hooks pour récupérer les données de l'API
    const {data: recettesFiscalesData, isLoading: isLoadingRecettesFiscales, isError: isErrorRecettesFiscales} =
        useGetTauxRealisationRecettesFiscales({annee: selectedYear});

    // const {
    //     data: recettesNonFiscalesData,
    //     isLoading: isLoadingRecettesNonFiscales,
    //     isError: isErrorRecettesNonFiscales
    // } =
    //     useGetTauxRealisationRecettesNonFiscales({annee: selectedYear});

    const {
        data: budgetFonctionnementData,
        isLoading: isLoadingBudgetFonctionnement,
        isError: isErrorBudgetFonctionnement
    } =
        useGetTauxRealisationBudgetFonctionnement({annee: selectedYear});

    const {
        data: depensesObligatoiresData,
        isLoading: isLoadingDepensesObligatoires,
        isError: isErrorDepensesObligatoires
    } =
        useGetTauxExecutionDepensesObligatoires({annee: selectedYear});

    // const {
    //     data: programmationBudgetaireData,
    //     isLoading: isLoadingProgrammationBudgetaire,
    //     isError: isErrorProgrammationBudgetaire
    // } =
    //     useGetTauxProgrammationBudgetaire({annee: selectedYear});

    // const {
    //     data: communesProgrammationData,
    //     isLoading: isLoadingCommunesProgrammation,
    //     isError: isErrorCommunesProgrammation
    // } =
    //     useGetPourcentageCommunesProgrammationBudgetaire({annee: selectedYear});

    const {data: ressourcesCommuneData, isLoading: isLoadingRessourcesCommune, isError: isErrorRessourcesCommune} =
        useGetNiveauRealisationRessourcesCommune({annee: selectedYear});

    const {
        data: mobilisationRessourcesData,
        isLoading: isLoadingMobilisationRessources,
        isError: isErrorMobilisationRessources
    } =
        useGetPourcentageCommunesMobilisationRessources({annee: selectedYear});

    // Vérification si des données sont disponibles
    const hasNoDataRecettesFiscales = recettesFiscalesData && !recettesFiscalesData.taux_moyen_realisation_recettes_fiscales;
    // const hasNoDataRecettesNonFiscales = recettesNonFiscalesData && !recettesNonFiscalesData.taux_moyen_realisation_recettes_non_fiscales;
    const hasNoDataBudgetFonctionnement = budgetFonctionnementData && !budgetFonctionnementData.taux_moyen_realisation_budget_fonctionnement;
    const hasNoDataDepensesObligatoires = depensesObligatoiresData && !depensesObligatoiresData.taux_moyen_execution_depenses_obligatoires;
    // const hasNoDataProgrammationBudgetaire = programmationBudgetaireData && !programmationBudgetaireData.taux_programmation_budgetaire;
    // const hasNoDataCommunesProgrammation = communesProgrammationData && !communesProgrammationData.pourcentage_communes_prog_budget_inf_100;
    const hasNoDataRessourcesCommune = ressourcesCommuneData && !ressourcesCommuneData.niveau_realisation_pourcentage;
    const hasNoDataMobilisationRessources = mobilisationRessourcesData && !mobilisationRessourcesData.pourcentage_communes_mobilisation_ressources;

    // Vérification globale des données manquantes
    const hasNoData = hasNoDataRecettesFiscales ||
        // hasNoDataRecettesNonFiscales ||
        hasNoDataBudgetFonctionnement ||
        hasNoDataDepensesObligatoires ||
        // hasNoDataProgrammationBudgetaire || hasNoDataCommunesProgrammation ||
        hasNoDataRessourcesCommune || hasNoDataMobilisationRessources;

    // Vérification si un message d'absence de données est disponible
    const noDataMessage = `Aucune donnée disponible pour l'année ${selectedYear}`;

    // État de chargement global
    const isLoading = isLoadingRecettesFiscales ||
        // isLoadingRecettesNonFiscales ||
        isLoadingBudgetFonctionnement ||
        isLoadingDepensesObligatoires ||
        // isLoadingProgrammationBudgetaire || isLoadingCommunesProgrammation ||
        isLoadingRessourcesCommune || isLoadingMobilisationRessources;

    // État d'erreur global
    const hasError = isErrorRecettesFiscales ||
        // isErrorRecettesNonFiscales ||
        isErrorBudgetFonctionnement ||
        isErrorDepensesObligatoires ||
        // isErrorProgrammationBudgetaire || isErrorCommunesProgrammation ||
        isErrorRessourcesCommune || isErrorMobilisationRessources;

    // Helper functions pour accéder aux données en toute sécurité
    const safeGetTauxRealisationRecettesFiscales = () => {
        return recettesFiscalesData?.taux_moyen_realisation_recettes_fiscales?.[0] ?? 0;
    };

    // const safeGetTauxRealisationRecettesNonFiscales = () => {
    //     return recettesNonFiscalesData?.taux_moyen_realisation_recettes_non_fiscales?.[0] ?? 0;
    // };

    const safeGetTauxRealisationBudgetFonctionnement = () => {
        return budgetFonctionnementData?.taux_moyen_realisation_budget_fonctionnement?.[0] ?? 0;
    };

    const safeGetSeuilReference = () => {
        return budgetFonctionnementData?.seuil_reference?.[0] ?? 0;
    };

    const safeGetPourcentageCommunesConformes = () => {
        return budgetFonctionnementData?.pourcentage_communes_conformes?.[0] ?? 0;
    };

    const safeGetCommunesAuDessusSeuil = () => {
        return budgetFonctionnementData?.communes_au_dessus_seuil?.[0] ?? 0;
    };

    const safeGetTauxExecutionDepensesObligatoires = () => {
        return depensesObligatoiresData?.taux_moyen_execution_depenses_obligatoires?.[0] ?? 0;
    };

    // const safeGetTauxProgrammationBudgetaire = () => {
    //     return programmationBudgetaireData?.taux_programmation_budgetaire?.[0] ?? 0;
    // };

    // const safeGetTotalRealisationDepenses = () => {
    //     return programmationBudgetaireData?.total_realisation_depenses?.[0] ?? 0;
    // };

    // const safeGetTotalPrevisionDepenses = () => {
    //     return programmationBudgetaireData?.total_prevision_depenses?.[0] ?? 0;
    // };

    // const safeGetPourcentageCommunesProgBudgetInf100 = () => {
    //     return communesProgrammationData?.pourcentage_communes_prog_budget_inf_100?.[0] ?? 0;
    // };

    // const safeGetCommunesProgBudgetInf100 = () => {
    //     return communesProgrammationData?.communes_prog_budget_inf_100?.[0] ?? 0;
    // };

    const safeGetNiveauRealisationPourcentage = () => {
        return ressourcesCommuneData?.niveau_realisation_pourcentage?.[0] ?? 0;
    };

    const safeGetTotalRealisation = () => {
        return ressourcesCommuneData?.total_realisation?.[0] ?? 0;
    };

    const safeGetTotalPrevision = () => {
        return ressourcesCommuneData?.total_prevision?.[0] ?? 0;
    };

    const safeGetPourcentageCommunesMobilisationRessources = () => {
        return mobilisationRessourcesData?.pourcentage_communes_mobilisation_ressources?.[0] ?? 0;
    };

    const safeGetCommunesMobilisationSuffisante = () => {
        return mobilisationRessourcesData?.communes_mobilisation_suffisante?.[0] ?? 0;
    };

    const safeGetTotalCommunes = () => {
        // Utiliser une des valeurs disponibles pour le total des communes
        return budgetFonctionnementData?.total_communes?.[0] ||
            depensesObligatoiresData?.total_communes?.[0] ||
            // communesProgrammationData?.total_communes?.[0] ||
            mobilisationRessourcesData?.total_communes?.[0] || 0;
    };

    // Formatage des montants en Ariary (MGA)
    const formatMontant = (montant: number) => {
        return new Intl.NumberFormat('fr-MG', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
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

            {/* Contenu principal - affiché uniquement s'il y a des données */}
            {!isLoading && !hasError && !hasNoData && (
                <>
                    {/* Cartes d'indicateurs - Première ligne */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Taux de réalisation des recettes fiscales */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Taux moyen de réalisation des recettes fiscales par rapport à la recette
                                    propre</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingRecettesFiscales ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : hasNoDataRecettesFiscales ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-3xl font-bold ${getPercentageColor(safeGetTauxRealisationRecettesFiscales()).text}`}>
                                                {safeGetTauxRealisationRecettesFiscales()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetTauxRealisationRecettesFiscales()).bg} ${getPercentageColor(safeGetTauxRealisationRecettesFiscales()).text} ${getPercentageColor(safeGetTauxRealisationRecettesFiscales()).border} border`}>
                                                {getPerformanceLevel(safeGetTauxRealisationRecettesFiscales())}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Taux moyen de réalisation des recettes fiscales
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Taux de réalisation des recettes non fiscales - COMMENTÉ */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Réalisation des Recettes Non Fiscales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingRecettesNonFiscales ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : hasNoDataRecettesNonFiscales ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-3xl font-bold ${getPercentageColor(safeGetTauxRealisationRecettesNonFiscales()).text}`}>
                                                {safeGetTauxRealisationRecettesNonFiscales()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetTauxRealisationRecettesNonFiscales()).bg} ${getPercentageColor(safeGetTauxRealisationRecettesNonFiscales()).text} ${getPercentageColor(safeGetTauxRealisationRecettesNonFiscales()).border} border`}>
                                                {getPerformanceLevel(safeGetTauxRealisationRecettesNonFiscales())}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Taux moyen de réalisation des recettes non fiscales
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card> */}

                        {/* Taux de réalisation du budget de fonctionnement */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Taux de réalisation de dépense de fonctionnement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingBudgetFonctionnement ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : hasNoDataBudgetFonctionnement ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-3xl font-bold ${getPercentageColor(safeGetTauxRealisationBudgetFonctionnement()).text}`}>
                                                {safeGetTauxRealisationBudgetFonctionnement()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetTauxRealisationBudgetFonctionnement()).bg} ${getPercentageColor(safeGetTauxRealisationBudgetFonctionnement()).text} ${getPercentageColor(safeGetTauxRealisationBudgetFonctionnement()).border} border`}>
                                                {getPerformanceLevel(safeGetTauxRealisationBudgetFonctionnement())}
                                            </span>
                                        </div>
                                        <div className="mt-4 text-sm">
                                            <p>• Seuil de référence: {safeGetSeuilReference()}%</p>
                                            <p>• Communes au-dessus du seuil: {safeGetCommunesAuDessusSeuil()}</p>
                                            <p>• Pourcentage de communes
                                                conformes: {safeGetPourcentageCommunesConformes()}%</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cartes d'indicateurs - Deuxième ligne */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Taux d'exécution des dépenses obligatoires */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Degré d&#39;autonomie financière de la CTD</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingDepensesObligatoires ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : hasNoDataDepensesObligatoires ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-3xl font-bold ${getPercentageColor(safeGetTauxExecutionDepensesObligatoires()).text}`}>
                                                {safeGetTauxExecutionDepensesObligatoires()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetTauxExecutionDepensesObligatoires()).bg} ${getPercentageColor(safeGetTauxExecutionDepensesObligatoires()).text} ${getPercentageColor(safeGetTauxExecutionDepensesObligatoires()).border} border`}>
                                                {getPerformanceLevel(safeGetTauxExecutionDepensesObligatoires())}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Taux de programmation budgétaire - COMMENTÉ */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Taux de programmation budgétaire</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingProgrammationBudgetaire ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : hasNoDataProgrammationBudgetaire ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-3xl font-bold ${getPercentageColor(safeGetTauxProgrammationBudgetaire()).text}`}>
                                                {safeGetTauxProgrammationBudgetaire()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetTauxProgrammationBudgetaire()).bg} ${getPercentageColor(safeGetTauxProgrammationBudgetaire()).text} ${getPercentageColor(safeGetTauxProgrammationBudgetaire()).border} border`}>
                                                {getPerformanceLevel(safeGetTauxProgrammationBudgetaire())}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Taux de programmation budgétaire
                                        </p>
                                        <div className="mt-4 text-sm">
                                            <p>• Réalisation: {formatMontant(safeGetTotalRealisationDepenses())}</p>
                                            <p>• Prévision: {formatMontant(safeGetTotalPrevisionDepenses())}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card> */}

                        {/* Pourcentage de communes avec programmation budgétaire - COMMENTÉ */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Communes avec Programmation Budgétaire</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingCommunesProgrammation ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : hasNoDataCommunesProgrammation ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageCommunesProgBudgetInf100()).text}`}>
                                                {safeGetPourcentageCommunesProgBudgetInf100()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageCommunesProgBudgetInf100()).bg} ${getPercentageColor(safeGetPourcentageCommunesProgBudgetInf100()).text} ${getPercentageColor(safeGetPourcentageCommunesProgBudgetInf100()).border} border`}>
                                                {getPerformanceLevel(safeGetPourcentageCommunesProgBudgetInf100())}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            des communes ont une programmation budgétaire &lt; 100%
                                        </p>
                                        <div className="mt-4 text-sm">
                                            <p>• Communes concernées: {safeGetCommunesProgBudgetInf100()}</p>
                                            <p>• Total des communes: {safeGetTotalCommunes()}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card> */}
                    </div>

                    {/* Cartes d'indicateurs - Troisième ligne */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Niveau de réalisation des ressources de la commune */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Niveau de réalisation de recette de fonctionnement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingRessourcesCommune ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : hasNoDataRessourcesCommune ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className={`text-3xl font-bold ${getPercentageColor(safeGetNiveauRealisationPourcentage()).text}`}>
                                                {safeGetNiveauRealisationPourcentage()}%
                                            </p>
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetNiveauRealisationPourcentage()).bg} ${getPercentageColor(safeGetNiveauRealisationPourcentage()).text} ${getPercentageColor(safeGetNiveauRealisationPourcentage()).border} border`}>
                                                {getPerformanceLevel(safeGetNiveauRealisationPourcentage())}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Niveau de réalisation des ressources communales
                                        </p>
                                        <div className="mt-4 text-sm">
                                            <p>• Réalisation: {formatMontant(safeGetTotalRealisation())}</p>
                                            <p>• Prévision: {formatMontant(safeGetTotalPrevision())}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pourcentage de communes avec mobilisation de ressources */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pourcentage de communes ayant un taux de mobilisation des ressources
                                    supérieur ou égal à 80 %</CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                {isLoadingMobilisationRessources ? (
                                    <Skeleton className="h-48 w-full"/>
                                ) : hasNoDataMobilisationRessources ? (
                                    <p className="text-sm text-gray-500">Données non disponibles</p>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className={`text-3xl font-bold ${getPercentageColor(safeGetPourcentageCommunesMobilisationRessources()).text}`}>
                                                        {safeGetPourcentageCommunesMobilisationRessources()}%
                                                    </p>
                                                    <span
                                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageCommunesMobilisationRessources()).bg} ${getPercentageColor(safeGetPourcentageCommunesMobilisationRessources()).text} ${getPercentageColor(safeGetPourcentageCommunesMobilisationRessources()).border} border`}>
                                                        {getPerformanceLevel(safeGetPourcentageCommunesMobilisationRessources())}
                                                    </span>
                                                </div>
                                                <div className="mt-4 text-sm">
                                                    <p>• Communes avec mobilisation
                                                        suffisante: {safeGetCommunesMobilisationSuffisante()}</p>
                                                    <p>• Total des communes: {safeGetTotalCommunes()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Légende des couleurs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Analyse des performances financières et budgétaires</CardTitle>
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
                </>
            )}
        </div>
    );
}
'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {
    useGetPourcentageRegionsAccesPlateforme,
    useGetPourcentageRegionsGestionRisques,
    useGetPourcentageRegionsPrdAJour,
    useGetPourcentageRegionsPresentationBudget,
    useGetPourcentageRegionsSratClimat,
    useGetPourcentageRegionsSrcOperationnelle
} from "@/services/api/region/indic-gouv-region.api";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Search} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {Cell, Pie, PieChart, ResponsiveContainer} from 'recharts';
import {useSession} from "next-auth/react";
import {Input} from "@/components/ui/atomes/input";
import {regionsData} from "@/lib/region";
import {
    GetIndicateurRegionParams,
    RegionAccesPlateformeResponse,
    RegionGestionRisquesResponse,
    RegionPrdAJourResponse,
    RegionPresentationBudgetResponse,
    RegionSratClimatResponse,
    RegionSrcOperationnelleResponse
} from "@/services/types/indic-region.type";

export function GouvernanceRegionale() {
    const {data: session} = useSession();
    const userRole = session?.user?.role;
    const userRegionCode = session?.user?.location?.region_code as string | undefined;

    // États pour les filtres
    const [selectedYear, setSelectedYear] = useState(() => {
        return new Date().getFullYear();
    });

    const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Paramètres pour l'API avec gestion automatique selon le rôle
    const [apiParams, setApiParams] = useState<GetIndicateurRegionParams>(() => {
        const baseParams: GetIndicateurRegionParams = {annee: selectedYear};

        // Triage automatique selon le rôle
        if (userRole === 'regional' && userRegionCode) {
            baseParams.region_code = userRegionCode;
        }
        // Les rôles ODDL et administrateur voient toutes les régions (pas de region_code)

        return baseParams;
    });

    // Effet pour définir les filtres par défaut en fonction du rôle de l'utilisateur
    useEffect(() => {
        const newParams: GetIndicateurRegionParams = {annee: selectedYear};

        if (userRole === 'regional' && userRegionCode) {
            setSelectedRegion(userRegionCode);
            newParams.region_code = userRegionCode;
        }
        // Pour ODDL et administrateur, on laisse sans restriction régionale

        setApiParams(newParams);
    }, [userRole, userRegionCode, selectedYear]);

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Fonction pour obtenir les régions filtrées selon le rôle et la recherche
    const getFilteredRegions = useCallback(() => {
        let availableRegions = regionsData;

        // Si l'utilisateur est régional, il ne voit que sa région
        if (userRole === 'regional' && userRegionCode) {
            availableRegions = regionsData.filter(region => region.code === userRegionCode);
        }

        // Filtrer selon la recherche
        if (searchQuery && searchQuery.trim() !== '') {
            availableRegions = availableRegions.filter(region =>
                region.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return availableRegions;
    }, [userRole, userRegionCode, searchQuery]);

    // Hooks pour récupérer les données de l'API
    const {data: gestionRisquesData, isLoading: isLoadingGestionRisques, isError: isErrorGestionRisques} =
        useGetPourcentageRegionsGestionRisques(apiParams);

    const {data: srcOperationnelleData, isLoading: isLoadingSrcOperationnelle, isError: isErrorSrcOperationnelle} =
        useGetPourcentageRegionsSrcOperationnelle(apiParams);

    const {data: sratClimatData, isLoading: isLoadingSratClimat, isError: isErrorSratClimat} =
        useGetPourcentageRegionsSratClimat(apiParams);

    const {data: prdAJourData, isLoading: isLoadingPrdAJour, isError: isErrorPrdAJour} =
        useGetPourcentageRegionsPrdAJour(apiParams);

    const {data: accesPlateformeData, isLoading: isLoadingAccesPlateforme, isError: isErrorAccesPlateforme} =
        useGetPourcentageRegionsAccesPlateforme(apiParams);

    const {data: presentationBudgetData, isLoading: isLoadingPresentationBudget, isError: isErrorPresentationBudget} =
        useGetPourcentageRegionsPresentationBudget(apiParams);

    // État de chargement global
    const isLoading = isLoadingGestionRisques || isLoadingSrcOperationnelle || isLoadingSratClimat ||
        isLoadingPrdAJour || isLoadingAccesPlateforme || isLoadingPresentationBudget;

    // État d'erreur global
    const hasError = isErrorGestionRisques || isErrorSrcOperationnelle || isErrorSratClimat ||
        isErrorPrdAJour || isErrorAccesPlateforme || isErrorPresentationBudget;

    // Interface pour les réponses avec message d'erreur
    interface ResponseWithMessage {
        message?: string[];

        [key: string]: string[] | number[] | undefined;
    }

    // Fonction pour vérifier si les données contiennent un message d'erreur
    const hasMessageError = (data: ResponseWithMessage | null): boolean => {
        return Boolean(data?.message?.[0]);
    };

    // Helper functions pour accéder aux données en toute sécurité
    const safeGetPourcentageGestionRisques = () => {
        if (hasMessageError(gestionRisquesData)) {
            return null;
        }
        return gestionRisquesData?.pourcentage_regions_avec_grc?.[0] ?? 0;
    };

    const safeGetPourcentageSrcOperationnelle = () => {
        if (hasMessageError(srcOperationnelleData)) {
            return null;
        }
        return srcOperationnelleData?.pourcentage_regions_avec_src?.[0] ?? 0;
    };

    const safeGetPourcentageSratClimat = () => {
        if (hasMessageError(sratClimatData)) {
            return null;
        }
        return sratClimatData?.pourcentage_regions_srat_climat?.[0] ?? 0;
    };

    const safeGetPourcentagePrdAJour = () => {
        if (hasMessageError(prdAJourData)) {
            return null;
        }
        return prdAJourData?.pourcentage_regions_prd_a_jour?.[0] ?? 0;
    };

    const safeGetPourcentageAccesPlateforme = () => {
        if (hasMessageError(accesPlateformeData)) {
            return null;
        }
        return accesPlateformeData?.pourcentage_regions_acces_plateforme?.[0] ?? 0;
    };

    const safeGetPourcentagePresentationBudget = () => {
        if (hasMessageError(presentationBudgetData)) {
            return null;
        }
        return presentationBudgetData?.pourcentage_regions_presentation_budget?.[0] ?? 0;
    };

    // Fonctions pour gérer les changements de filtres
    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);

        const newParams: GetIndicateurRegionParams = {annee: newYear};

        // Appliquer automatiquement les restrictions selon le rôle
        if (userRole === 'regional' && userRegionCode) {
            newParams.region_code = userRegionCode;
        } else if (selectedRegion && (userRole === 'ODDL' || userRole === 'administrateur')) {
            newParams.region_code = selectedRegion;
        }

        setApiParams(newParams);
    };

    const handleRegionChange = (regionCode: string) => {
        // Seuls les rôles ODDL et administrateur peuvent changer de région
        if (userRole !== 'ODDL' && userRole !== 'administrateur') return;

        setSelectedRegion(regionCode);
        setApiParams({annee: selectedYear, region_code: regionCode});
        setIsDropdownVisible(false);
        setSearchQuery('');
    };

    const handleClearRegionFilter = () => {
        // Seuls les rôles ODDL et administrateur peuvent effacer le filtre
        if (userRole !== 'ODDL' && userRole !== 'administrateur') return;

        setSelectedRegion(undefined);
        setApiParams({annee: selectedYear});
        setSearchQuery('');
    };

    // Fonction pour gérer le clic en dehors du dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Element;
            if (isDropdownVisible &&
                !target.closest('.region-search-container') &&
                !target.closest('.region-dropdown')) {
                setIsDropdownVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownVisible]);

    // Fonction de recherche
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Fonction pour afficher le dropdown au focus
    const handleSearchFocus = () => {
        // Seuls les rôles ODDL et administrateur peuvent utiliser la recherche
        if (userRole === 'ODDL' || userRole === 'administrateur') {
            setIsDropdownVisible(true);
        }
    };

    // Fonctions pour déterminer les permissions d'affichage
    const canSelectRegion = () => {
        return userRole === 'ODDL' || userRole === 'administrateur';
    };

    const getRegionDisplayText = () => {
        if (userRole === 'regional' && userRegionCode) {
            const regionName = regionsData.find(r => r.code === userRegionCode)?.name;
            return `Région: ${regionName || userRegionCode}`;
        } else if (selectedRegion) {
            const regionName = regionsData.find(r => r.code === selectedRegion)?.name;
            return `Région sélectionnée: ${regionName || selectedRegion}`;
        } else {
            return 'Toutes les régions';
        }
    };

    // Types pour la fonction renderIndicatorCard
    type DataType = (RegionGestionRisquesResponse['data'] & ResponseWithMessage) |
        (RegionSrcOperationnelleResponse['data'] & ResponseWithMessage) |
        (RegionSratClimatResponse['data'] & ResponseWithMessage) |
        (RegionPrdAJourResponse['data'] & ResponseWithMessage) |
        (RegionAccesPlateformeResponse['data'] & ResponseWithMessage) |
        (RegionPresentationBudgetResponse['data'] & ResponseWithMessage) |
        null;

    // Fonction pour rendre une carte d'indicateur avec gestion du message d'erreur
    const renderIndicatorCard = (
        title: string,
        data: DataType,
        percentage: number,
        totalKey: string | null,
        countKey: string,
        color: string,
        description: string
    ) => {
        const messageError = data?.message?.[0];

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm leading-tight">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center">
                        {messageError ? (
                            <div className="p-4 rounded-lg bg-gray-50 w-full text-center my-6">
                                <p className="text-gray-600 text-sm">{messageError}</p>
                            </div>
                        ) : (
                            <div className="relative h-40 w-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {name: 'Couvert', value: percentage},
                                                {name: 'Non couvert', value: 100 - percentage}
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill={color}/>
                                            <Cell fill="#EEEEEE"/>
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-lg font-bold">{percentage}%</p>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-4 text-center">
                            {description}
                        </p>

                        {!messageError && (
                            <div className="mt-4 text-sm space-y-1 text-center">
                                {totalKey && data && Array.isArray(data[totalKey]) &&
                                    <p>• Total des régions: {data[totalKey][0]}</p>}
                                {countKey && <p>• {countKey}</p>}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Rendu des filtres
    const renderFilters = () => (
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Sélecteur d'année */}
                <Select
                    value={selectedYear.toString()}
                    onValueChange={handleYearChange}
                >
                    <SelectTrigger className="w-full md:w-36">
                        <SelectValue placeholder="Année"/>
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sélecteur de région (uniquement pour ODDL et administrateur) */}
                {canSelectRegion() && (
                    <div className="w-full md:w-64 relative region-search-container">
                        <div className="relative mb-2">
                            <Search className="h-4 w-4 absolute top-2.5 left-2 text-gray-500"/>
                            <Input
                                placeholder="Rechercher une région..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                className="pl-8 w-full h-9"
                            />
                        </div>

                        {isDropdownVisible && (
                            <div
                                className="absolute z-10 w-full bg-white shadow-lg border rounded-md mt-1 max-h-60 overflow-auto region-dropdown">
                                <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 font-medium text-blue-600"
                                    onClick={handleClearRegionFilter}
                                >
                                    Toutes les régions
                                </button>

                                <div className="border-t border-gray-100 my-1"></div>

                                {getFilteredRegions().length > 0 ? (
                                    getFilteredRegions().map((region) => (
                                        <button
                                            key={region.code}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                            onClick={() => handleRegionChange(region.code)}
                                        >
                                            {region.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-3 text-gray-500">Aucune région trouvée</div>
                                )}
                            </div>
                        )}

                        <div className="p-2 border rounded-md bg-gray-50">
                            <div className="text-sm font-medium">
                                {getRegionDisplayText()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Affichage de la région pour les utilisateurs régionaux */}
                {!canSelectRegion() && userRole === 'regional' && (
                    <div className="p-2 border rounded-md bg-blue-50 border-blue-200">
                        <div className="text-sm font-medium text-blue-800">
                            {getRegionDisplayText()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // États de chargement et d'erreur
    if (isLoading) {
        return (
            <div className="space-y-6">
                {renderFilters()}
                <div className="w-full h-80">
                    <Skeleton className="h-full w-full"/>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="space-y-6">
                {renderFilters()}
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertDescription>
                        Une erreur est survenue lors du chargement des données. Veuillez réessayer.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {renderFilters()}

            {/* Affichage des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Gestion des risques et catastrophes */}
                {renderIndicatorCard(
                    "Pourcentage de régions ayant des structures de Gestion de risques et catastrophes opérationnelles (CRGRC)",
                    gestionRisquesData,
                    safeGetPourcentageGestionRisques() ?? 0,
                    "total_regions",
                    "Régions avec GRGRC: " + (gestionRisquesData?.regions_avec_grc?.[0] ?? 0),
                    "#0088FE",
                    "des régions disposent d'un système de gestion des risques"
                )}

                {/* SRC Opérationnelle */}
                {renderIndicatorCard(
                    "Pourcentage de Régions disposant une SRC opérationnelle",
                    srcOperationnelleData,
                    safeGetPourcentageSrcOperationnelle() ?? 0,
                    "total_regions",
                    "Régions avec SRC: " + (srcOperationnelleData?.regions_avec_src?.[0] ?? 0),
                    "#00C49F",
                    "des régions ont une SRC opérationnelle"
                )}

                {/* SRAT intégrant le climat */}
                {renderIndicatorCard(
                    "Pourcentage de régions disposant de SRAT",
                    sratClimatData,
                    safeGetPourcentageSratClimat() ?? 0,
                    "total_regions",
                    "Régions avec SRAT : " + (sratClimatData?.regions_srat_climat?.[0] ?? 0),
                    "#FFBB28",
                    "des régions ont un SRAT validé"
                )}

                {/* PRD à jour */}
                {renderIndicatorCard(
                    "Pourcentage de régions disposant de PRD à jour",
                    prdAJourData,
                    safeGetPourcentagePrdAJour() ?? 0,
                    "total_regions",
                    "Régions avec PRD à jour: " + (prdAJourData?.regions_prd_a_jour?.[0] ?? 0),
                    "#FF8042",
                    "Des régions disposent de PRD à jour"
                )}

                {/* Accès à la plateforme */}
                {renderIndicatorCard(
                    "Pourcentage de régions ayant accès à la plateforme intégrée web des ressources disponibles (Subventions)",
                    accesPlateformeData,
                    safeGetPourcentageAccesPlateforme() ?? 0,
                    "total_regions",
                    "Régions avec accès: " + (accesPlateformeData?.regions_acces_plateforme?.[0] ?? 0),
                    "#8884d8",
                    "des régions ont accès à la plateforme"
                )}

                {/* Présentation du budget */}
                {renderIndicatorCard(
                    "Pourcentage de régions effectuant annuellement des séances de présentation publique de leur budget et compte administratif",
                    presentationBudgetData,
                    safeGetPourcentagePresentationBudget() ?? 0,
                    "total_regions",
                    "Régions avec présentation: " + (presentationBudgetData?.regions_presentation_budget?.[0] ?? 0),
                    "#82ca9d",
                    "des régions organisent des présentations publiques du budget"
                )}
            </div>
        </div>
    );
}
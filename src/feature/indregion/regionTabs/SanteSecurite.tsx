'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Skeleton} from "@/components/ui/atomes/skeleton";
import {AlertCircle, Search} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/molécules/alert";
import {useSession} from "next-auth/react";
import {Input} from "@/components/ui/atomes/input";
import {regionsData} from "@/lib/region";
import {
    useGetRatioFsPopulation,
    useGetRatioPersonnelSantePopulation,
    useGetTauxInsecuriteAlimentaire,
    useGetTauxMalnutritionAigue
} from "@/services/api/region/indic-sante-region.api";
import {
    GetIndicateurRegionParams,
    RegionRatioFsPopulationResponse,
    RegionRatioPersonnelSanteResponse,
    RegionTauxInsecuriteAlimentaireResponse,
    RegionTauxMalnutritionResponse
} from "@/services/types/indic-region.type";

export function SanteSecurite() {
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
    const {data: fsPopulationData, isLoading: isLoadingFsPopulation, isError: isErrorFsPopulation} =
        useGetRatioFsPopulation(apiParams);

    const {data: personnelSanteData, isLoading: isLoadingPersonnelSante, isError: isErrorPersonnelSante} =
        useGetRatioPersonnelSantePopulation(apiParams);

    const {data: malnutritionData, isLoading: isLoadingMalnutrition, isError: isErrorMalnutrition} =
        useGetTauxMalnutritionAigue(apiParams);

    const {
        data: insecuriteAlimentaireData,
        isLoading: isLoadingInsecuriteAlimentaire,
        isError: isErrorInsecuriteAlimentaire
    } = useGetTauxInsecuriteAlimentaire(apiParams);

    // État de chargement global
    const isLoading = isLoadingFsPopulation || isLoadingPersonnelSante || isLoadingMalnutrition || isLoadingInsecuriteAlimentaire;

    // État d'erreur global
    const hasError = isErrorFsPopulation || isErrorPersonnelSante || isErrorMalnutrition || isErrorInsecuriteAlimentaire;

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
    const safeGetRatioFsPopulation = () => {
        if (hasMessageError(fsPopulationData)) {
            return null;
        }
        return fsPopulationData?.ratio_moyen_fs_population?.[0] ?? 0;
    };

    const safeGetRatioPersonnelSante = () => {
        if (hasMessageError(personnelSanteData)) {
            return null;
        }
        return personnelSanteData?.ratio_moyen_personnel_sante?.[0] ?? 0;
    };

    const safeGetTauxMalnutrition = () => {
        if (hasMessageError(malnutritionData)) {
            return null;
        }
        return malnutritionData?.taux_moyen_malnutrition?.[0] ?? 0;
    };

    const safeGetTauxInsecuriteAlimentaire = () => {
        if (hasMessageError(insecuriteAlimentaireData)) {
            return null;
        }
        return insecuriteAlimentaireData?.taux_moyen_insecurite_alimentaire?.[0] ?? 0;
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
    type DataType = (RegionRatioFsPopulationResponse['data'] & ResponseWithMessage) |
        (RegionRatioPersonnelSanteResponse['data'] & ResponseWithMessage) |
        (RegionTauxMalnutritionResponse['data'] & ResponseWithMessage) |
        (RegionTauxInsecuriteAlimentaireResponse['data'] & ResponseWithMessage) |
        null;

    // Fonction pour rendre une carte d'indicateur avec gestion du message d'erreur
    const renderIndicatorCard = (
        title: string,
        data: DataType,
        value: number | null,
        minValue: number | null,
        maxValue: number | null,
        color: string,
        description: string,
        format: 'ratio' | 'percentage'
    ) => {
        // Vérifier si les données contiennent un message d'erreur
        const messageError = data?.message?.[0];

        const formatValue = (val: number | null) => {
            if (val === null) return 'N/A';
            return format === 'ratio' ? val.toFixed(2) : `${val}%`;
        };

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm leading-tight">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center">
                        {messageError ? (
                            // Affichage du message d'erreur de l'API
                            <div className="p-4 rounded-lg bg-gray-50 w-full text-center my-6">
                                <p className="text-gray-600 text-sm">{messageError}</p>
                            </div>
                        ) : (
                            // Affichage des données si disponibles
                            <div className="w-full">
                                <div className="text-center mb-4">
                                    <div className="text-3xl font-bold" style={{color}}>
                                        {formatValue(value)}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 text-center">{description}</p>
                                </div>

                                {minValue !== null && maxValue !== null && (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                                            <p className="text-sm text-gray-500">Minimum</p>
                                            <p className="font-semibold">{formatValue(minValue)}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                                            <p className="text-sm text-gray-500">Maximum</p>
                                            <p className="font-semibold">{formatValue(maxValue)}</p>
                                        </div>
                                    </div>
                                )}
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

            {/* Affichage des cartes d'indicateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carte pour le ratio formations sanitaires par population */}
                {renderIndicatorCard(
                    "Ratio Formation Sanitaire fonctionnel et population",
                    fsPopulationData,
                    safeGetRatioFsPopulation(),
                    fsPopulationData?.ratio_min?.[0] ?? null,
                    fsPopulationData?.ratio_max?.[0] ?? null,
                    "#8884d8",
                    "Ratio de formations sanitaires fonctionnelles pour 10 000 habitants",
                    'ratio'
                )}

                {/* Carte pour le ratio personnel de santé par population */}
                {renderIndicatorCard(
                    "Ratio de personnel de santé et population",
                    personnelSanteData,
                    safeGetRatioPersonnelSante(),
                    personnelSanteData?.ratio_min?.[0] ?? null,
                    personnelSanteData?.ratio_max?.[0] ?? null,
                    "#82ca9d",
                    "Ratio de personnels de santé et population pour 10 000 habitants",
                    'ratio'
                )}

                {/* Carte pour le taux de malnutrition aiguë */}
                {renderIndicatorCard(
                    "Taux de Malnutrition Aiguë",
                    malnutritionData,
                    safeGetTauxMalnutrition(),
                    malnutritionData?.taux_min?.[0] ?? null,
                    malnutritionData?.taux_max?.[0] ?? null,
                    "#ffc658",
                    "de la population souffrent de la malnutrition aiguë",
                    'percentage'
                )}

                {/* Carte pour le taux d'insécurité alimentaire */}
                {renderIndicatorCard(
                    "Taux d'Insécurité Alimentaire",
                    insecuriteAlimentaireData,
                    safeGetTauxInsecuriteAlimentaire(),
                    insecuriteAlimentaireData?.taux_min?.[0] ?? null,
                    insecuriteAlimentaireData?.taux_max?.[0] ?? null,
                    "#ff8042",
                    "de la population en situation d'insécurité alimentaire",
                    'percentage'
                )}
            </div>
        </div>
    );
}
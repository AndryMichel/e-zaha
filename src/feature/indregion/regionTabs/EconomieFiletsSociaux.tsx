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
    useGetNombreBeneficiairesFiletSecurite,
    useGetNombreEntrepriseRegion
} from "@/services/api/region/indic-economie-region.api";
import {
    GetIndicateurRegionParams,
    RegionBeneficiairesFiletResponse,
    RegionNombreEntrepriseResponse
} from "@/services/types/indic-region.type";

export function EconomieFiletsSociaux() {
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
    const {data: beneficiairesData, isLoading: isLoadingBeneficiaires, isError: isErrorBeneficiaires} =
        useGetNombreBeneficiairesFiletSecurite(apiParams);

    const {data: entreprisesData, isLoading: isLoadingEntreprises, isError: isErrorEntreprises} =
        useGetNombreEntrepriseRegion(apiParams);

    // État de chargement global
    const isLoading = isLoadingBeneficiaires || isLoadingEntreprises;

    // État d'erreur global
    const hasError = isErrorBeneficiaires || isErrorEntreprises;

    // Interface pour les réponses avec message d'erreur
    interface BaseResponseWithMessage {
        message?: string[];
    }

    // Interface spécifique pour les données d'entreprises avec message d'erreur
    interface EntrepriseResponseWithMessage extends BaseResponseWithMessage {
        total_regions?: number[];
        total_entreprises?: number[];
        moyenne_entreprises_par_region?: number[];
        nombre_regions?: number[];
        annee?: number[];
        region_code?: string[];
        details_par_region?: {
            region: string[];
            nombre_entreprises: number[];
            annee: string[];
        }[];
    }

    // Interface générique pour les autres réponses avec message d'erreur
    interface GenericResponseWithMessage extends BaseResponseWithMessage {
        [key: string]: string[] | number[] | undefined;
    }

    // Fonction pour vérifier si les données d'entreprise contiennent un message d'erreur
    const hasEntrepriseMessageError = (data: EntrepriseResponseWithMessage | null): boolean => {
        return Boolean(data?.message?.[0]);
    };

    // Fonction pour vérifier si les données génériques contiennent un message d'erreur
    const hasGenericMessageError = (data: GenericResponseWithMessage | null): boolean => {
        return Boolean(data?.message?.[0]);
    };

    // Helper functions pour accéder aux données en toute sécurité
    const safeGetTotalBeneficiaires = () => {
        if (hasGenericMessageError(beneficiairesData)) {
            return null;
        }
        return beneficiairesData?.total_beneficiaires?.[0] ?? 0;
    };

    const safeGetMoyenneBeneficiaires = () => {
        if (hasGenericMessageError(beneficiairesData)) {
            return null;
        }
        return beneficiairesData?.moyenne_beneficiaires_par_region?.[0] ?? 0;
    };

    const safeGetMinBeneficiaires = () => {
        if (hasGenericMessageError(beneficiairesData)) {
            return null;
        }
        return beneficiairesData?.min_beneficiaires?.[0] ?? 0;
    };

    const safeGetMaxBeneficiaires = () => {
        if (hasGenericMessageError(beneficiairesData)) {
            return null;
        }
        return beneficiairesData?.max_beneficiaires?.[0] ?? 0;
    };

    const safeGetTotalEntreprises = () => {
        if (hasEntrepriseMessageError(entreprisesData)) {
            return null;
        }
        return entreprisesData?.total_entreprises?.[0] ?? 0;
    };

    const safeGetMoyenneEntreprises = () => {
        if (hasEntrepriseMessageError(entreprisesData)) {
            return null;
        }
        return entreprisesData?.moyenne_entreprises_par_region?.[0] ?? 0;
    };

    const safeGetMinEntreprises = () => {
        // La valeur minimale est mise à 0 par défaut car non fournie par l'API
        return 0;
    };

    const safeGetMaxEntreprises = () => {
        // La valeur maximale est égale au total par défaut
        return safeGetTotalEntreprises();
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
    type BeneficiairesDataType = RegionBeneficiairesFiletResponse['data'] & GenericResponseWithMessage | null;
    type EntreprisesDataType = RegionNombreEntrepriseResponse['data'] & EntrepriseResponseWithMessage | null;

    // Fonction pour rendre une carte d'indicateur pour les bénéficiaires
    const renderBeneficiairesCard = (
        title: string,
        data: BeneficiairesDataType,
        value: number | null,
        minValue: number | null,
        maxValue: number | null,
        averageValue: number | null,
        color: string,
        description: string,
        unit: string = ''
    ) => {
        // Vérifier si les données contiennent un message d'erreur
        const messageError = data?.message?.[0];

        const formattedValue = value !== null ? value.toLocaleString() + unit : 'N/A';
        const formattedMinValue = minValue !== null ? minValue.toLocaleString() + unit : 'N/A';
        const formattedMaxValue = maxValue !== null ? maxValue.toLocaleString() + unit : 'N/A';
        const formattedAvgValue = averageValue !== null ? averageValue.toLocaleString() + unit : 'N/A';

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
                                        {formattedValue}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 text-center">{description}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500">Minimum</p>
                                        <p className="font-semibold">{formattedMinValue}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500">Moyenne</p>
                                        <p className="font-semibold">{formattedAvgValue}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500">Maximum</p>
                                        <p className="font-semibold">{formattedMaxValue}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Fonction pour rendre une carte d'indicateur pour les entreprises
    const renderEntreprisesCard = (
        title: string,
        data: EntreprisesDataType,
        value: number | null,
        minValue: number | null,
        maxValue: number | null,
        averageValue: number | null,
        color: string,
        description: string,
        unit: string = ''
    ) => {
        // Vérifier si les données contiennent un message d'erreur
        const messageError = data?.message?.[0];

        const formattedValue = value !== null ? value.toLocaleString() + unit : 'N/A';
        const formattedMinValue = minValue !== null ? minValue.toLocaleString() + unit : 'N/A';
        const formattedMaxValue = maxValue !== null ? maxValue.toLocaleString() + unit : 'N/A';
        const formattedAvgValue = averageValue !== null ? averageValue.toLocaleString() + unit : 'N/A';

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
                                        {formattedValue}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 text-center">{description}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500">Minimum</p>
                                        <p className="font-semibold">{formattedMinValue}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500">Moyenne</p>
                                        <p className="font-semibold">{formattedAvgValue}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500">Maximum</p>
                                        <p className="font-semibold">{formattedMaxValue}</p>
                                    </div>
                                </div>
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
                {/* Carte pour les bénéficiaires de filets sociaux */}
                {renderBeneficiairesCard(
                    "Nombre de personne bénéficiaire de filet de sécurité sociale",
                    beneficiairesData,
                    safeGetTotalBeneficiaires(),
                    safeGetMinBeneficiaires(),
                    safeGetMaxBeneficiaires(),
                    safeGetMoyenneBeneficiaires(),
                    "#8884d8",
                    "bénéficiaires des programmes de filets de sécurités sociaux"
                )}

                {/* Carte pour le nombre d'entreprises */}
                {renderEntreprisesCard(
                    "Nombre d'entreprise dans la région",
                    entreprisesData,
                    safeGetTotalEntreprises(),
                    safeGetMinEntreprises(),
                    safeGetMaxEntreprises(),
                    safeGetMoyenneEntreprises(),
                    "#82ca9d",
                    "entreprises enregistrées"
                )}
            </div>
        </div>
    );
}
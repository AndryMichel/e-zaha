'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/molécules/select';
import {Input} from '@/components/ui/atomes/input';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import {Alert, AlertDescription} from '@/components/ui/molécules/alert';
import {AlertCircle, MapPin} from 'lucide-react';
import {Button} from '@/components/ui/atomes/button';
import {useSession} from 'next-auth/react';
import {GetIndicateurCommuneParams} from '@/services/types/indic-commune.type';
import {getRegionsByProvinceCode, regionsData} from '@/lib/region';
import {provinces} from '@/lib/province';
import {getDistrictNameByCode} from '@/lib/district';
import {
    useGetPourcentageCommunesConservation,
    useGetPourcentageCommunesGRC
} from '@/services/api/commune/indic-env.api';
import {ConservationCommuneData, GRCCommuneData} from '@/services/types/indic-envi.type';

// Définition des types pour l'état partagé
interface SharedStateType {
    selectedLocation: {
        province?: string;
        region?: string;
        commune_code?: string;
        district?: string;
    };
    filteredCommunes: GRCCommuneData[] | ConservationCommuneData[];
}

// État partagé pour coordination entre EnviComTab et CarteCommune
export const sharedEnvState: SharedStateType = {
    selectedLocation: {},
    filteredCommunes: []
};

export function EnviComTab() {
    const {data: session} = useSession();
    const userRole = session?.user?.role;
    const userCommuneCode = session?.user?.location?.commune_code as string | undefined;
    const userRegionCode = session?.user?.location?.region_code as string | undefined;
    const userProvinceCode = session?.user?.location?.province_code as string | undefined;
    const userDistrictCode = session?.user?.location?.district_code as string | undefined;

    // États pour les filtres
    const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
    const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
    const [selectedCommune, setSelectedCommune] = useState<string | undefined>(undefined);
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);

    // États pour la recherche
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    // Paramètres pour l'API avec gestion automatique selon le rôle
    const [apiParams, setApiParams] = useState<GetIndicateurCommuneParams>(() => {
        const baseParams: GetIndicateurCommuneParams = {annee: selectedYear};

        // Appliquer automatiquement les filtres selon le rôle
        if (userRole === 'communal' && userCommuneCode) {
            baseParams.commune_code = userCommuneCode;
        } else if (userRole === 'regional' && userRegionCode) {
            baseParams.region_code = userRegionCode;
        } else if (userRole === 'district' && userDistrictCode) {
            baseParams.district_code = userDistrictCode;
        } else if (userRole === 'provincial' && userProvinceCode) {
            baseParams.province_code = userProvinceCode;
        }

        return baseParams;
    });

    // Appels des APIs pour les deux indicateurs
    const grcData = useGetPourcentageCommunesGRC(apiParams);
    const conservationData = useGetPourcentageCommunesConservation(apiParams);

    // État pour le selected location (pour la carte)
    const [selectedLocation, setSelectedLocation] = useState<{
        commune_code?: string;
        region?: string;
        province?: string;
        district?: string;
    }>({});

    // Effet pour définir les filtres par défaut en fonction du rôle de l'utilisateur
    useEffect(() => {
        const newParams: GetIndicateurCommuneParams = {annee: selectedYear};

        if (userRole === 'communal' && userCommuneCode) {
            setSelectedCommune(userCommuneCode);
            newParams.commune_code = userCommuneCode;
            setSelectedLocation({commune_code: userCommuneCode});
        } else if (userRole === 'regional' && userRegionCode) {
            setSelectedRegion(userRegionCode);
            newParams.region_code = userRegionCode;

            const regionName = regionsData.find(r => r.code === userRegionCode)?.name;
            if (regionName) {
                setSelectedLocation({region: regionName});
            }
        } else if (userRole === 'district' && userDistrictCode) {
            newParams.district_code = userDistrictCode;
            // Pas d'affichage de localisation pour district
        } else if (userRole === 'provincial' && userProvinceCode) {
            setSelectedProvince(userProvinceCode);
            newParams.province_code = userProvinceCode;

            const provinceName = provinces.find(p => p.code === userProvinceCode)?.name;
            if (provinceName) {
                setSelectedLocation({province: provinceName});
            }
        }

        setApiParams(newParams);
    }, [userRole, userCommuneCode, userRegionCode, userDistrictCode, userProvinceCode, selectedYear]);

    // Mettre à jour selectedLocation quand les filtres changent
    useEffect(() => {
        const location: { commune_code?: string; region?: string; province?: string; district?: string } = {};

        if (selectedCommune) {
            location.commune_code = selectedCommune;
        } else if (selectedRegion) {
            const regionName = regionsData.find(r => r.code === selectedRegion)?.name;
            if (regionName) location.region = regionName;
        } else if (selectedProvince) {
            const provinceName = provinces.find(p => p.code === selectedProvince)?.name;
            if (provinceName) location.province = provinceName;
        }

        setSelectedLocation(location);
        sharedEnvState.selectedLocation = {...location};
    }, [selectedCommune, selectedRegion, selectedProvince]);

    // Mettre à jour les communes filtrées dans l'état partagé (utilise les données GRC par défaut)
    useEffect(() => {
        if (grcData.data?.communes) {
            sharedEnvState.filteredCommunes = grcData.data.communes;
        }
    }, [grcData.data?.communes]);

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Fonction pour obtenir les régions filtrées selon le rôle et la province
    const getFilteredRegions = useCallback(() => {
        let availableRegions = regionsData;

        if (userRole === 'provincial' && userProvinceCode) {
            // Pour les utilisateurs provinciaux, n'afficher que les régions de leur province
            availableRegions = getRegionsByProvinceCode(userProvinceCode);
        } else if ((userRole === 'ODDL' || userRole === 'administrateur') && selectedProvince) {
            // Pour ODDL et administrateur, filtrer par province sélectionnée
            availableRegions = getRegionsByProvinceCode(selectedProvince);
        }

        if (searchQuery && searchQuery.trim() !== '') {
            availableRegions = availableRegions.filter(region =>
                region.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return availableRegions;
    }, [userRole, userProvinceCode, selectedProvince, searchQuery]);

    // Fonction pour obtenir les provinces disponibles selon le rôle
    const getAvailableProvinces = useCallback(() => {
        if (userRole === 'provincial' && userProvinceCode) {
            return provinces.filter(province => province.code === userProvinceCode);
        } else if (userRole === 'regional' && userRegionCode) {
            const userRegion = regionsData.find(r => r.code === userRegionCode);
            if (userRegion) {
                return provinces.filter(province => province.code === userRegion.province_code);
            }
        } else if (userRole === 'district' && userDistrictCode) {
            return provinces;
        }
        return provinces;
    }, [userRole, userProvinceCode, userRegionCode, userDistrictCode]);

    // Préparation des données pour les graphiques GRC
    const prepareGRCData = () => {
        if (!grcData.data?.summary) return [];
        const totalCommunes = grcData.data.summary.nombre_communes_total[0];
        const communesWithGRC = 'nombre_communes_avec_grc' in grcData.data.summary
            ? grcData.data.summary.nombre_communes_avec_grc?.[0] ?? 0
            : 0;

        const communesWithoutGRC = totalCommunes - communesWithGRC;

        return [
            {name: 'Avec GRC opérationnel', value: communesWithGRC, fill: '#00C49F'},
            {name: 'Sans GRC opérationnel', value: communesWithoutGRC, fill: '#FF8042'}
        ];
    };

    // Préparation des données pour les graphiques Conservation
    const prepareConservationData = () => {
        if (!conservationData.data?.summary) return [];
        const totalCommunes = conservationData.data.summary.nombre_communes_total[0];
        const communesWithConservation = 'nombre_communes_avec_actions_conservation' in conservationData.data.summary
            ? conservationData.data.summary.nombre_communes_avec_actions_conservation?.[0] ?? 0
            : 0;

        const communesWithoutConservation = totalCommunes - communesWithConservation;

        return [
            {name: 'Avec actions de conservation', value: communesWithConservation, fill: '#0088FE'},
            {name: 'Sans actions de conservation', value: communesWithoutConservation, fill: '#FF8042'}
        ];
    };

    // Gérer les changements de filtre
    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);

        const newParams: GetIndicateurCommuneParams = {annee: newYear};

        if (userRole === 'communal' && userCommuneCode) {
            newParams.commune_code = userCommuneCode;
        } else if (userRole === 'regional' && userRegionCode) {
            newParams.region_code = userRegionCode;
        } else if (userRole === 'district' && userDistrictCode) {
            newParams.district_code = userDistrictCode;
        } else if (userRole === 'provincial' && userProvinceCode) {
            newParams.province_code = userProvinceCode;
        } else if (selectedCommune) {
            newParams.commune_code = selectedCommune;
        } else if (selectedRegion) {
            newParams.region_code = selectedRegion;
        } else if (selectedProvince) {
            newParams.province_code = selectedProvince;
        }

        setApiParams(newParams);
    };

    const handleProvinceChange = (value: string) => {
        if (userRole !== 'ODDL' && userRole !== 'administrateur') return;

        if (value === "all") {
            setSelectedProvince(undefined);
            setSelectedRegion(undefined);
            setSelectedCommune(undefined);
            setApiParams({annee: selectedYear});
        } else {
            setSelectedProvince(value);
            setSelectedRegion(undefined);
            setSelectedCommune(undefined);
            setApiParams({annee: selectedYear, province_code: value});
        }
        setSearchQuery('');
    };

    const handleRegionChange = (regionCode: string) => {
        // Ne permet les changements que pour certains rôles
        if (userRole === 'communal' || userRole === 'regional' || userRole === 'district') return;

        setSelectedRegion(regionCode);
        setSelectedCommune(undefined);
        setApiParams({annee: selectedYear, region_code: regionCode});
        setIsDropdownVisible(false);
        setSearchQuery('');
    };

    const handleSearchFocus = () => {
        setIsDropdownVisible(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleViewCartButtonClick = () => {
        // Émettre un événement pour actualiser la carte basée sur la sélection actuelle
        const event = new CustomEvent('envMapViewToggled', {
            detail: {
                selectedLocation: selectedLocation
            }
        });
        window.dispatchEvent(event);
    };

    // Fonctions pour déterminer quels filtres afficher
    const canViewProvinceFilter = () => {
        return userRole === 'administrateur' || userRole === 'ODDL';
    };

    const canViewRegionFilter = () => {
        return userRole === 'administrateur' || userRole === 'ODDL' || userRole === 'provincial';
    };

    // Préparer le texte du résumé
    const getSummaryText = () => {
        let location = "";

        if (selectedCommune) {
            const commune = grcData.data?.communes?.find(c => c.commune_code[0] === selectedCommune) ||
                conservationData.data?.communes?.find(c => c.commune_code[0] === selectedCommune);
            location = `la commune de ${commune?.commune[0] || selectedCommune}`;
        } else if (selectedRegion) {
            const region = regionsData.find(r => r.code === selectedRegion);
            location = `la région ${region?.name || selectedRegion}`;
        } else if (selectedProvince) {
            const province = provinces.find(p => p.code === selectedProvince);
            location = `la province de ${province?.name || selectedProvince}`;
        } else if (userRole === 'district' && userDistrictCode) {
            // Pour les utilisateurs district, afficher le nom du district
            const districtName = getDistrictNameByCode(userDistrictCode);
            location = districtName ? `le district de ${districtName}` : `le district ${userDistrictCode}`;
        } else if (userRole === 'regional' && userRegionCode) {
            // Pour les utilisateurs régionaux, afficher le nom de la région
            const regionName = regionsData.find(r => r.code === userRegionCode)?.name;
            location = regionName ? `la région ${regionName}` : `la région ${userRegionCode}`;
        } else if (userRole === 'communal' && userCommuneCode) {
            // Pour les utilisateurs communaux, essayer de trouver le nom de la commune
            const commune = grcData.data?.communes?.find(c => c.commune_code[0] === userCommuneCode) ||
                conservationData.data?.communes?.find(c => c.commune_code[0] === userCommuneCode);
            location = commune ? `la commune de ${commune.commune[0]}` : `la commune ${userCommuneCode}`;
        } else {
            location = "Madagascar";
        }

        const grcPercentage = grcData.data?.summary && 'pourcentage_communes_grc' in grcData.data.summary
            ? grcData.data.summary.pourcentage_communes_grc?.[0] ?? 0
            : 0;

        const conservationPercentage = conservationData.data?.summary && 'pourcentage_communes_conservation' in conservationData.data.summary
            ? conservationData.data.summary.pourcentage_communes_conservation?.[0] ?? 0
            : 0;

        return `À ${location} : ${grcPercentage}% des communes ont un GRC opérationnel et ${conservationPercentage}% mènent des actions de conservation environnementale`;
    };

    // Afficher les filtres
    const renderFilters = () => (
        <div className="flex flex-wrap gap-4 mb-4">
            {/* Sélection de l'année */}
            <div className="w-full md:w-auto">
                <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Année"/>
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(year => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Sélection de la province */}
            {canViewProvinceFilter() && (
                <div className="w-full md:w-auto">
                    <Select value={selectedProvince || "all"} onValueChange={handleProvinceChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Province"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les provinces</SelectItem>
                            {getAvailableProvinces().map(province => (
                                <SelectItem key={province.code} value={province.code}>
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Recherche de région */}
            {canViewRegionFilter() && (
                <div className="w-full md:w-auto relative region-search-container">
                    <Input
                        type="text"
                        placeholder="Rechercher une région..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        className="w-full md:w-[250px]"
                    />
                    {isDropdownVisible && (
                        <div
                            className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto region-dropdown">
                            {getFilteredRegions().length > 0 ? (
                                getFilteredRegions().map(region => (
                                    <div
                                        key={region.code}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleRegionChange(region.code)}
                                    >
                                        {region.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500">
                                    Aucune région trouvée
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Bouton pour actualiser la vue sur la carte */}
            <Button
                variant="outline"
                className="w-full md:w-auto md:ml-auto"
                onClick={handleViewCartButtonClick}
            >
                <MapPin className="mr-2 h-4 w-4"/>
                Voir sur la carte
            </Button>
        </div>
    );

    // État de chargement global
    if (grcData.isLoading || conservationData.isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                        Chargement des données environnementales...
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-6 justify-center">
                    <Skeleton className="w-full md:w-64 h-64"/>
                    <Skeleton className="w-full md:w-64 h-64"/>
                </CardContent>
            </Card>
        );
    }

    // État d'erreur
    if (grcData.isError || conservationData.isError) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                        Erreur de chargement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderFilters()}
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    // Si aucune donnée n'est disponible
    if ((!grcData.data?.summary && (!grcData.data?.communes || grcData.data.communes.length === 0)) &&
        (!conservationData.data?.summary && (!conservationData.data?.communes || conservationData.data.communes.length === 0))) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                        Données environnementales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderFilters()}
                    <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            Aucune donnée disponible pour les critères sélectionnés.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                    Tableau de bord environnemental
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
                {/* Filtres */}
                {renderFilters()}

                {/* Résumé des statistiques */}
                <div className="text-base md:text-lg font-medium text-center p-2 bg-gray-50 rounded-lg">
                    {getSummaryText()}
                </div>

                {/* Détails de la commune si sélectionnée */}
                {selectedCommune && (grcData.data?.communes || conservationData.data?.communes) && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-center md:text-left mb-2">
                            Détails de la commune
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(grcData.data?.communes || conservationData.data?.communes || []).map((commune, index) => {
                                if (commune.commune_code[0] === selectedCommune) {
                                    // Chercher les données correspondantes dans les deux datasets
                                    const grcCommune = grcData.data?.communes?.find(c => c.commune_code[0] === selectedCommune) as GRCCommuneData | undefined;
                                    const conservationCommune = conservationData.data?.communes?.find(c => c.commune_code[0] === selectedCommune) as ConservationCommuneData | undefined;

                                    return (
                                        <div key={index} className="w-full">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{commune.commune[0]}</span>
                                                    <span
                                                        className="text-sm text-gray-500">{commune.region[0]}, {commune.province[0]}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    {grcCommune && (
                                                        <div className={`px-3 py-1 rounded-full text-sm ${
                                                            grcCommune.a_grc_operationnel[0] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {grcCommune.a_grc_operationnel[0] ? 'GRC Opérationnel' : 'GRC Non Opérationnel'}
                                                        </div>
                                                    )}
                                                    {conservationCommune && (
                                                        <div className={`px-3 py-1 rounded-full text-sm ${
                                                            conservationCommune.a_actions_conservation[0] ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {conservationCommune.a_actions_conservation[0] ? 'Actions de conservation' : 'Pas d\'actions'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {conservationCommune?.a_actions_conservation[0] && (
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                    <div className={`p-2 rounded ${
                                                        conservationCommune.details_actions.realisation_filtrations[0] ? 'bg-blue-100' : 'bg-gray-100'
                                                    }`}>
                                                        <span>Filtration: </span>
                                                        <span className="font-medium">
                                                            {conservationCommune.details_actions.realisation_filtrations[0] ? 'Oui' : 'Non'}
                                                        </span>
                                                    </div>
                                                    <div className={`p-2 rounded ${
                                                        conservationCommune.details_actions.realisation_protection[0] ? 'bg-green-100' : 'bg-gray-100'
                                                    }`}>
                                                        <span>Protection: </span>
                                                        <span className="font-medium">
                                                            {conservationCommune.details_actions.realisation_protection[0] ? 'Oui' : 'Non'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}

                {/* Affichage des graphiques côte à côte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Graphique GRC */}
                    <ChartBlock
                        title="Pourcentage de Communes ayant des structures de Gestion de risques et catastrophes opérationnelles (CCGRC)">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={prepareGRCData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {prepareGRCData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString()}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 grid grid-cols-1 gap-2 text-xs sm:text-sm">
                            {prepareGRCData().map((entry, index) => (
                                <div key={`detail-${index}`} className="flex items-center justify-between p-1">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2" style={{backgroundColor: entry.fill}}></div>
                                        <span>{entry.name}:</span>
                                    </div>
                                    <span className="font-semibold">{entry.value.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="pt-2 mt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span>Total des communes:</span>
                                    <span className="font-semibold text-sm sm:text-base">
                                        {grcData.data?.summary?.nombre_communes_total[0].toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </ChartBlock>

                    {/* Graphique Conservation */}
                    <ChartBlock title="Pourcentage de communes avec actions de conservation environnementale">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={prepareConservationData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {prepareConservationData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString()}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 grid grid-cols-1 gap-2 text-xs sm:text-sm">
                            {prepareConservationData().map((entry, index) => (
                                <div key={`detail-${index}`} className="flex items-center justify-between p-1">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2" style={{backgroundColor: entry.fill}}></div>
                                        <span>{entry.name}:</span>
                                    </div>
                                    <span className="font-semibold">{entry.value.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="pt-2 mt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span>Total des communes:</span>
                                    <span className="font-semibold text-sm sm:text-base">
                                        {conservationData.data?.summary?.nombre_communes_total[0].toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </ChartBlock>
                </div>

                {/* Affichage d'un tableau des communes (si une région est sélectionnée) */}
                {selectedRegion && (grcData.data?.communes || conservationData.data?.communes) && (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 mt-6">
                        <h3 className="font-medium text-center p-3 bg-gray-50 border-b border-gray-200">
                            Communes de la région {regionsData.find(r => r.code === selectedRegion)?.name}
                        </h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commune
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    District
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    GRC Opérationnel
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions de conservation
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Filtration
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Protection
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {(grcData.data?.communes || conservationData.data?.communes || []).map((commune, index) => {
                                // Chercher les données correspondantes dans les deux datasets
                                const grcCommune = grcData.data?.communes?.find(c => c.commune_code[0] === commune.commune_code[0]) as GRCCommuneData | undefined;
                                const conservationCommune = conservationData.data?.communes?.find(c => c.commune_code[0] === commune.commune_code[0]) as ConservationCommuneData | undefined;

                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {commune.commune[0]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {commune.district[0]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {grcCommune ? (
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        grcCommune.a_grc_operationnel[0]
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {grcCommune.a_grc_operationnel[0] ? 'Oui' : 'Non'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {conservationCommune ? (
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        conservationCommune.a_actions_conservation[0]
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {conservationCommune.a_actions_conservation[0] ? 'Oui' : 'Non'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {conservationCommune ? (
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        conservationCommune.details_actions.realisation_filtrations[0]
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {conservationCommune.details_actions.realisation_filtrations[0] ? 'Oui' : 'Non'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {conservationCommune ? (
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        conservationCommune.details_actions.realisation_protection[0]
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {conservationCommune.details_actions.realisation_protection[0] ? 'Oui' : 'Non'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Mention pour indiquer l'emplacement sélectionné */}
                {Object.keys(selectedLocation).length > 0 && (
                    <div className="text-sm text-gray-500 mt-4">
                        Données affichées pour : {' '}
                        {selectedLocation.commune_code ? 'Commune spécifique' :
                            selectedLocation.region ? `Région: ${selectedLocation.region}` :
                                selectedLocation.province ? `Province: ${selectedLocation.province}` : 'Toutes les communes'}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Composant auxiliaire pour les blocs de graphiques
function ChartBlock({title, children}: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
            {children}
        </div>
    );
}
'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {
    useGetPourcentageCommunesActes,
    useGetPourcentageCommunesBIF,
    useGetPourcentageCommunesPDLII,
    useGetPourcentageCommunesSLC,
    useGetProportionCommunesSAC
} from '@/services/api/commune/indic-Gouv.api';
import {useSession} from 'next-auth/react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/molécules/select';
import {Input} from '@/components/ui/atomes/input';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import {Alert, AlertDescription} from '@/components/ui/molécules/alert';
import {AlertCircle, MapPin} from 'lucide-react';
import {Button} from '@/components/ui/atomes/button';
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

import {getRegionsByProvinceCode, regionsData} from '@/lib/region';
import {provinces} from '@/lib/province';
import {CommuneGouvernanceDataExtended, GetIndicateurGouvernanceParams} from '@/services/types/indic-Gouv.type';

// Définition des types pour l'état partagé
interface SharedStateType {
    selectedLocation: {
        province?: string;
        region?: string;
        commune_code?: string;
    };
    filteredCommunes: CommuneGouvernanceDataExtended[];
}

// État partagé pour coordination entre composants
export const sharedState: SharedStateType = {
    selectedLocation: {},
    filteredCommunes: []
};

export function GouverComTab() {
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

    // Paramètres pour les APIs avec gestion automatique selon le rôle
    const [apiParams, setApiParams] = useState<GetIndicateurGouvernanceParams>(() => {
        const baseParams: GetIndicateurGouvernanceParams = {annee: selectedYear};

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

    // Appels des APIs - tous les indicateurs de gouvernance
    const slcData = useGetPourcentageCommunesSLC(apiParams);
    const sacData = useGetProportionCommunesSAC(apiParams);
    const pdliiData = useGetPourcentageCommunesPDLII(apiParams);
    const bifData = useGetPourcentageCommunesBIF(apiParams);
    const actesData = useGetPourcentageCommunesActes(apiParams);

    // État pour le selected location
    const [selectedLocation, setSelectedLocation] = useState<{
        commune_code?: string;
        region?: string;
        province?: string;
    }>({});

    // Dédupliquer les données de communes
    const getUniqueCommunes = useCallback(() => {
        const allCommunes = [
            ...(slcData.data?.communes || []),
            ...(sacData.data?.communes || []),
            ...(pdliiData.data?.communes || []),
            ...(bifData.data?.communes || []),
            ...(actesData.data?.communes || [])
        ];

        const uniqueMap = new Map<string, CommuneGouvernanceDataExtended>();
        allCommunes.forEach(commune => {
            if (!uniqueMap.has(commune.commune_code[0])) {
                uniqueMap.set(commune.commune_code[0], commune);
            }
        });

        return Array.from(uniqueMap.values());
    }, [slcData.data, sacData.data, pdliiData.data, bifData.data, actesData.data]);

    // Effet pour définir les filtres par défaut en fonction du rôle de l'utilisateur
    useEffect(() => {
        const newParams: GetIndicateurGouvernanceParams = {annee: selectedYear};

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
        const location: { commune_code?: string; region?: string; province?: string } = {};

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
        sharedState.selectedLocation = {...location};
    }, [selectedCommune, selectedRegion, selectedProvince]);

    // Mettre à jour les communes filtrées
    useEffect(() => {
        const uniqueCommunes = getUniqueCommunes();
        sharedState.filteredCommunes = uniqueCommunes;
    }, [getUniqueCommunes]);

    // Liste des années disponibles
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Fonction pour obtenir les régions filtrées selon le rôle et la province
    const getFilteredRegions = useCallback(() => {
        let availableRegions = regionsData;

        if (userRole === 'regional' && userRegionCode) {
            availableRegions = regionsData.filter(region => region.code === userRegionCode);
        } else if (userRole === 'district' && userDistrictCode) {
            availableRegions = regionsData;
        } else if (userRole === 'provincial' && userProvinceCode) {
            availableRegions = getRegionsByProvinceCode(userProvinceCode);
        } else if ((userRole === 'ODDL' || userRole === 'administrateur') && selectedProvince) {
            availableRegions = getRegionsByProvinceCode(selectedProvince);
        }

        if (searchQuery && searchQuery.trim() !== '') {
            availableRegions = availableRegions.filter(region =>
                region.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return availableRegions;
    }, [userRole, userRegionCode, userDistrictCode, userProvinceCode, selectedProvince, searchQuery]);

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

    // Types pour les données des graphiques
    interface GouvernanceData {
        name: string;
        value: number;
        fill: string;
    }

    // Préparer les données pour les graphiques
    const prepareGovernanceData = (): GouvernanceData[] => {
        if (!slcData.data?.summary || !sacData.data?.summary || !pdliiData.data?.summary ||
            !bifData.data?.summary || !actesData.data?.summary) return [];
        return [
            {
                name: 'SLC',
                value: slcData.data.summary.pourcentage_communes_slc?.[0] || 0,
                fill: '#0088FE'
            },
            {
                name: 'SAC',
                value: sacData.data.summary.proportion_communes_sac?.[0] || 0,
                fill: '#00C49F'
            },
            {
                name: 'PDLII',
                value: pdliiData.data.summary.pourcentage_communes_pdlii?.[0] || 0,
                fill: '#FFBB28'
            },
            {
                name: 'BIF',
                value: bifData.data.summary.pourcentage_communes_bif?.[0] || 0,
                fill: '#FF8042'
            },
            {
                name: 'Actes Admin.',
                value: actesData.data.summary.pourcentage_communes_actes?.[0] || 0,
                fill: '#8884D8'
            }
        ];
    };

    // Gérer les changements de filtre
    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);

        const newParams: GetIndicateurGouvernanceParams = {annee: newYear};

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
        const event = new CustomEvent('mapViewToggled', {
            detail: {
                selectedLocation: selectedLocation,
                source: 'gouvernance'
            }
        });
        window.dispatchEvent(event);
    };

    // Vérifier l'état de chargement
    const isLoading = slcData.isLoading || sacData.isLoading || pdliiData.isLoading ||
        bifData.isLoading || actesData.isLoading;
    const isError = slcData.isError || sacData.isError || pdliiData.isError ||
        bifData.isError || actesData.isError;

    // Vérifier si les données sont disponibles
    const hasData = slcData.data?.summary && sacData.data?.summary && pdliiData.data?.summary &&
        bifData.data?.summary && actesData.data?.summary;

    // Fonctions pour déterminer quels filtres afficher
    const canViewProvinceFilter = () => {
        return userRole === 'administrateur' || userRole === 'ODDL';
    };

    const canViewRegionFilter = () => {
        return userRole === 'administrateur' || userRole === 'ODDL' || userRole === 'provincial';
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
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                        Chargement des indicateurs de gouvernance...
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-6 justify-center">
                    <Skeleton className="w-full md:w-64 h-64"/>
                    <Skeleton className="w-full md:w-64 h-64"/>
                    <Skeleton className="w-full md:w-64 h-64"/>
                </CardContent>
            </Card>
        );
    }

    // État d'erreur
    if (isError) {
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
    if (!hasData) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                        Indicateurs de gouvernance communale
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
                    Tableau de bord de gouvernance communale
                </CardTitle>
            </CardHeader>

            {/* Filtres */}
            <CardContent className="flex flex-col gap-6">
                {renderFilters()}

                {/* État des données de base avec responsive amélioré */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <StatCard
                            title="Pourcentage des communes disposant une SLC opérationnelle"
                            value={`${slcData.data?.summary?.pourcentage_communes_slc?.[0] || 0}%`}
                        />
                        <StatCard
                            title="Proportion des communes disposant des (SAC/PUDi/PUDé/SAIC) validés et mis en œuvre "
                            value={`${sacData.data?.summary?.proportion_communes_sac?.[0] || 0}%`}
                        />
                        <StatCard
                            title="Pourcentage de Communes disposant de PDLII à jour"
                            value={`${pdliiData.data?.summary?.pourcentage_communes_pdlii?.[0] || 0}%`}
                        />
                        <StatCard
                            title="Pourcentage de Communes ayant un BIF ou un Service foncier fonctionnel"
                            value={`${bifData.data?.summary?.pourcentage_communes_bif?.[0] || 0}%`}
                        />
                        <StatCard
                            title="Pourcentage des Communes ayant soumis des actes administratifs pour contrôle de légalité"
                            value={`${actesData.data?.summary?.pourcentage_communes_actes?.[0] || 0}%`}
                        />
                    </div>
                </div>

                {/* Contenu principal - Statistiques */}
                <div className="flex flex-wrap gap-6 justify-center">
                    {/* Graphique comparatif des indicateurs */}
                    <ChartBlock title="Indicateurs de gouvernance locale">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={prepareGovernanceData()}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name" tick={{fontSize: 10}}/>
                                <YAxis
                                    label={{value: '%', angle: -90, position: 'insideLeft'}}
                                    tick={{fontSize: 10}}
                                />
                                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`}/>
                                <Bar dataKey="value" barSize={40}>
                                    {prepareGovernanceData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                                {prepareGovernanceData().map((entry, index) => (
                                    <div key={`detail-${index}`}
                                         className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 mr-2 rounded-sm"
                                                 style={{backgroundColor: entry.fill}}></div>
                                            <span className="font-medium">{entry.name}:</span>
                                        </div>
                                        <span className="font-bold text-gray-800">{entry.value.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ChartBlock>
                </div>

                {/* Tableau récapitulatif si une région est sélectionnée */}
                {selectedRegion && slcData.data?.communes && slcData.data.communes.length > 0 && (
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
                                    SLC
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SAC
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    PDLII
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    BIF
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actes Admin.
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {slcData.data.communes.map((commune, index) => {
                                // Trouver les données correspondantes dans les autres APIs
                                const sacCommune = sacData.data?.communes?.find(c => c.commune_code[0] === commune.commune_code[0]);
                                const pdliiCommune = pdliiData.data?.communes?.find(c => c.commune_code[0] === commune.commune_code[0]);
                                const bifCommune = bifData.data?.communes?.find(c => c.commune_code[0] === commune.commune_code[0]);
                                const actesCommune = actesData.data?.communes?.find(c => c.commune_code[0] === commune.commune_code[0]);

                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {commune.commune[0]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {commune.district[0]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        commune.dispose_slc?.[0] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {commune.dispose_slc?.[0] ? 'Oui' : 'Non'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        sacCommune?.dispose_sac?.[0] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {sacCommune?.dispose_sac?.[0] ? 'Oui' : 'Non'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        pdliiCommune?.dispose_pdlii?.[0] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {pdliiCommune?.dispose_pdlii?.[0] ? 'Oui' : 'Non'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        bifCommune?.a_bif_fonctionnel?.[0] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {bifCommune?.a_bif_fonctionnel?.[0] ? 'Oui' : 'Non'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        actesCommune?.soumis_actes?.[0] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {actesCommune?.soumis_actes?.[0] ? 'Oui' : 'Non'}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Détails spécifiques pour une commune sélectionnée */}
                {selectedCommune && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-center md:text-left mb-3">
                            Détails de gouvernance pour la commune sélectionnée
                        </h3>
                        {slcData.data?.communes?.map((commune, index) => {
                            if (commune.commune_code[0] === selectedCommune) {
                                const sacCommune = sacData.data?.communes?.find(c => c.commune_code[0] === selectedCommune);
                                const pdliiCommune = pdliiData.data?.communes?.find(c => c.commune_code[0] === selectedCommune);
                                const bifCommune = bifData.data?.communes?.find(c => c.commune_code[0] === selectedCommune);
                                const actesCommune = actesData.data?.communes?.find(c => c.commune_code[0] === selectedCommune);

                                return (
                                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                        <div className={`p-3 rounded-lg text-center ${
                                            commune.dispose_slc?.[0] ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <h4 className="font-semibold text-sm">SLC Opérationnelle</h4>
                                            <p className="text-lg font-bold">
                                                {commune.dispose_slc?.[0] ? 'OUI' : 'NON'}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg text-center ${
                                            sacCommune?.dispose_sac?.[0] ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <h4 className="font-semibold text-sm">SAC Validé</h4>
                                            <p className="text-lg font-bold">
                                                {sacCommune?.dispose_sac?.[0] ? 'OUI' : 'NON'}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg text-center ${
                                            pdliiCommune?.dispose_pdlii?.[0] ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <h4 className="font-semibold text-sm">PDLII à jour</h4>
                                            <p className="text-lg font-bold">
                                                {pdliiCommune?.dispose_pdlii?.[0] ? 'OUI' : 'NON'}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg text-center ${
                                            bifCommune?.a_bif_fonctionnel?.[0] ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <h4 className="font-semibold text-sm">BIF Fonctionnel</h4>
                                            <p className="text-lg font-bold">
                                                {bifCommune?.a_bif_fonctionnel?.[0] ? 'OUI' : 'NON'}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg text-center ${
                                            actesCommune?.soumis_actes?.[0] ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <h4 className="font-semibold text-sm">Actes Soumis</h4>
                                            <p className="text-lg font-bold">
                                                {actesCommune?.soumis_actes?.[0] ? 'OUI' : 'NON'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Composant pour les cartes statistiques
function StatCard({title, value}: { title: string; value: string | number }) {
    return (
        <div className="p-3 bg-white rounded-lg shadow-sm text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-base sm:text-lg md:text-xl font-semibold">{value}</p>
        </div>
    );
}

// Bloc graphique responsive bien équilibré
function ChartBlock({title, children}: { title: string; children: React.ReactNode }) {
    return (
        <div
            className="w-full sm:max-w-sm flex-1 p-3 sm:p-4 border rounded-xl shadow-sm bg-white flex flex-col items-center">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-center">{title}</h3>
            {children}
        </div>
    );
}
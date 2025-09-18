'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/molécules/select';
import {Input} from '@/components/ui/atomes/input';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import {Alert, AlertDescription} from '@/components/ui/molécules/alert';
import {AlertCircle, MapPin} from 'lucide-react';
import {Button} from '@/components/ui/atomes/button';
import {useSession} from 'next-auth/react';
import {useGetEffectifTotalPopulation} from '@/services/api/commune/indic-demo-effec-commune.api';
import {CommunePopulationData, GetIndicateurCommuneParams} from '@/services/types/indic-commune.type';
import {getRegionsByProvinceCode, regionsData} from '@/lib/region';
import {provinces} from '@/lib/province';

// Définition des types pour l'état partagé
interface SharedStateType {
    selectedLocation: {
        province?: string;
        region?: string;
        commune_code?: string;
    };
    filteredCommunes: CommunePopulationData[];
}

// État partagé pour coordination entre DemoCOmTab et CarteCommune
export const sharedState: SharedStateType = {
    selectedLocation: {},
    filteredCommunes: []
};

export function DemoCOmTab() {
    const {data: session} = useSession();
    const userRole = session?.user?.role;
    const userCommuneCode = session?.user?.location?.commune_code as string | undefined;
    const userRegionCode = session?.user?.location?.region_code as string | undefined;
    const userProvinceCode = session?.user?.location?.province_code as string | undefined;
    const userDistrictCode = session?.user?.location?.district_code as string | undefined;

    console.log("communeneee", userCommuneCode)

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

    // Appel de l'API
    const {data, isLoading, isError} = useGetEffectifTotalPopulation(apiParams);

    // État pour le selected location (pour la carte)
    const [selectedLocation, setSelectedLocation] = useState<{
        commune_code?: string;
        region?: string;
        province?: string;
    }>({});

    // Dédupliquer les données de communes
    const getUniqueCommunes = useCallback((): CommunePopulationData[] => {
        if (!data?.communes) return [];

        const uniqueMap = new Map<string, CommunePopulationData>();
        data.communes.forEach(commune => {
            if (!uniqueMap.has(commune.commune_code)) {
                uniqueMap.set(commune.commune_code, commune);
            }
        });

        return Array.from(uniqueMap.values());
    }, [data?.communes]);

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

    // Mettre à jour les communes filtrées dans l'état partagé
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

    // Interfaces pour les données des graphiques
    interface PopulationGenderData {
        name: string;
        value: number;
        fill: string;
    }

    interface PopulationAgeData {
        age: string;
        population: number;
        fill: string;
    }

    interface DisabilityData {
        status: string;
        value: number;
        fill: string;
    }

    // Préparation des données pour les graphiques
    const preparePopulationByGenderData = (): PopulationGenderData[] => {
        if (!data?.summary) return [];
        return [
            {name: 'Hommes', value: data.summary.total_hommes[0], fill: '#0088FE'},
            {name: 'Femmes', value: data.summary.total_femmes[0], fill: '#00C49F'},
        ];
    };

    const preparePopulationByAgeData = (): PopulationAgeData[] => {
        if (!data?.summary) return [];
        return [
            {age: '0-5 ans', population: data.summary.total_moins_5_ans[0], fill: '#0088FE'},
            {age: '6-17 ans', population: data.summary.total_6_17_ans[0], fill: '#00C49F'},
            {age: '18-60 ans', population: data.summary.total_18_60_ans[0], fill: '#FFBB28'},
            {age: '60+ ans', population: data.summary.total_60_plus[0], fill: '#FF8042'},
        ];
    };

    const prepareDisabilityData = (): DisabilityData[] => {
        if (!data?.summary) return [];
        const withoutDisability = data.summary.total_population[0] - data.summary.total_handicap[0];
        return [
            {status: 'Sans handicap', value: withoutDisability, fill: '#0088FE'},
            {status: 'Avec handicap', value: data.summary.total_handicap[0], fill: '#FF8042'},
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
                selectedLocation: selectedLocation
            }
        });
        window.dispatchEvent(event);
    };

    // Préparer le texte du résumé
    const getSummaryText = () => {
        if (!data?.summary) return "Aucune donnée disponible";
        return `Population totale: ${data.summary.total_population[0].toLocaleString()} habitants`;
    };

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

    // États de chargement et d'erreur
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                        Chargement des données démographiques...
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

    if (!data?.summary && !data?.communes?.length) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                        Données démographiques
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
                    Tableau de bord démographique
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
                {renderFilters()}

                {/* Résumé des statistiques */}
                <div className="text-base md:text-lg font-medium text-center p-2 bg-gray-50 rounded-lg">
                    {getSummaryText()}
                </div>

                {/* État des données de base */}
                {data?.status_base_stats && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-center md:text-left mb-3">État des données de base:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard
                                title="Total des Communes"
                                value={data.status_base_stats.total_communes_registered[0]}
                            />
                            <StatCard
                                title="Communes avec données vérifiées"
                                value={data.status_base_stats.communes_base_completed[0]}
                            />
                            <StatCard
                                title="Taux de complétude"
                                value={`${data.status_base_stats.completion_rate[0]}%`}
                            />
                        </div>
                    </div>
                )}

                {/* Contenu principal - Statistiques */}
                <div className="flex flex-wrap gap-6 justify-center">
                    {/* Graphique par sexe */}
                    <ChartBlock title="Effectif de la population par sexe">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={preparePopulationByGenderData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {preparePopulationByGenderData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString()}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            {preparePopulationByGenderData().map((entry, index) => (
                                <div key={`detail-${index}`} className="flex items-center justify-between p-1">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2" style={{backgroundColor: entry.fill}}></div>
                                        <span>{entry.name}:</span>
                                    </div>
                                    <span className="font-semibold">{entry.value.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="col-span-1 sm:col-span-2 pt-2 mt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-semibold text-sm sm:text-base">
                                        {preparePopulationByGenderData().reduce((sum, entry) => sum + entry.value, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </ChartBlock>

                    {/* Graphique par âge */}
                    <ChartBlock title="Effectif de la population par tranche d'âge">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={preparePopulationByAgeData()}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="age" tick={{fontSize: 10}}/>
                                <YAxis
                                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString()}
                                    tick={{fontSize: 10}}/>
                                <Tooltip formatter={(value) => value.toLocaleString()}/>
                                <Bar dataKey="population" barSize={40}>
                                    {preparePopulationByAgeData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            {preparePopulationByAgeData().map((entry, index) => (
                                <div key={`detail-${index}`} className="flex items-center justify-between p-1">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2" style={{backgroundColor: entry.fill}}></div>
                                        <span>{entry.age}:</span>
                                    </div>
                                    <span className="font-semibold">{entry.population.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="col-span-1 sm:col-span-2 pt-2 mt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-semibold text-sm sm:text-base">
                                        {preparePopulationByAgeData().reduce((sum, entry) => sum + entry.population, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </ChartBlock>

                    {/* Graphique situation handicap */}
                    <ChartBlock title="Effectif des personnes en situation de handicap">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={prepareDisabilityData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    nameKey="status"
                                    label={({percent}) => `${(percent * 100).toFixed(1)}%`}
                                >
                                    {prepareDisabilityData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString()}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            {prepareDisabilityData().map((entry, index) => (
                                <div key={`detail-${index}`} className="flex items-center justify-between p-1">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2" style={{backgroundColor: entry.fill}}></div>
                                        <span>{entry.status}:</span>
                                    </div>
                                    <span className="font-semibold">{entry.value.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="col-span-1 sm:col-span-2 pt-2 mt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-semibold text-sm sm:text-base">
                                        {prepareDisabilityData().reduce((sum, entry) => sum + entry.value, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </ChartBlock>
                </div>
            </CardContent>
        </Card>
    );
}

// Composant pour les cartes statistiques
function StatCard({title, value}: { title: string; value: number | string }) {
    return (
        <div className="p-3 bg-white rounded-lg shadow-sm text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-base sm:text-lg md:text-xl font-semibold">{value.toLocaleString()}</p>
        </div>
    );
}

// Bloc graphique responsive
function ChartBlock({title, children}: { title: string; children: React.ReactNode }) {
    return (
        <div
            className="w-full sm:max-w-sm flex-1 p-3 sm:p-4 border rounded-xl shadow-sm bg-white flex flex-col items-center">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-center">{title}</h3>
            {children}
        </div>
    );
}
'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/molécules/select';
import {Input} from '@/components/ui/atomes/input';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import {Alert, AlertDescription} from '@/components/ui/molécules/alert';
import {AlertCircle, MapPin} from 'lucide-react';
import {Button} from '@/components/ui/atomes/button';
import {useSession} from 'next-auth/react';
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {
    useGetEffectifVisiteursTourisme,
    useGetNombreCheptels,
    useGetNombreMarches,
    useGetPourcentageCommunesAbattoirs,
    useGetPourcentageCommunesBarrages,
    useGetPourcentageEntreprisesCommerce,
    useGetPourcentageEntreprisesExtractives,
    useGetPourcentageEntreprisesIndustrielles,
    useGetProductionPeche,
    useGetProductionRiz,
    useGetProduitsAgricoles
} from '@/services/api/commune/indic-econ.api';
import {CommuneBase, GetIndicateurEcoParams} from '@/services/types/indic-econ.type';
import {getRegionsByProvinceCode, regionsData} from '@/lib/region';
import {provinces} from '@/lib/province';

// Définition des types pour l'état partagé
interface SharedStateType {
    selectedLocation: {
        province?: string;
        region?: string;
        commune_code?: string;
        district?: string;
    };
    filteredCommunes: CommuneBase[];
}

// État partagé pour la coordination avec la carte
export const ecoSharedState: SharedStateType = {
    selectedLocation: {},
    filteredCommunes: []
};

const StatCard = ({title, value}: { title: string; value: string | number }) => (
    <div
        className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
        <h4 className="text-sm font-medium text-gray-600 mb-3">{title}</h4>
        <p className="text-4xl font-black bg-gradient-to-br from-emerald-500 to-blue-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm">{value}</p>
    </div>
);

export function EcoComTab() {
    const {data: session} = useSession();
    const userRole = session?.user?.role;
    const userCommuneCode = session?.user?.location?.commune_code as string | undefined;
    const userRegionCode = session?.user?.location?.region_code as string | undefined;
    const userProvinceCode = session?.user?.location?.province_code as string | undefined;
    const userDistrictCode = session?.user?.location?.district_code as string | undefined;

    // État pour les onglets internes
    const [activeTab, setActiveTab] = useState<string>('tourisme');

    // États pour les filtres (simplifiés)
    const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
    const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
    const [selectedCommune, setSelectedCommune] = useState<string | undefined>(undefined);
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);

    // États pour la recherche (seulement pour région)
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    // Paramètres pour l'API avec gestion automatique selon le rôle
    const [apiParams, setApiParams] = useState<GetIndicateurEcoParams>(() => {
        const baseParams: GetIndicateurEcoParams = {annee: selectedYear};

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

    // Appels des API existants avec paramètres conditionnels
    const tourismData = useGetEffectifVisiteursTourisme(activeTab === 'tourisme' ? apiParams : undefined);
    const industrieData = useGetPourcentageEntreprisesIndustrielles(activeTab === 'industrie' ? apiParams : undefined);
    const commerceData = useGetPourcentageEntreprisesCommerce(activeTab === 'commerce' ? apiParams : undefined);
    const marchesData = useGetNombreMarches(activeTab === 'marches' ? apiParams : undefined);

    // Appels des API pour les nouveaux indicateurs
    const extractifData = useGetPourcentageEntreprisesExtractives(activeTab === 'extractif' ? apiParams : undefined);
    const barragesData = useGetPourcentageCommunesBarrages(activeTab === 'agriculture' ? apiParams : undefined);
    const produitsAgricolesData = useGetProduitsAgricoles(activeTab === 'agriculture' ? apiParams : undefined);
    const productionRizData = useGetProductionRiz(activeTab === 'agriculture' ? apiParams : undefined);
    const productionPecheData = useGetProductionPeche(activeTab === 'peche' ? apiParams : undefined);
    const cheptelsData = useGetNombreCheptels(activeTab === 'elevage' ? apiParams : undefined);
    const abattoirsData = useGetPourcentageCommunesAbattoirs(activeTab === 'elevage' ? apiParams : undefined);

    // État pour la position sélectionnée (pour la carte)
    const [selectedLocation, setSelectedLocation] = useState<{
        commune_code?: string;
        region?: string;
        province?: string;
    }>({});

    // Fonction pour obtenir les communes uniques selon l'onglet actif
    const getUniqueCommunes = useCallback((): CommuneBase[] => {
        let communes: CommuneBase[] = [];

        if (activeTab === 'tourisme') {
            communes = tourismData?.data?.communes || [];
        } else if (activeTab === 'industrie') {
            communes = industrieData?.data?.communes || [];
        } else if (activeTab === 'commerce') {
            communes = commerceData?.data?.communes || [];
        } else if (activeTab === 'marches') {
            communes = marchesData?.data?.communes || [];
        } else if (activeTab === 'extractif') {
            communes = extractifData?.data?.communes || [];
        } else if (activeTab === 'agriculture') {
            communes = barragesData?.data?.communes || produitsAgricolesData?.data?.communes || productionRizData?.data?.communes || [];
        } else if (activeTab === 'peche') {
            communes = productionPecheData?.data?.communes || [];
        } else if (activeTab === 'elevage') {
            communes = cheptelsData?.data?.communes || abattoirsData?.data?.communes || [];
        }

        // Dédupliquer les communes par code
        const uniqueMap = new Map<string, CommuneBase>();
        communes.forEach(commune => {
            const code = Array.isArray(commune.commune_code) ? commune.commune_code[0] : commune.commune_code;
            if (!uniqueMap.has(code)) {
                uniqueMap.set(code, commune);
            }
        });

        return Array.from(uniqueMap.values());
    }, [activeTab, tourismData, industrieData, commerceData, marchesData, extractifData, barragesData, produitsAgricolesData, productionRizData, productionPecheData, cheptelsData, abattoirsData]);

    // Effet pour définir les filtres par défaut en fonction du rôle de l'utilisateur
    useEffect(() => {
        const newParams: GetIndicateurEcoParams = {annee: selectedYear};

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
        ecoSharedState.selectedLocation = {...location};
    }, [selectedCommune, selectedRegion, selectedProvince]);

    // Mettre à jour les communes filtrées dans l'état partagé
    useEffect(() => {
        const uniqueCommunes = getUniqueCommunes();
        ecoSharedState.filteredCommunes = uniqueCommunes;
    }, [getUniqueCommunes]);

    // Liste des années disponibles
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

    // Gérer les changements de filtre
    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);

        const newParams: GetIndicateurEcoParams = {annee: newYear};

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
        const event = new CustomEvent('mapViewToggled', {
            detail: {
                selectedLocation: selectedLocation,
                source: 'economie'
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

    // Déterminer l'état de chargement selon l'onglet actif
    const getCurrentLoadingState = () => {
        switch (activeTab) {
            case 'tourisme':
                return tourismData.isLoading;
            case 'industrie':
                return industrieData.isLoading;
            case 'commerce':
                return commerceData.isLoading;
            case 'marches':
                return marchesData.isLoading;
            case 'extractif':
                return extractifData.isLoading;
            case 'agriculture':
                return barragesData.isLoading || produitsAgricolesData.isLoading || productionRizData.isLoading;
            case 'peche':
                return productionPecheData.isLoading;
            case 'elevage':
                return cheptelsData.isLoading || abattoirsData.isLoading;
            default:
                return false;
        }
    };

    // Déterminer l'état d'erreur selon l'onglet actif
    const getCurrentErrorState = () => {
        switch (activeTab) {
            case 'tourisme':
                return tourismData.isError;
            case 'industrie':
                return industrieData.isError;
            case 'commerce':
                return commerceData.isError;
            case 'marches':
                return marchesData.isError;
            case 'extractif':
                return extractifData.isError;
            case 'agriculture':
                return barragesData.isError || produitsAgricolesData.isError || productionRizData.isError;
            case 'peche':
                return productionPecheData.isError;
            case 'elevage':
                return cheptelsData.isError || abattoirsData.isError;
            default:
                return false;
        }
    };

    // Préparation des données pour les graphiques selon l'onglet actif
    const prepareChartData = () => {
        switch (activeTab) {
            case 'industrie': {
                if (!industrieData?.data?.summary) return [];
                return [
                    {
                        name: 'Entreprises industrielles',
                        value: industrieData.data.summary.total_entreprises_industrie[0],
                        fill: '#4CAF50'
                    },
                    {
                        name: 'Autres entreprises',
                        value: industrieData.data.summary.total_toutes_entreprises[0] - industrieData.data.summary.total_entreprises_industrie[0],
                        fill: '#FFA726'
                    }
                ];
            }

            case 'commerce': {
                if (!commerceData?.data?.summary) return [];
                return [
                    {
                        name: 'Entreprises commerciales',
                        value: commerceData.data.summary.total_entreprises_commerce[0],
                        fill: '#2196F3'
                    },
                    {
                        name: 'Autres entreprises',
                        value: commerceData.data.summary.total_toutes_entreprises[0] - commerceData.data.summary.total_entreprises_commerce[0],
                        fill: '#FF7043'
                    }
                ];
            }

            case 'marches': {
                if (!marchesData?.data?.summary) return [];
                return [
                    {
                        name: 'Communes avec marché',
                        value: marchesData.data.summary.nombre_communes_avec_marche[0],
                        fill: '#3F51B5'
                    },
                    {
                        name: 'Communes sans marché',
                        value: marchesData.data.summary.nombre_communes_total[0] - marchesData.data.summary.nombre_communes_avec_marche[0],
                        fill: '#E91E63'
                    }
                ];
            }

            case 'extractif': {
                if (!extractifData?.data?.summary) return [];
                return [
                    {
                        name: 'Entreprises extractives',
                        value: extractifData.data.summary.total_entreprises_extractives[0],
                        fill: '#795548'
                    },
                    {
                        name: 'Autres entreprises',
                        value: extractifData.data.summary.total_toutes_entreprises[0] - extractifData.data.summary.total_entreprises_extractives[0],
                        fill: '#607D8B'
                    }
                ];
            }

            case 'agriculture': {
                const data = [];
                if (barragesData?.data?.summary) {
                    data.push({
                        name: 'Communes avec barrages',
                        value: barragesData.data.summary.nombre_communes_avec_barrage[0],
                        fill: '#4CAF50'
                    });
                }
                if (produitsAgricolesData?.data?.summary) {
                    data.push({
                        name: 'Communes avec agriculture',
                        value: produitsAgricolesData.data.summary.nombre_communes_avec_agriculture[0],
                        fill: '#8BC34A'
                    });
                }
                if (productionRizData?.data?.summary) {
                    data.push({
                        name: 'Communes productrices de riz',
                        value: productionRizData.data.summary.nombre_communes_productrices_riz[0],
                        fill: '#CDDC39'
                    });
                }
                return data;
            }

            case 'peche': {
                if (!productionPecheData?.data?.summary) return [];
                return [
                    {
                        name: 'Communes avec pêche',
                        value: productionPecheData.data.summary.nombre_communes_avec_peche[0],
                        fill: '#00BCD4'
                    }
                ];
            }

            default:
                return [];
        }
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

    // Rendu du sélecteur d'onglets interne
    const renderTabSelector = () => (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <div className="relative overflow-x-auto pb-2">
                <TabsList className="inline-flex flex-nowrap w-auto min-w-full">
                    <TabsTrigger value="tourisme" className="whitespace-nowrap text-xs md:text-sm">
                        Tourisme
                    </TabsTrigger>
                    <TabsTrigger value="industrie" className="whitespace-nowrap text-xs md:text-sm">
                        Industrie
                    </TabsTrigger>
                    <TabsTrigger value="commerce" className="whitespace-nowrap text-xs md:text-sm">
                        Commerce
                    </TabsTrigger>
                    <TabsTrigger value="marches" className="whitespace-nowrap text-xs md:text-sm">
                        Marchés
                    </TabsTrigger>
                    <TabsTrigger value="extractif" className="whitespace-nowrap text-xs md:text-sm">
                        Extractif
                    </TabsTrigger>
                    <TabsTrigger value="agriculture" className="whitespace-nowrap text-xs md:text-sm">
                        Agriculture
                    </TabsTrigger>
                    <TabsTrigger value="peche" className="whitespace-nowrap text-xs md:text-sm">
                        Pêche
                    </TabsTrigger>
                    <TabsTrigger value="elevage" className="whitespace-nowrap text-xs md:text-sm">
                        Élevage
                    </TabsTrigger>
                </TabsList>
            </div>
        </Tabs>
    );

    // Rendu des statistiques générales selon l'onglet actif
    const renderStats = () => {
        if (getCurrentLoadingState()) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <Skeleton className="h-24"/>
                    <Skeleton className="h-24"/>
                    <Skeleton className="h-24"/>
                </div>
            );
        }

        switch (activeTab) {
            case 'tourisme':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Effectif de commune avec des activités touristiques"
                            value={tourismData?.data?.summary?.nombre_communes_avec_tourisme[0] || 0}
                        />
                        <StatCard
                            title="Total visiteurs"
                            value={tourismData?.data?.summary?.total_visiteurs[0]?.toLocaleString() || 0}
                        />
                        <StatCard
                            title="Moyenne par commune"
                            value={Math.round(tourismData?.data?.summary?.moyenne_visiteurs_par_commune[0] || 0)}
                        />
                    </div>
                );

            case 'industrie':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Effectif de commune avec des activités industrielles"
                            value={industrieData?.data?.summary?.nombre_communes_avec_industrie[0] || 0}
                        />
                        <StatCard
                            title="Effectif des entreprises industrielles"
                            value={industrieData?.data?.summary?.total_entreprises_industrie[0] || 0}
                        />
                        <StatCard
                            title="Effectif des individus exerçant dans les industries"
                            value={industrieData?.data?.summary?.total_entreprises_industrie[0] || 0}
                        />
                    </div>
                );

            case 'commerce':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Effectif de commune avec des activités commerciales"
                            value={commerceData?.data?.summary?.nombre_communes_avec_commerce[0] || 0}
                        />
                        <StatCard
                            title="Effectif des entreprises commerciales"
                            value={commerceData?.data?.summary?.total_entreprises_commerce[0] || 0}
                        />
                        <StatCard
                            title="Effectif des individus exerçant dans les commerces"
                            value={commerceData?.data?.summary?.total_entreprises_commerce[0] || 0}
                        />
                    </div>
                );

            case 'marches':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <StatCard
                            title="Effectif des communes avec marché"
                            value={marchesData?.data?.summary?.nombre_communes_avec_marche[0] || 0}
                        />
                        <StatCard
                            title="Communes sans marché"
                            value={(marchesData?.data?.summary?.nombre_communes_total[0] || 0) - (marchesData?.data?.summary?.nombre_communes_avec_marche[0] || 0)}
                        />
                    </div>
                );

            case 'extractif':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Effectif de commune avec des activités extractives"
                            value={extractifData?.data?.summary?.nombre_communes_avec_exploitation[0] || 0}
                        />
                        <StatCard
                            title="Effectif des entreprises extractives"
                            value={extractifData?.data?.summary?.total_entreprises_extractives[0] || 0}
                        />
                        <StatCard
                            title="Effectif des individus exerçant dans le secteur minier"
                            value={extractifData?.data?.summary?.total_entreprises_extractives[0] || 0}
                        />
                    </div>
                );

            case 'agriculture':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Effectif de commune avec des activités agricoles"
                            value={produitsAgricolesData?.data?.summary?.nombre_communes_avec_agriculture[0] || 0}
                        />
                        <StatCard
                            title="Pourcentage des Communes disposant de barrages fonctionnels"
                            value={`${barragesData?.data?.summary?.pourcentage_communes_avec_barrage[0]?.toFixed(2) || 0}%`}
                        />
                        <StatCard
                            title="Effectif des individus exerçant dans le secteur agricole"
                            value={produitsAgricolesData?.data?.summary?.total_effectif_personnes_agriculture?.[0] || 0}
                        />
                    </div>
                );

            case 'peche':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <StatCard
                            title="Effectif de commune avec des activités de pêche"
                            value={productionPecheData?.data?.summary?.nombre_communes_avec_peche?.[0] || 0}
                        />
                        <StatCard
                            title="Effectif des individus exerçant dans la pêche"
                            value={productionPecheData?.data?.summary?.total_effectif_personnes_peche?.[0] || 'N/A'}
                        />
                    </div>
                );

            case 'elevage':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            title="Effectif de commune avec des activités d'élevage"
                            value={cheptelsData?.data?.summary?.nombre_communes_avec_elevage[0] || 0}
                        />
                        <StatCard
                            title="Effectif des communes avec abattoirs"
                            value={abattoirsData?.data?.summary?.nombre_communes_avec_abattoirs || 0}
                        />
                        <StatCard
                            title="Effectif des individus exerçant dans l'élevage"
                            value={abattoirsData?.data?.summary?.nombre_communes_avec_abattoirs || 0}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    // Rendu du titre de graphique selon l'onglet actif
    const getChartTitle = () => {
        switch (activeTab) {
            case 'industrie':
                return 'Répartition des entreprises industrielles';
            case 'commerce':
                return 'Répartition des entreprises commerciales';
            case 'marches':
                return 'Répartition des marchés communaux';
            case 'extractif':
                return 'Répartition des entreprises extractives';
            case 'peche':
                return 'Activité de pêche par commune';
            default:
                return 'Données économiques';
        }
    };

    // Rendu du graphique selon l'onglet actif
    const renderChart = () => {
        // Exclure le tourisme ET l'élevage du rendu des graphiques
        if (activeTab === 'tourisme' || activeTab === 'elevage') {
            return null;
        }

        const data = prepareChartData();
        const isLoading = getCurrentLoadingState();
        const isError = getCurrentErrorState();

        if (isLoading) {
            return <Skeleton className="h-96 w-full"/>;
        }

        if (isError) {
            return (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertDescription>Erreur lors du chargement des données</AlertDescription>
                </Alert>
            );
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle>{getChartTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeTab === 'agriculture' ? (
                                <BarChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="value" name="Nombre de communes">
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}`, 'Nombre']}/>
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Rendu principal du composant
    return (
        <div className="space-y-6">
            {/* Messages d'erreur */}
            {getCurrentErrorState() && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertDescription>
                        Une erreur est survenue lors du chargement des données. Veuillez réessayer ultérieurement.
                    </AlertDescription>
                </Alert>
            )}

            {/* Filtres */}
            {renderFilters()}

            {/* Sélecteur d'onglets */}
            {renderTabSelector()}

            {/* Statistiques */}
            {renderStats()}

            {/* Graphique */}
            {renderChart()}

            {/* Mention pour indiquer l'emplacement sélectionné */}
            {Object.keys(selectedLocation).length > 0 && (
                <div className="text-sm text-gray-500 mt-4">
                    Données affichées pour : {' '}
                    {selectedLocation.commune_code ? 'Commune spécifique' :
                        selectedLocation.region ? `Région: ${selectedLocation.region}` :
                            selectedLocation.province ? `Province: ${selectedLocation.province}` : 'Toutes les communes'}
                </div>
            )}
        </div>
    );
}
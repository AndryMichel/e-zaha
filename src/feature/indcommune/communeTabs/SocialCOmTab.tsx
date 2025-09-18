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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {
    useGetPourcentagesCommunesAccessibles,
    useGetRatioCentresSante,
    useGetRatioColleges,
    useGetRatioEcolesPrimaires,
    useGetRatioLycees,
    useGetTauxAccesEauPotable,
    useGetTauxAccesElectricite
} from '@/services/api/commune/indic-social.api';
import {GetIndicateurSocialParams} from '@/services/types/indic-social.type';
import {getRegionsByProvinceCode, regionsData} from '@/lib/region';
import {provinces} from '@/lib/province';

// Définition des types pour l'état partagé
interface SharedStateType {
    selectedLocation: {
        province?: string;
        region?: string;
        commune_code?: string;
    };
    filteredCommunes: unknown[];
}

// État partagé pour la coordination avec la carte
export const socialSharedState: SharedStateType = {
    selectedLocation: {},
    filteredCommunes: []
};

// Composant de statistique générique
const StatCard = ({title, value}: { title: string; value: string | number }) => (
    <div className="bg-white p-4 rounded-lg shadow text-center">
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-xl font-semibold">{value}</p>
    </div>
);

export function SocialCOmTab() {
    const {data: session} = useSession();
    const userRole = session?.user?.role;
    const userCommuneCode = session?.user?.location?.commune_code as string | undefined;
    const userRegionCode = session?.user?.location?.region_code as string | undefined;
    const userProvinceCode = session?.user?.location?.province_code as string | undefined;
    const userDistrictCode = session?.user?.location?.district_code as string | undefined;

    // État pour les onglets internes
    const [activeTab, setActiveTab] = useState<string>('education');

    // États pour les filtres
    const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
    const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
    const [selectedCommune, setSelectedCommune] = useState<string | undefined>(undefined);
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);

    // États pour la recherche
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    // Paramètres pour l'API avec gestion automatique selon le rôle
    const [apiParams, setApiParams] = useState<GetIndicateurSocialParams>(() => {
        const baseParams: GetIndicateurSocialParams = {annee: selectedYear};

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

    // Appels des API existants
    const {
        data: ecolesPrimairesData,
        isLoading: isLoadingEcolesPrimaires,
        isError: isErrorEcolesPrimaires
    } = useGetRatioEcolesPrimaires(apiParams);

    const {
        data: collegesData,
        isLoading: isLoadingColleges,
        isError: isErrorColleges
    } = useGetRatioColleges(apiParams);

    const {
        data: lyceesData,
        isLoading: isLoadingLycees
    } = useGetRatioLycees(activeTab === 'education' ? apiParams : undefined);

    const {
        data: centresSanteData,
        isLoading: isLoadingCentresSante,
        isError: isErrorCentresSante
    } = useGetRatioCentresSante(activeTab === 'sante' ? apiParams : undefined);

    const {
        data: eauPotableData,
        isLoading: isLoadingEauPotable,
        isError: isErrorEauPotable
    } = useGetTauxAccesEauPotable(activeTab === 'eau' ? apiParams : undefined);

    // Nouveaux appels des API
    const {
        data: electriciteData,
        isLoading: isLoadingElectricite,
        isError: isErrorElectricite
    } = useGetTauxAccesElectricite(activeTab === 'electricite' ? apiParams : undefined);

    const {
        data: accessibiliteData,
        isLoading: isLoadingAccessibilite,
        isError: isErrorAccessibilite
    } = useGetPourcentagesCommunesAccessibles(activeTab === 'accessibilite' ? apiParams : undefined);

    // État pour la position sélectionnée (pour la carte)
    const [selectedLocation, setSelectedLocation] = useState<{
        commune_code?: string;
        region?: string;
        province?: string;
    }>({});

    // Effet pour définir les filtres par défaut en fonction du rôle de l'utilisateur
    useEffect(() => {
        const newParams: GetIndicateurSocialParams = {annee: selectedYear};

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

        // Mettre à jour l'état partagé pour CarteCommune
        socialSharedState.selectedLocation = {...location};
    }, [selectedCommune, selectedRegion, selectedProvince]);

    // Mettre à jour les communes filtrées dans l'état partagé
    useEffect(() => {
        // Utiliser les données pertinentes selon l'onglet actif
        let communes: unknown[] = [];

        if (activeTab === 'education') {
            communes = ecolesPrimairesData?.communes || [];
        } else if (activeTab === 'sante') {
            communes = centresSanteData?.communes || [];
        } else if (activeTab === 'eau') {
            communes = eauPotableData?.communes || [];
        } else if (activeTab === 'electricite') {
            communes = electriciteData?.communes || [];
        } else if (activeTab === 'accessibilite') {
            communes = accessibiliteData?.communes || [];
        }

        socialSharedState.filteredCommunes = communes;
    }, [activeTab, ecolesPrimairesData, centresSanteData, eauPotableData, electriciteData, accessibiliteData]);

    // Liste des années disponibles (de 2020 à l'année actuelle)
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

    // Gérer les changements de filtre
    const handleYearChange = (value: string) => {
        const newYear = parseInt(value);
        setSelectedYear(newYear);

        const newParams: GetIndicateurSocialParams = {annee: newYear};

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
        // Émettre un événement pour actualiser la carte basée sur la sélection actuelle
        const event = new CustomEvent('mapViewToggled', {
            detail: {
                selectedLocation: selectedLocation,
                source: 'social'
            }
        });
        window.dispatchEvent(event);
    };

    // Préparation des données pour les graphiques d'éducation
    const prepareEducationData = () => {
        if (!ecolesPrimairesData?.summary || !collegesData?.summary) return [];

        return [
            {
                name: 'Écoles primaires',
                value: ecolesPrimairesData.summary.total_ecoles_primaires[0],
                ratio: ecolesPrimairesData.summary.ratio_ecoles_pour_1000_enfants[0],
                fill: '#4CAF50'
            },
            {
                name: 'Collèges',
                value: collegesData.summary.total_colleges[0],
                ratio: collegesData.summary.ratio_colleges_pour_1000_enfants[0],
                fill: '#2196F3'
            },
            // Ajouter les lycées si disponibles
            ...(lyceesData?.summary ? [{
                name: 'Lycées',
                value: lyceesData.summary.total_lycees[0],
                ratio: lyceesData.summary.ratio_lycees_pour_1000_enfants[0],
                fill: '#9C27B0'
            }] : [])
        ];
    };

    // Préparation des données pour les graphiques de santé
    const prepareSanteData = () => {
        if (!centresSanteData?.summary) return [];

        return [
            {
                name: 'CSB1',
                value: centresSanteData.summary.total_csb1[0],
                fill: '#42A5F5'
            },
            {
                name: 'CSB2',
                value: centresSanteData.summary.total_csb2[0],
                fill: '#66BB6A'
            },
            {
                name: 'CHRD',
                value: centresSanteData.summary.total_chrd[0],
                fill: '#FFA726'
            },
            {
                name: 'CHRR',
                value: centresSanteData.summary.total_chrr[0],
                fill: '#EF5350'
            },
            {
                name: 'CHU',
                value: centresSanteData.summary.total_chu[0],
                fill: '#AB47BC'
            }
        ];
    };

    // Préparation des données pour les graphiques d'accès à l'eau
    const prepareEauData = () => {
        if (!eauPotableData?.summary) return [];

        return [
            {
                name: 'Borne fontaine',
                value: eauPotableData.summary.details_acces.total_borne_fontaine[0],
                fill: '#29B6F6'
            },
            {
                name: 'Forage',
                value: eauPotableData.summary.details_acces.total_forage[0],
                fill: '#26A69A'
            },
            {
                name: 'Branchement particulier',
                value: eauPotableData.summary.details_acces.total_branchement_particulier[0],
                fill: '#5C6BC0'
            },
            {
                name: 'Puits',
                value: eauPotableData.summary.autres_sources.total_puits[0],
                fill: '#D4E157'
            },
            {
                name: 'Eau de surface',
                value: eauPotableData.summary.autres_sources.total_eau_surface[0],
                fill: '#8D6E63'
            }
        ];
    };

    // Nouvelle fonction : Préparation des données pour les graphiques d'électricité
    const prepareElectriciteData = () => {
        if (!electriciteData?.summary) return [];

        return [
            {
                name: 'Réseau électrique',
                value: electriciteData.summary.details_acces.total_reseau_electrique[0],
                fill: '#FFD54F'
            },
            {
                name: 'Groupe électrogène',
                value: electriciteData.summary.details_acces.total_groupe_electrogene[0],
                fill: '#FF7043'
            },
            {
                name: 'Panneau solaire',
                value: electriciteData.summary.autres_sources.total_panneau_solaire[0],
                fill: '#FFCA28'
            },
            {
                name: 'Pétrole lampant',
                value: electriciteData.summary.autres_sources.total_petrole_lampant[0],
                fill: '#8D6E63'
            },
            {
                name: 'Autre source',
                value: electriciteData.summary.autres_sources.total_autre_source[0],
                fill: '#9E9E9E'
            }
        ];
    };

    // Nouvelle fonction : Préparation des données pour les graphiques d'accessibilité
    const prepareAccessibiliteData = () => {
        if (!accessibiliteData?.summary) return [];

        return [
            {
                name: 'Communes accessibles',
                value: accessibiliteData.summary.nombre_communes_accessibles[0],
                fill: '#4CAF50'
            },
            {
                name: 'Communes non accessibles',
                value: accessibiliteData.summary.nombre_communes_total[0] - accessibiliteData.summary.nombre_communes_accessibles[0],
                fill: '#F44336'
            }
        ];
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
                <MapPin className="mr-2"/>
                Voir sur la carte
            </Button>
        </div>
    );

    // Rendu des statistiques générales
    const renderStats = () => {
        if (activeTab === 'education') {
            if (isLoadingEcolesPrimaires || isLoadingColleges || isLoadingLycees) {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        title="Écoles Primaires"
                        value={ecolesPrimairesData?.summary?.total_ecoles_primaires[0] || 0}
                    />
                    <StatCard
                        title="Collèges"
                        value={collegesData?.summary?.total_colleges[0] || 0}
                    />
                    <StatCard
                        title="Lycées"
                        value={lyceesData?.summary?.total_lycees[0] || 0}
                    />
                </div>
            );
        } else if (activeTab === 'sante') {
            if (isLoadingCentresSante) {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        title="Centres de Santé"
                        value={centresSanteData?.summary?.total_centres_sante[0] || 0}
                    />
                    <StatCard
                        title="Ratio (pour 10 000 hab.)"
                        value={(centresSanteData?.summary?.ratio_centres_sante_pour_10000[0] || 0).toFixed(2)}
                    />
                    <StatCard
                        title="Population"
                        value={centresSanteData?.summary?.total_population[0]?.toLocaleString() || 0}
                    />
                </div>
            );
        } else if (activeTab === 'eau') {
            if (isLoadingEauPotable) {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        title="Ménages avec accès"
                        value={eauPotableData?.summary?.total_menages_acces_eau_potable[0] || 0}
                    />
                    <StatCard
                        title="Taux d'accès"
                        value={`${(eauPotableData?.summary?.taux_acces_eau_potable[0] || 0).toFixed(2)}%`}
                    />
                    <StatCard
                        title="Total ménages"
                        value={eauPotableData?.summary?.total_menages[0]?.toLocaleString() || 0}
                    />
                </div>
            );
        } else if (activeTab === 'electricite') {
            if (isLoadingElectricite) {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        title="Ménages avec électricité"
                        value={electriciteData?.summary?.total_menages_acces_electricite[0] || 0}
                    />
                    <StatCard
                        title="Taux d'accès"
                        value={`${(electriciteData?.summary?.taux_acces_electricite[0] || 0).toFixed(2)}%`}
                    />
                    <StatCard
                        title="Total ménages"
                        value={electriciteData?.summary?.total_menages[0]?.toLocaleString() || 0}
                    />
                </div>
            );
        } else if (activeTab === 'accessibilite') {
            if (isLoadingAccessibilite) {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                        <Skeleton className="h-24"/>
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        title="Communes accessibles"
                        value={accessibiliteData?.summary?.nombre_communes_accessibles[0] || 0}
                    />
                    <StatCard
                        title="Pourcentage d'accessibilité"
                        value={`${(accessibiliteData?.summary?.pourcentage_communes_accessibles[0] || 0).toFixed(2)}%`}
                    />
                    <StatCard
                        title="Total communes"
                        value={accessibiliteData?.summary?.nombre_communes_total[0] || 0}
                    />
                </div>
            );
        }

        return null;
    };

    // Rendu des graphiques
    const renderCharts = () => {
        if (activeTab === 'education') {
            const educationData = prepareEducationData();

            if (isLoadingEcolesPrimaires || isLoadingColleges || isLoadingLycees) {
                return <Skeleton className="h-80 w-full"/>;
            }

            if (isErrorEcolesPrimaires || isErrorColleges) {
                return (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            Une erreur est survenue lors du chargement des données éducatives.
                        </AlertDescription>
                    </Alert>
                );
            }

            return (
                <div className="mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Effectif des établissements scolaires par cycle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={educationData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="value">
                                        {educationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            );
        } else if (activeTab === 'sante') {
            const santeData = prepareSanteData();

            if (isLoadingCentresSante) {
                return <Skeleton className="h-80 w-full"/>;
            }

            if (isErrorCentresSante) {
                return (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            Une erreur est survenue lors du chargement des données de santé.
                        </AlertDescription>
                    </Alert>
                );
            }

            return (
                <div className="flex justify-center mb-6">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle className="text-center">Nombre de centre de santé par type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={santeData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="value">
                                        {santeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            );
        } else if (activeTab === 'eau') {
            const eauData = prepareEauData();

            if (isLoadingEauPotable) {
                return <Skeleton className="h-80 w-full"/>;
            }

            if (isErrorEauPotable) {
                return (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            Une erreur est survenue lors du chargement des données d&#39;accès à l&#39;eau.
                        </AlertDescription>
                    </Alert>
                );
            }

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Taux d&#39;accès aux infrastructures d&#39;eau</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={eauData.slice(0, 3)} // Seulement les sources d'eau potable
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {eauData.slice(0, 3).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Effectif de ménage ayant accès à l&#39;eau de boisson par types de sources
                                d&#39;eau</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={eauData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="value">
                                        {eauData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            );
        } else if (activeTab === 'electricite') {
            const electriciteDataChart = prepareElectriciteData();

            if (isLoadingElectricite) {
                return <Skeleton className="h-80 w-full"/>;
            }

            if (isErrorElectricite) {
                return (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            Une erreur est survenue lors du chargement des données d&#39;accès à l&#39;électricité.
                        </AlertDescription>
                    </Alert>
                );
            }

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Proportion de ménage par source d&#39;électricité</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={electriciteDataChart.slice(0, 2)} // Sources principales d'électricité
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {electriciteDataChart.slice(0, 2).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sources d&#39;électricité par type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={electriciteDataChart} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="value">
                                        {electriciteDataChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            );
        } else if (activeTab === 'accessibilite') {
            const accessibiliteDataChart = prepareAccessibiliteData();

            if (isLoadingAccessibilite) {
                return <Skeleton className="h-80 w-full"/>;
            }

            if (isErrorAccessibilite) {
                return (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            Une erreur est survenue lors du chargement des données d&#39;accessibilité.
                        </AlertDescription>
                    </Alert>
                );
            }

            return (
                <div className="flex justify-center mb-6">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle className="text-center">Accessibilité des communes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={accessibiliteDataChart}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {accessibiliteDataChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return null;
    };

    // Composant principal
    return (
        <div className="w-full space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="education">Éducation</TabsTrigger>
                    <TabsTrigger value="sante">Santé</TabsTrigger>
                    <TabsTrigger value="eau">Eau Potable</TabsTrigger>
                    <TabsTrigger value="electricite">Électricité</TabsTrigger>
                    <TabsTrigger value="accessibilite">Accessibilité</TabsTrigger>
                </TabsList>

                <TabsContent value="education" className="space-y-4">
                    {renderFilters()}
                    {renderStats()}
                    {renderCharts()}
                </TabsContent>

                <TabsContent value="sante" className="space-y-4">
                    {renderFilters()}
                    {renderStats()}
                    {renderCharts()}
                </TabsContent>

                <TabsContent value="eau" className="space-y-4">
                    {renderFilters()}
                    {renderStats()}
                    {renderCharts()}
                </TabsContent>

                <TabsContent value="electricite" className="space-y-4">
                    {renderFilters()}
                    {renderStats()}
                    {renderCharts()}
                </TabsContent>

                <TabsContent value="accessibilite" className="space-y-4">
                    {renderFilters()}
                    {renderStats()}
                    {renderCharts()}
                </TabsContent>
            </Tabs>

            {/* Note explicative */}
            <Card className="bg-gray-50">
                <CardContent className="pt-4">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5"/>
                        <p className="text-sm text-gray-600">
                            Les données présentées sont basées sur les informations collectées au niveau communal.
                            Utilisez les filtres pour affiner l&#39;analyse par année, région ou province.
                            Cliquez sur Voir sur la carte pour visualiser la répartition géographique.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
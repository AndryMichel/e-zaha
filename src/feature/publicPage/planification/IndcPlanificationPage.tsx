'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Alert, AlertDescription} from '@/components/ui/molécules/alert';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import {AlertCircle, Info} from 'lucide-react';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import {
    useGetPourcentageCommunesPDLIIPublic,
    useGetPourcentageRegionsPrdAJourPublic,
    useGetPourcentageRegionsSratClimatPublic,
    useGetProportionCommunesSACPublic
} from "@/services/api/commune/indic-planification.api";

// Composant pour afficher un cercle de pourcentage
function PercentageCircle({percentage, color}: { percentage: number, color: string }) {
    const circumference = 2 * Math.PI * 60;
    const strokeDashoffset = circumference * (1 - percentage / 100);

    return (
        <div className="flex justify-center items-center relative">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="transparent"
                    stroke="#e6e6e6"
                    strokeWidth="12"
                />
                <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transform -rotate-90 origin-center"
                />
            </svg>
            <div className="absolute text-2xl font-bold">{percentage.toFixed(1)}%</div>
        </div>
    );
}

export function IndcPlanificationPage() {
    // Utilisation de l'année actuelle
    const currentYear = new Date().getFullYear();

    // Paramètres pour les API - année actuelle uniquement
    const apiParams = {
        annee: currentYear
    };

    // Appels des API publiques
    const pdliiData = useGetPourcentageCommunesPDLIIPublic(apiParams);
    const sacData = useGetProportionCommunesSACPublic(apiParams);
    const sratClimatData = useGetPourcentageRegionsSratClimatPublic(apiParams);
    const prdAJourData = useGetPourcentageRegionsPrdAJourPublic(apiParams);

    // Vérifier les états de chargement et d'erreurs
    const isLoading = pdliiData.isLoading || sacData.isLoading || sratClimatData.isLoading || prdAJourData.isLoading;
    const hasError = pdliiData.isError || sacData.isError || sratClimatData.isError || prdAJourData.isError;
    const hasNoData = (!pdliiData.data && !sacData.data && !sratClimatData.data && !prdAJourData.data) && !isLoading;

    // Message d'absence de données
    const noDataMessage = "Aucune donnée disponible pour les critères sélectionnés.";

    // Fonctions pour récupérer les données de manière sécurisée
    const safeGetPourcentagePDLII = () => {
        return pdliiData.data?.summary?.pourcentage_communes_pdlii?.[0] || 0;
    };

    const safeGetProportionSAC = () => {
        return sacData.data?.summary?.proportion_communes_sac?.[0] || 0;
    };

    const safeGetPourcentageSratClimat = () => {
        return sratClimatData.data?.pourcentage_regions_srat_climat?.[0] || 0;
    };

    const safeGetPourcentagePrdAJour = () => {
        return prdAJourData.data?.pourcentage_regions_prd_a_jour?.[0] || 0;
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Indicateurs de Planification"
                subtitle="Visualisation des indicateurs clés pour mesurer la qualité de la planification au niveau communal et régional"
            />

            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Message d'erreur */}
                    {hasError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>
                                Une erreur est survenue lors du chargement des données. Veuillez réessayer.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Message d'absence de données */}
                    {!isLoading && !hasError && hasNoData && (
                        <Alert className="mb-6">
                            <Info className="h-4 w-4"/>
                            <AlertDescription>
                                {noDataMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Grille des indicateurs sans sections séparées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Proportion des communes disposant des SAC validés et mis en œuvre */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.1}}
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                            SAC-01
                                        </span>
                                        Proportion de communes disposant des SAC validés et mis en œuvre
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {sacData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !sacData.data ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle percentage={safeGetProportionSAC()} color="#0088FE"/>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                des communes disposent des SAC validés et mis en œuvre
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p className="mt-2 text-xs italic">Existence d&#39;outils de
                                                    planification
                                                    (SAC/PUDi/PUDé/SAIC) validés et mis en œuvre</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pourcentage de Communes disposant de PDLII à jour */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                            PDLII-01
                                        </span>
                                        Pourcentage de Communes disposant de PDLII à jour
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pdliiData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !pdliiData.data ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle percentage={safeGetPourcentagePDLII()}
                                                              color="#00C49F"/>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                des communes disposent de PDLII à jour
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p className="mt-2 text-xs italic">Existence PDLII à jour</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pourcentage de régions avec SRAT intégrant le climat */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.3}}
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                                            SRAT-01
                                        </span>
                                        Pourcentage de régions disposant de SRAT
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {sratClimatData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !sratClimatData.data ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle percentage={safeGetPourcentageSratClimat()}
                                                              color="#FF8042"/>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                des régions disposent de SRAT intégrant le climat
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p className="mt-2 text-xs italic">Existence de SRAT intégrant les
                                                    aspects climatiques</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pourcentage de régions avec PRD à jour */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.4}}
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                                            PRD-01
                                        </span>
                                        Pourcentage de régions avec PRD à jour
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {prdAJourData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !prdAJourData.data ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle percentage={safeGetPourcentagePrdAJour()}
                                                              color="#8884D8"/>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                des régions disposent de PRD à jour
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p className="mt-2 text-xs italic">Existence de Plan Régional de
                                                    Développement à jour</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
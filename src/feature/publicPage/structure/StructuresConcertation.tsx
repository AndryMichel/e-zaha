'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Alert, AlertDescription} from '@/components/ui/molécules/alert';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import {AlertCircle, Info} from 'lucide-react';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import {
    useGetPourcentageCommunesSLCPublic,
    useGetPourcentageRegionsSrcOperationnellePublic
} from "@/services/api/commune/indic-structure-concertation";


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

export function StructuresConcertation() {
    // Utilisation de l'année actuelle
    const currentYear = new Date().getFullYear();

    // Paramètres pour les API - année actuelle uniquement
    const apiParams = {
        annee: currentYear
    };

    // Appels des API publiques
    const slcData = useGetPourcentageCommunesSLCPublic(apiParams);
    const srcData = useGetPourcentageRegionsSrcOperationnellePublic(apiParams);

    // Vérifier les états de chargement et d'erreurs
    const isLoading = slcData.isLoading || srcData.isLoading;
    const hasError = slcData.isError || srcData.isError;
    const hasNoData = (!slcData.data && !srcData.data) && !isLoading;

    // Message d'absence de données
    const noDataMessage = "Aucune donnée disponible pour les critères sélectionnés.";

    // Fonctions pour récupérer les données de manière sécurisée
    const safeGetPourcentageSLC = () => {
        return slcData.data?.summary?.pourcentage_communes_slc?.[0] || 0;
    };

    const safeGetCommunesSLC = () => {
        return slcData.data?.summary?.nombre_communes_avec_slc?.[0] || 0;
    };

    const safeGetTotalCommunesSLC = () => {
        return slcData.data?.summary?.nombre_communes_total?.[0] || 0;
    };

    const safeGetPourcentageSRC = () => {
        return srcData.data?.pourcentage_regions_avec_src?.[0] || 0;
    };

    const safeGetRegionsSRC = () => {
        return srcData.data?.regions_avec_src?.[0] || 0;
    };

    const safeGetTotalRegionsSRC = () => {
        return srcData.data?.total_regions?.[0] || 0;
    };


    // // Préparer le texte du résumé
    // const getSummaryText = () => {
    //     // return `Structures de concertation pour Madagascar en ${currentYear}`;
    // };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Structures de Concertation"
                subtitle="Visualisation des indicateurs clés pour mesurer la mise en place des structures de concertation au niveau communal et régional"
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

                    {/*/!* Résumé *!/*/}
                    {/*<div className="text-base md:text-lg font-medium text-center p-2 bg-gray-50 rounded-lg mb-6">*/}
                    {/*    {getSummaryText()}*/}
                    {/*</div>*/}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Proportion des communes disposant des SLC */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.1}}
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-red-100 text-red-800 px-2 py-1 rounded mr-2">
                                            SLC-01
                                        </span>
                                        Pourcentage de communes disposant une SLC opérationnelle
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {slcData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !slcData.data ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle percentage={safeGetPourcentageSLC()} color="#FF6B6B"/>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                des communes disposent de Structures Locales de Concertation
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p>• Nombre de communes avec SLC: {safeGetCommunesSLC()}</p>
                                                <p>• Nombre total des communes: {safeGetTotalCommunesSLC()}</p>
                                                <p className="mt-2 text-xs italic">Existence de structures locales de
                                                    concertation fonctionnelles au niveau communal</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Proportion des régions avec SRC opérationnel */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded mr-2">
                                            SRC-01
                                        </span>
                                        Pourcentage de Régions disposant une SRC opérationnelle
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {srcData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !srcData.data ? (
                                        <p className="text-sm text-gray-500">Données non disponibles</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle percentage={safeGetPourcentageSRC()} color="#4ECDC4"/>
                                            <p className="text-sm text-gray-600 mt-4 text-center">
                                                des régions disposent d&#39;un SRC opérationnel
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p>• Nombre de régions avec SRC opérationnel: {safeGetRegionsSRC()}</p>
                                                <p>• Nombre total des régions: {safeGetTotalRegionsSRC()}</p>
                                                <p className="mt-2 text-xs italic">Existence de structures régionales de
                                                    concertation opérationnelles</p>
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
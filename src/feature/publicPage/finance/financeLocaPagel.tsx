'use client';

import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Alert, AlertDescription} from '@/components/ui/molécules/alert';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {AlertCircle, Info} from 'lucide-react';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import {
    useGetPourcentageCommunesEfficienceRhPublic,
    useGetPourcentageCommunesInvestissementPublic
} from "@/services/api/oddl/indic-finance-local.api";
import {getPercentageColor, getPerformanceLevel} from "@/lib/color-number";

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

export function FinanceLocalPage() {
    // État pour l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        return new Date().getFullYear();
    });

    // Liste des années disponibles (de 2020 à l'année actuelle)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2019}, (_, i) => currentYear - i);

    // Paramètres pour les API
    const apiParams = {
        annee: selectedYear
    };

    // Appels des API publiques
    const investissementData = useGetPourcentageCommunesInvestissementPublic(apiParams);
    const efficienceRhData = useGetPourcentageCommunesEfficienceRhPublic(apiParams);

    // Vérifier les états de chargement et d'erreurs
    const isLoading = investissementData.isLoading || efficienceRhData.isLoading;
    const hasError = investissementData.isError || efficienceRhData.isError;
    const hasNoData = (!investissementData.data && !efficienceRhData.data) && !isLoading;

    // Fonctions pour récupérer les données de manière sécurisée - Investissement
    const safeGetPourcentageInvestissement = () => {
        return investissementData.data?.data?.pourcentage_communes_investissement_15_plus?.[0] || 0;
    };

    const safeGetCommunesInvestissement = () => {
        return investissementData.data?.data?.communes_invest_15_plus?.[0] || 0;
    };

    const safeGetTotalCommunesInvestissement = () => {
        return investissementData.data?.data?.total_communes?.[0] || 0;
    };

    // Fonctions pour récupérer les données de manière sécurisée - Efficience RH
    const safeGetPourcentageEfficienceRh = () => {
        return efficienceRhData.data?.data?.pourcentage_communes_efficience_rh_sup_50?.[0] || 0;
    };

    const safeGetCommunesEfficienceRh = () => {
        return efficienceRhData.data?.data?.communes_efficience_rh_sup_50?.[0] || 0;
    };

    const safeGetTotalCommunesEfficienceRh = () => {
        return efficienceRhData.data?.data?.total_communes?.[0] || 0;
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Indicateurs de Finances Locales"
                subtitle="Visualisation des indicateurs clés pour mesurer la performance financière au niveau communal"
            />

            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Sélecteur d'année */}
                    <div className="flex justify-end mb-6">
                        <Select
                            value={selectedYear.toString()}
                            onValueChange={(value) => setSelectedYear(parseInt(value))}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sélectionner l'année"/>
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
                                Aucune donnée financière disponible pour l&#39;année {selectedYear}.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Investissement sur recettes propres */}
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
                                            INV
                                        </span>
                                        Pourcentage de communes ayant un taux d&#39;investissement sur recettes propres
                                        supérieur ou égal à 15%
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {investissementData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !investissementData.data ? (
                                        <p className="text-sm text-gray-500">Aucune donnée d&#39;investissement
                                            disponible pour l&#39;année {selectedYear}</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle
                                                percentage={safeGetPourcentageInvestissement()}
                                                color="#3b82f6"
                                            />
                                            <div className="flex items-center gap-3 mt-4">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageInvestissement()).bg} ${getPercentageColor(safeGetPourcentageInvestissement()).text} ${getPercentageColor(safeGetPourcentageInvestissement()).border} border`}>
                                                    {getPerformanceLevel(safeGetPourcentageInvestissement())}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 text-center">
                                                des communes investissent au moins 15% de leurs recettes propres
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p>• Communes avec investissement ≥
                                                    15%: {safeGetCommunesInvestissement()}</p>
                                                <p>• Total des communes
                                                    évaluées: {safeGetTotalCommunesInvestissement()}</p>
                                                <p className="mt-2 text-xs italic">
                                                    Mesure la capacité d&#39;investissement des communes par rapport à
                                                    leurs ressources propres
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Efficience RH */}
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                        >
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-start">
                                        <span
                                            className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                                            RH
                                        </span>
                                        Pourcentage de communes ayant un ratio d&#39;efficience des RH supérieur ou égal
                                        à 50%
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {efficienceRhData.isLoading ? (
                                        <Skeleton className="h-40 w-full"/>
                                    ) : !efficienceRhData.data ? (
                                        <p className="text-sm text-gray-500">Aucune donnée d&#39;efficience RH
                                            disponible pour l&#39;année {selectedYear}</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <PercentageCircle
                                                percentage={safeGetPourcentageEfficienceRh()}
                                                color="#10b981"
                                            />
                                            <div className="flex items-center gap-3 mt-4">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-medium ${getPercentageColor(safeGetPourcentageEfficienceRh()).bg} ${getPercentageColor(safeGetPourcentageEfficienceRh()).text} ${getPercentageColor(safeGetPourcentageEfficienceRh()).border} border`}>
                                                    {getPerformanceLevel(safeGetPourcentageEfficienceRh())}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 text-center">
                                                des communes ont une efficience des RH ≥ 50%
                                            </p>
                                            <div className="text-sm text-gray-500 mt-4">
                                                <p>• Communes avec efficience RH ≥
                                                    50%: {safeGetCommunesEfficienceRh()}</p>
                                                <p>• Total des communes
                                                    évaluées: {safeGetTotalCommunesEfficienceRh()}</p>
                                                <p className="mt-2 text-xs italic">
                                                    Ratio entre charges de personnel et dépenses de fonctionnement (≥
                                                    50% = forte allocation aux RH)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Analyse comparative */}
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                    >
                        
                    </motion.div>

                    {/* Légende des couleurs */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Échelle de performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <div>
                                        <p className="font-medium text-red-600">Faible</p>
                                        <p className="text-xs text-gray-500">0 - 25%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <div>
                                        <p className="font-medium text-orange-600">Modéré</p>
                                        <p className="text-xs text-gray-500">25 - 50%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <div>
                                        <p className="font-medium text-yellow-600">Bon</p>
                                        <p className="text-xs text-gray-500">50 - 75%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <div>
                                        <p className="font-medium text-green-600">Excellent</p>
                                        <p className="text-xs text-gray-500">75 - 100%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
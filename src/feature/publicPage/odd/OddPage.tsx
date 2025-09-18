"use client";

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {motion} from '@/components/ui/templates/motion';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import {Button} from "@/components/ui/atomes/button";
import {Tabs, TabsContent} from "@/components/ui/molécules/tabs";
import {oddSeizePublicApi} from "@/services/api/oddl/get-odd-seize-public.api";
import {OddSeize} from "@/services/types/odd-seize.type";

// Indicateurs ODD 16 avec leurs codes de référence
const ODD_INDICATORS = {
    proportion_jeunes_femmes_hommes_violences_sexuelles: {
        label: "Violences basées sur le genre",
        code: "16.2.3",
        description: "Proportion de jeunes femmes de 18 à 29 ans ayant été victimes de violences sexuelles avant l'âge de 18 ans",
        unit: "%"
    },
    proportion_victimes_signalees_violences: {
        label: "Victimes signalées",
        code: "16.3.1",
        description: "Proportion des victimes de violences au cours des 12 mois précédent l’enquête, ayants signalé les faits aux autorités compétentes ou à d’autres mécanismes de règlement des différends officiellement reconnus",
        unit: "%"
    },
    proportion_population_carcérale_instance_jugement: {
        label: "Population carcérale sans jugement",
        code: "16.3.2",
        description: "Proportion de la population carcérale en instance de jugement",
        unit: "%"
    },
    nombre_vindictes_populaires: {
        label: "Vindictes populaires",
        code: "16.3.3",
        description: "Nombre de vindictes populaires enregistrés",
        unit: ""
    },
    valeur_flux_financiers_illicites: {
        label: " Valeur totale des flux financiers illicites (en Ariary)",
        code: "16.4.1",
        description: "Valeur totale des flux financiers illicites",
        unit: "Ar"
    },
    indice_perception_corruption: {
        label: "Indice de perception de la corruption",
        code: "16.5.3",
        description: "Indice de Perception à la Corruption",
        unit: ""
    },
    proportion_population_satisfaction_services_publics: {
        label: "Satisfaction aux services publics",
        code: "16.6.2",
        description: "Proportion de la population dont la dernière expérience avec les services publics a été satisfaisante",
        unit: "%"
    },
    repartition_postes_publics_sexe_âge_handicap: {
        label: "Enregistrement à l’état civil",
        code: "16.9.1",
        description: "Taux d'enregistrement des naissances",
        unit: "%"
    },
    proportion_population_prise_decisions_ouverte_reactive: {
        label: "Nombre de SLC",
        code: "16.7.2",
        description: "Nombre de Structures Locales de Concertation",
        unit: ""
    }
};

export const OddPage = () => {
    const [data, setData] = useState<OddSeize[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [, setActiveView] = useState('cards');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all data without pagination using the public API
                const response = await oddSeizePublicApi.getAllOddSeizePublic({
                    sort_by: "id_odds_16",
                    order: "asc"
                });

                setData(response.data);
                setError(null);
            } catch (err) {
                console.error("Erreur lors du chargement des données ODD16:", err);
                setError("Impossible de charger les données. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const getLatestData = () => {
        if (data.length === 0) return null;

        // Trier les données par date de création (du plus récent au plus ancien)
        const sortedData = [...data].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        return sortedData[0];
    };

    const latestData = getLatestData();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données ODD16...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 hover:bg-blue-600"
                    >
                        Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="ODD 16 – Paix, Justice et Institutions efficaces"
                subtitle="Visualisation des indicateurs clés pour suivre les objectifs de développement durable"
            />

            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-8">
                        <Tabs defaultValue="cards" onValueChange={setActiveView} className="w-full">

                            {/* Vue Cartes */}
                            <TabsContent value="cards">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {latestData && Object.entries(ODD_INDICATORS).map(([key, info], index) => {
                                        const value = latestData[key as keyof OddSeize];
                                        // Skip if no data
                                        if (value === undefined || value === null) return null;

                                        return (
                                            <motion.div
                                                key={key}
                                                initial={{opacity: 0, y: 30}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{delay: index * 0.1}}
                                            >
                                                <Card
                                                    className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-lg font-bold flex items-start">
                              <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                {info.code}
                              </span>
                                                            {info.label}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-gray-600 text-sm mb-4">{info.description}</p>
                                                        <div className="flex items-end justify-between">
                                                            <div className="text-3xl font-bold text-blue-700">
                                                                {key === 'valeur_flux_financiers_illicites'
                                                                    ? (Number(value) / 1_000_000_000).toFixed(1) + ' Mds'
                                                                    : value}
                                                                <span className="ml-1 text-lg">{info.unit}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Dernière mise à
                                                                jour: {new Date(latestData.updated_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OddPage;
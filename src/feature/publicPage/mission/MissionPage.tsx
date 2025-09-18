"use client"

import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";


export const MissionPage = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Section with Title and Subtitle */}
            <PageHeaderMenu
                title="Nos Missions"
                subtitle="Découvrez nos missions et nos initiatives pour un développement durable et équilibré à
                                Madagascar."
            />

            {/* ODDL Section - Avec plus d'animations */}
            <section className="py-24 bg-gray-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            Observatoire de la Décentralisation et du Développement Local (ODDL)
                        </h2>
                        <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                            Notre observatoire est au cœur de l&#39;analyse et du suivi des politiques de
                            décentralisation à Madagascar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div
                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-6">Mission Principale</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Assurer l&#39;analyse, la capitalisation et la valorisation des résultats des études et
                                recherches réalisées,
                                du suivi et l&#39;évaluation de la mise en œuvre de la politique de Décentralisation et
                                son impact sur les
                                indicateurs de développement socio-économique et ainsi que les résultats et les
                                expériences des différents
                                programmes d&#39;appui à la Décentralisation et du Développement Local.
                            </p>
                        </div>

                        <div

                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-6">Activités</h3>
                            <ul className="space-y-4 text-lg text-gray-700">
                                {[
                                    "Gestion et exploitation des Bases de Données sur les Collectivités Territoriales Décentralisées (CTDs)",
                                    "Pilotage de la réalisation de l'Evaluation de la Gouvernance Locale via l'outil IGL",
                                    "Analyse de la Finance Locale",
                                    "Appui à la mise en place et l'opérationnalisation des Centres Régionaux d'Observation et de Communication (CROCs)",
                                    "Appui à la mise en place du système de suivi et évaluation de la Décentralisation et du Développement Local (SSE/DDL)"
                                ].map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{opacity: 0, x: 20}}
                                        whileInView={{opacity: 1, x: 0}}
                                        viewport={{once: true}}
                                        transition={{duration: 0.5, delay: 0.2 + (index * 0.1)}}
                                        className="flex items-start"
                                    >
                                        <span className="text-gray-900 mr-2">•</span>
                                        <span>{activity}</span>
                                    </motion.div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CROC Section - Avec plus d'animations */}
            <section className="py-5 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            Centres Régionaux d&#39;Observation et de Communication (CROCs)
                        </h2>
                        <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                            Centres de ressources, de collecte de données sur la Décentralisation et le Développement
                            Local
                            et d&#39;appui aux acteurs locaux de développement, placés au niveau des 23 régions.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                title: "Composition",
                                content: [
                                    "Un documentaliste",
                                    "Un responsable de communication",
                                    "Un responsable de base des données",
                                    "Un responsable de suivi et évaluation"
                                ],
                                type: "list"
                            },
                            {
                                title: "Mission Principale",
                                content: "Outiller les responsables régionaux (Gouverneur, Directeurs, Chefs de Service) et tous les autres acteurs (sectoriels, territoriaux) dans l'accomplissement efficacement de leurs missions, à travers le développement et la valorisation du système de suivi et évaluation de la DDL.",
                                type: "text"
                            },
                            {
                                title: "Couverture",
                                content: "23",
                                subtext: "Régions à travers Madagascar",
                                type: "number"
                            }
                        ].map((box, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 30}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{duration: 0.6, delay: 0.2 + (index * 0.2)}}
                                whileHover={{scale: 1.03}}
                                className="bg-gray-100 p-8 rounded-lg shadow-lg"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{box.title}</h3>

                                {box.type === "list" && (
                                    <ul className="space-y-3 text-gray-700">
                                        {Array.isArray(box.content) &&
                                            box.content.map((item, itemIndex) => (
                                                <motion.div key={itemIndex} /* ... */>
                                                    <span className="text-gray-900 mr-2">•</span>
                                                    <span>{item}</span>
                                                </motion.div>
                                            ))
                                        }

                                    </ul>
                                )}

                                {box.type === "text" && (
                                    <p className="text-gray-700">{box.content}</p>
                                )}

                                {box.type === "number" && (
                                    <>
                                        <motion.div
                                            className="flex items-center justify-center"
                                            initial={{scale: 0}}
                                            whileInView={{scale: 1}}
                                            viewport={{once: true}}
                                            transition={{duration: 0.5, delay: 0.5, type: "spring"}}
                                        >
                                            <div
                                                className="bg-gray-200 rounded-full h-32 w-32 flex items-center justify-center shadow-inner">
                                                <span className="text-4xl font-bold text-gray-700">{box.content}</span>
                                            </div>
                                        </motion.div>
                                        <p className="text-gray-700 mt-4 text-center">{box.subtext}</p>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8, delay: 0.4}}
                    >
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">Activités des CROCs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                [
                                    "Collecte et analyse des données, des résultats de capitalisation et des initiatives en matière de DDL",
                                    "Collecte et saisie des documents budgétaires (états financiers) des Communes",
                                    "Transfert des informations et données collectées et de l'analyse effectuée auprès de l'ODDL après la validation du Gouverneur"
                                ],
                                [
                                    "Accompagnement des Communes à la réalisation de l'auto-évaluation IGL",
                                    "Communication des toutes les informations relatives au développement de leur territoire",
                                    "Prospection des partenaires locaux"
                                ]
                            ].map((columnItems, colIndex) => (
                                <ul key={colIndex} className="space-y-4 text-lg text-gray-700">
                                    {columnItems.map((item, itemIndex) => (
                                        <motion.div
                                            key={itemIndex}
                                            initial={{opacity: 0, x: colIndex === 0 ? -20 : 20}}
                                            whileInView={{opacity: 1, x: 0}}
                                            viewport={{once: true}}
                                            transition={{duration: 0.5, delay: 0.2 + (itemIndex * 0.15)}}
                                            className="flex items-start"
                                        >
                                            <span className="text-gray-900 mr-2">•</span>
                                            <span>{item}</span>
                                        </motion.div>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* CROC Section - Avec plus d'animations */}
            <section className="py-5 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            Centres des Ressources (CR)
                        </h2>
                        <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                            Centres de ressources, de collecte de données sur la Décentralisation et le Développement
                            Local
                            et d&#39;appui aux acteurs locaux de développement, placés au niveau de chaque District.
                        </p>
                    </motion.div>


                </div>
            </section>


        </div>
    );
};

export default MissionPage;
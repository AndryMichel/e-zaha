"use client"

import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import {Building2, FileText, Landmark, Scale, Users} from 'lucide-react';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import Image from "next/image";

export const JuridiquePage = () => {
    const legalFrameworkSections = [
        {
            icon: Scale,
            title: "Missions de l'ODDL",
            description: [
                "La collecte, l’analyse et la diffusion des données sur les collectivités territoriales décentralisés et domaines connexes",
                "La  production, la capitalisation et la valorisation des informations, des connaissances, des réflexions sur la décentralisation et  le développement local",
                "La réalisation des études thématiques sur les problématiques clés et l'amélioration de la gestion  du secteur de la décentralisation et du développement local"
            ]
        },
        {
            icon: Building2,
            title: "Structure organisationnelle",
            description: [
                "Service de Gestion et d'Exploitation des Bases de Données (SGEBD)",
                "Service des Études et Prospectives (SEP)",
                "Service de Suivi de la Gouvernance Locale (SGL)",
                "Service du Système d'Information et de Digitalisation (SSID)"
            ]
        },
        {
            icon: Users,
            title: "Coordination avec les institutions nationales",
            description: [
                "Les directions et services du MDAT",
                "Les Collectivités Territoriales Décentralisées (CTD)",
                "Les ministères sectoriels"
            ]
        },
        {
            icon: Landmark,
            title: "Partenariats avec les acteurs externes",
            description: [
                "Les Partenaires Techniques et Financiers (PTF)",

            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Section */}
            <PageHeaderMenu
                title="Cadre Juridique de l'ODDL"

                subtitle="L’Observatoire de la Décentralisation et du développement local (ODDL) joue un rôle clé dans le renforcement de l’autonomie des collectivités territoriales décentralisées et la territorialisation des politiques publiques.
                Découvrez son cadre juridique incluant ses missions et son organisation."


            />

            {/* Main Content Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{opacity: 0, x: -50}}
                        whileInView={{opacity: 1, x: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                        className="mb-12"
                    >
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Cadre Légal
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                                    L’ODDL est une entité rattachée au Ministère de la Décentralisation et de
                                    l’aménagement de territoire (MDAT). Il est chargé de collecter et d’analyser des
                                    données sur la gouvernance locale et orienter les politiques publiques.
                                </p>

                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Son fonctionnement, ses missions et attributions, ainsi que son organisation sont
                                    stipulés dans le Décret n°2024-049 du 20 Janvier 2024.
                                </p>

                            </div>
                            <div className="relative h-56 w-full rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src="/assets/cadre.jpeg"
                                    alt="ODDL Legal Framework"
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            </div>

                        </div>
                    </motion.div>

                    {/* Statut Juridique Section */}
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                        className="mt-16 bg-gray-50 p-8 rounded-xl"
                    >
                        <div className="flex items-center mb-6">
                            <FileText
                                className="text-blue-600 w-10 h-10 mr-4"
                                strokeWidth={1.5}
                            />
                            <h3 className="text-3xl font-bold text-gray-900">
                                Organisme de rattachement
                            </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            L’ODDL est une entité rattachée au MDAT et placée sous l’autorité du Ministre en charge de
                            la Décentralisation.

                        </p>
                    </motion.div>

                    {/* Legal Framework Sections */}
                    <div className="mt-16">
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.8}}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Cadre Opérationnel
                            </h2>
                        </motion.div>

                        <div className="space-y-10">
                            {legalFrameworkSections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 30}}
                                    whileInView={{opacity: 1, y: 0}}
                                    viewport={{once: true}}
                                    transition={{duration: 0.6, delay: index * 0.2}}
                                    className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                                            <section.icon
                                                className="text-blue-600 w-8 h-8"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {section.title}
                                        </h3>
                                    </div>
                                    <ul className="pl-6 space-y-2">
                                        {section.description.map((item, itemIndex) => (
                                            <li key={itemIndex} className="text-gray-700 leading-relaxed list-disc">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Regime Section */}

                </div>
            </section>
        </div>
    );
};

export default JuridiquePage;
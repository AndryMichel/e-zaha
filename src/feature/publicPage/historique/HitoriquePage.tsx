"use client"

import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import {BookmarkIcon, ClockIcon, MapPin, TrendingUp} from 'lucide-react';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import Image from "next/image";

export const HistoriquePage = () => {
    const historicalMilestones = [
        {
            year: 2014,
            icon: MapPin,
            title: "- Création de l'ODDL",
            description: "Mise en place de l'Observatoire de la Décentralisation et du Développement Local (ODDL) au sein de l'Office National de Concertation sur la Décentralisation (ONCD)."
        },
        {
            year: 2020,
            icon: ClockIcon,
            title: "- Réorganisation",
            description: "Suite à la dissolution de l'ONCD, l'ODDL devient une direction rattachée directement auprès du Ministre."
        },
        {
            year: "",
            icon: TrendingUp,
            title: "Attribution ",
            description: "Assurer la collecte, l'analyse, la capitalisation et la valorisation des résultats liés à la Décentralisation et au Développement Local."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Historique de l'ODDL"
                subtitle="Un parcours stratégique pour la promotion de la Décentralisation et du Développement Local"

            />

            {/* Main Content Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div
                        className="mb-12"
                    >
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Origine et Évolution
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                                    En 2014, le Ministère en charge de la Décentralisation a créé l&#39;Observatoire de
                                    la
                                    Décentralisation et du Développement Local (ODDL) au sein de l&#39;Office National
                                    de
                                    Concertation sur la Décentralisation (ONCD).
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Depuis 2020, suite à la dissolution de l&#39;ONCD, l&#39;ODDL est devenu une
                                    direction
                                    rattachée directement auprès du Ministre.
                                </p>
                            </div>
                            <div>
                                <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
                                    <Image
                                        src="/assets/oddl.jpg"
                                        alt="ODDL Team Meeting"
                                        fill
                                        className="object-contain rounded-xl"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Milestones Section */}
                    <div className="mt-16">
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.8}}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Étapes Clés
                            </h2>
                        </motion.div>

                        <div className="space-y-8">
                            {historicalMilestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, x: index % 2 === 0 ? -50 : 50}}
                                    whileInView={{opacity: 1, x: 0}}
                                    viewport={{once: true}}
                                    transition={{duration: 0.6, delay: index * 0.2}}
                                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className="w-1/3 p-4">
                                        <div className="bg-blue-100 rounded-full p-4 flex items-center justify-center">
                                            <milestone.icon
                                                className="text-blue-600 w-12 h-12"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                    </div>
                                    <div className={`w-2/3 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {milestone.year} {milestone.title}
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mission Section */}
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8}}
                        className="mt-16 bg-gray-50 p-8 rounded-xl"
                    >
                        <div className="flex items-center mb-6">
                            <BookmarkIcon
                                className="text-blue-600 w-10 h-10 mr-4"
                                strokeWidth={1.5}
                            />
                            <h3 className="text-3xl font-bold text-gray-900">
                                Mission Actuelle
                            </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Actuellement, l&#39;Observatoire reste une direction stratégique rattachée directement au
                            Ministre de la Décentralisation et de l&#39;Aménagement du Territoire. Sa mission
                            fondamentale
                            demeure inchangée : servir de dispositif d&#39;observation et d&#39;outil de prise de
                            décision pour
                            les acteurs de la Décentralisation et du Développement Local.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HistoriquePage;
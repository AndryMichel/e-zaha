"use client"

import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import Image from "next/image";

export const OrganigramePage = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900">

            <PageHeaderMenu
                title="Organigramme de l'ODDL"
            />
            {/* Main Content - Organigramme Image */}
            <section className="py-24 bg-gray-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        className="flex justify-center mb-16"
                    >
                        <div className="relative w-full h-[500px] shadow-xl rounded-lg overflow-hidden">
                            <Image
                                src="/assets/organigrame.jpeg"
                                alt="Organigramme de l'ODDL"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                    </motion.div>

                    {/* Legend / Abbreviations */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.3}}
                        className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
                    >
                        <h3 className="text-2xl font-bold mb-4">Abréviations:</h3>
                        <ul className="space-y-2 text-gray-800">
                            <li><span className="font-semibold">ODDL :</span> Observatoire de la Décentralisation et du
                                Développement Local
                            </li>
                            <li><span className="font-semibold">SGEB :</span> Service de Gestion et d&#39;Exploitation
                                de
                                Base des données
                            </li>
                            <li><span className="font-semibold">SEP :</span> Service des Études et Prospectives</li>
                            <li><span className="font-semibold">SGL :</span> Service de suivi de la Gouvernance Locale
                            </li>
                            <li><span className="font-semibold">SSID :</span> Service du Système d&#39;Information et de
                                Digitalisation
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </section>


        </div>
    );
};

export default OrganigramePage;
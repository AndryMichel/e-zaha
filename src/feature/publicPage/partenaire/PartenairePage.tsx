"use client"

import React from 'react';
import {Card, CardContent} from '@/components/ui/molécules/card';
import {motion} from '@/components/ui/templates/motion';
import Image from 'next/image';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";

export const PartenairePage = () => {
    const partenaires = [
        {
            id: 1,
            name: "MIONJO",
            description: "Soutenir les moyens de subsistance résilients dans le Sud de Madagascar",
            logo: "/assets/mionjo.jpeg"
        },

        {
            id: 2,
            name: "UNICEF",
            description: "Fonds des Nations Unies pour l'enfance",
            logo: "/assets/unic.jpeg"
        },
        {
            id: 3,
            name: "PIC",
            description: "Pôles Intégrés de Croissance ",
            logo: "/assets/PIC.jpeg"
        },
        {
            id: 4,
            name: "PNUD",
            description: "Programme des Nations Unies pour le développement",
            logo: "/assets/pnud.jpeg"
        },
        {
            id: 5,
            name: "GIZ",
            description: "Deutsche Gesellschaft für Internationale Zusammenarbeit",
            logo: "/assets/giz.jpeg"
        },
        {
            id: 6,
            name: "ProDéCID",
            description: "Projet de Développement Communal Inclusif et de Décentralisation",
            logo: "/assets/cid1.jpeg"
        },


    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Nos Partenaires"
                subtitle="Les organisations qui nous accompagnent dans nos projets de développement et de promotion de la bonne gouvernance"
            />

            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {partenaires.map((partenaire, index) => (
                            <motion.div
                                key={partenaire.id}
                                initial={{opacity: 0, y: 30}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: index * 0.1}}
                                className="transform transition duration-500 hover:scale-105"
                            >
                                <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl">
                                    <CardContent className="p-6 flex flex-col items-center">
                                        <div className="h-48 w-full relative mb-6 flex items-center justify-center">
                                            <Image
                                                src={partenaire.logo}
                                                alt={partenaire.name}
                                                width={200}
                                                height={150}
                                                className="object-contain"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-center mb-2">{partenaire.name}</h3>
                                        <p className="text-gray-600 text-center">{partenaire.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartenairePage;
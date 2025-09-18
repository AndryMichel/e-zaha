// src/components/footer.tsx
import Image from "next/image";
import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-sky-800 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo and About */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Image
                                src="/assets/oddl.jpg"
                                alt="MDAT Logo"
                                width={60}
                                height={60}
                                className="object-contain rounded-lg"
                            />
                            <span className="ml-3 text-lg font-semibold">ODDL</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Observatoire de la Décentralisation et du Développement Local
                        </p>
                    </div>

                    {/* Thématiques */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Thématiques</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>Gouvernance locale</li>
                            <li>Finance locale</li>
                            <li>Structure de concertation</li>
                            <li>Planification</li>
                        </ul>
                    </div>

                    {/* Indicateurs */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Partenaires</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>MIONJO</li>
                            <li>UNICEF</li>
                            <li>PIC</li>
                            <li>PNUD</li>
                            <li>GIZ</li>
                            <li>ProDéCID</li>
                        </ul>
                    </div>

                    {/* Structures */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>Email: observatoireddl@gmail.com</li>
                            <li>Téléphone: 038 73 630 04 / 038 12 071 64</li>
                            <li>
                                Adresse: Bâtiment MID Tsimbazaza, 1èr étage
                                Ex- Fivondronana Tana 101 (ObservatoireDDL)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-sky-800 py-4">
                <div className="container mx-auto px-4 flex flex-col justify-between items-center text-sm text-gray-50">
                    <div>© 2025 Observatoire de la Décentralisation et du Développement Local</div>
                </div>
            </div>
        </footer>
    );
};
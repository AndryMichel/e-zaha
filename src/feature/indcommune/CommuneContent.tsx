'use client';

import React from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {DemoCOmTab} from './communeTabs/DemoCOmTab';
import {SocialCOmTab} from './communeTabs/SocialCOmTab';
import {EcoComTab} from './communeTabs/EcoComTab';
import {EnviComTab} from './communeTabs/EnviComTab';
import {GouverComTab} from './communeTabs/GouverComTab';
import {CarteCommune} from './carteCommune/CarteCommune';

export function CommuneContent() {
    return (
        <div className="flex flex-col lg:flex-row w-full gap-6 px-4 py-6">

            {/* Bloc dashboard (tabs) */}
            <div
                className="w-full lg:w-2/3 h-auto lg:h-[calc(100vh-140px)] overflow-y-auto bg-white rounded-xl shadow border border-gray-200 p-4">
                <Tabs defaultValue="demographics" className="w-full">
                    {/* TabsList avec défilement horizontal sur mobile */}
                    <div className="relative overflow-x-auto pb-2">
                        <TabsList className="inline-flex flex-nowrap w-auto min-w-full">
                            <TabsTrigger value="demographics" className="whitespace-nowrap text-xs md:text-sm">
                                Démographie
                            </TabsTrigger>
                            <TabsTrigger value="social" className="whitespace-nowrap text-xs md:text-sm">
                                Indicateurs Sociaux
                            </TabsTrigger>
                            <TabsTrigger value="economy" className="whitespace-nowrap text-xs md:text-sm">
                                Économie
                            </TabsTrigger>
                            <TabsTrigger value="environment" className="whitespace-nowrap text-xs md:text-sm">
                                Environnement
                            </TabsTrigger>
                            <TabsTrigger value="governance" className="whitespace-nowrap text-xs md:text-sm">
                                Gouvernance
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="mt-6 space-y-4">
                        <TabsContent value="demographics"><DemoCOmTab/></TabsContent>
                        <TabsContent value="social"><SocialCOmTab/></TabsContent>
                        <TabsContent value="economy"><EcoComTab/></TabsContent>
                        <TabsContent value="environment"><EnviComTab/></TabsContent>
                        <TabsContent value="governance"><GouverComTab/></TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Bloc carte (Leaflet) */}
            <div className="w-full lg:w-1/3 h-[300px] sm:h-[400px] lg:h-[calc(100vh-140px)] mt-6 lg:mt-0">
                <CarteCommune/>
            </div>
        </div>
    );
}
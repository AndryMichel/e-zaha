'use client'

import React from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {GouvernanceRegionale} from "@/feature/indregion/regionTabs/GouvernanceRegionale";
import {ServicesBase} from "@/feature/indregion/regionTabs/ServicesBase";
import {HygieneAssainissement} from "@/feature/indregion/regionTabs/HygieneAssainissement";
import {Education} from "@/feature/indregion/regionTabs/Education";
import {SanteSecurite} from "@/feature/indregion/regionTabs/SanteSecurite";
import {EconomieFiletsSociaux} from "@/feature/indregion/regionTabs/EconomieFiletsSociaux";
import {Foncier} from "@/feature/indregion/regionTabs/Foncier";

export function RegionContent() {
    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">INDICATEURS RÉGIONAUX</h1>

            <Tabs defaultValue="gouvernance" className="w-full">
                {/* TabsList avec défilement horizontal sur mobile */}
                <div className="relative overflow-x-auto pb-2">
                    <TabsList className="inline-flex flex-nowrap w-auto min-w-full">
                        <TabsTrigger value="gouvernance" className="whitespace-nowrap text-xs md:text-sm">
                            Gouvernance Régionale
                        </TabsTrigger>

                        <TabsTrigger value="services" className="whitespace-nowrap text-xs md:text-sm">
                            Accès aux Services de Base
                        </TabsTrigger>

                        <TabsTrigger value="hygiene" className="whitespace-nowrap text-xs md:text-sm">
                            Hygiène et Assainissement
                        </TabsTrigger>
                        <TabsTrigger value="education" className="whitespace-nowrap text-xs md:text-sm">
                            Éducation
                        </TabsTrigger>
                        <TabsTrigger value="sante" className="whitespace-nowrap text-xs md:text-sm">
                            Santé et Nutrition
                        </TabsTrigger>
                        <TabsTrigger value="economie" className="whitespace-nowrap text-xs md:text-sm">
                            Économie et Filets Sociaux
                        </TabsTrigger>
                        <TabsTrigger value="foncier" className="whitespace-nowrap text-xs md:text-sm">
                            Sécurisation foncière
                        </TabsTrigger>

                    </TabsList>
                </div>

                <TabsContent value="gouvernance" className="mt-4 md:mt-6">
                    <GouvernanceRegionale/>
                </TabsContent>

                <TabsContent value="services" className="mt-4 md:mt-6">
                    <ServicesBase/>
                </TabsContent>

                <TabsContent value="hygiene" className="mt-4 md:mt-6">
                    <HygieneAssainissement/>
                </TabsContent>
                <TabsContent value="education" className="mt-4 md:mt-6">
                    <Education/>
                </TabsContent>

                <TabsContent value="sante" className="mt-4 md:mt-6">
                    <SanteSecurite/>
                </TabsContent>

                <TabsContent value="economie" className="mt-4 md:mt-6">
                    <EconomieFiletsSociaux/>
                </TabsContent>

                <TabsContent value="foncier" className="mt-4 md:mt-6">
                    <Foncier/>
                </TabsContent>

            </Tabs>
        </div>
    );
}
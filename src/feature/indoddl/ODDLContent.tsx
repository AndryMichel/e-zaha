'use client'

import React from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {QualiteGouvernanceLocale} from "@/feature/indoddl/ODDLTabs/QualiteGouvernanceLocale";
import {ScoringPerformanceAdmin} from "@/feature/indoddl/ODDLTabs/ScoringPerformanceAdmin";
import {PerformanceFinanciereBudgetaire} from "@/feature/indoddl/ODDLTabs/PerformanceFinanciereBudgetaire";
import {PlanificationComptabilite} from "@/feature/indoddl/ODDLTabs/PlanificationComptabilite";
import {InvestissementAutonomieFinanciere} from "@/feature/indoddl/ODDLTabs/InvestissementAutonomieFinanciere";
import {MobilisationRessourcesHumaines} from "@/feature/indoddl/ODDLTabs/MobilisationRessourcesHumaines";

export function ODDLContent() {
    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">INDICATEURS ODDL</h1>

            <Tabs defaultValue="gouvernance" className="w-full">
                {/* TabsList avec défilement horizontal sur mobile */}
                <div className="relative overflow-x-auto pb-2">
                    <TabsList className="inline-flex flex-nowrap w-auto min-w-full">
                        <TabsTrigger value="gouvernance" className="whitespace-nowrap text-xs md:text-sm">
                            Qualité de la Gouvernance Locale
                        </TabsTrigger>
                        <TabsTrigger value="scoring" className="whitespace-nowrap text-xs md:text-sm">
                            Scoring et Performance Administrative
                        </TabsTrigger>
                        <TabsTrigger value="finance" className="whitespace-nowrap text-xs md:text-sm">
                            Performance Financière
                        </TabsTrigger>
                        <TabsTrigger value="investissement" className="whitespace-nowrap text-xs md:text-sm">
                            Investissement et Autonomie
                        </TabsTrigger>
                        <TabsTrigger value="planification" className="whitespace-nowrap text-xs md:text-sm">
                            Planification et Comptabilité
                        </TabsTrigger>
                        <TabsTrigger value="mobilisation" className="whitespace-nowrap text-xs md:text-sm">
                            Mobilisation & RH
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="gouvernance" className="mt-4 md:mt-6">
                    <QualiteGouvernanceLocale/>
                </TabsContent>

                <TabsContent value="scoring" className="mt-4 md:mt-6">
                    {/* Sera implémenté ultérieurement */}
                    <ScoringPerformanceAdmin/>
                </TabsContent>

                <TabsContent value="finance" className="mt-4 md:mt-6">
                    <PerformanceFinanciereBudgetaire/>
                </TabsContent>

                <TabsContent value="investissement" className="mt-4 md:mt-6">
                    <InvestissementAutonomieFinanciere/>
                </TabsContent>

                <TabsContent value="planification" className="mt-4 md:mt-6">
                    <PlanificationComptabilite/>
                </TabsContent>

                <TabsContent value="mobilisation" className="mt-4 md:mt-6">
                    <MobilisationRessourcesHumaines/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
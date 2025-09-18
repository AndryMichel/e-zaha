"use client";

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/molécules/tabs';
import {DbOddlContent} from './DbOddlContent';
import {RegionList} from './RegionList';
import {CommuneInRegionList} from '@/feature/dbregion/CommuneInRegionList';

export function DbDataContent() {
    // État pour suivre la région sélectionnée
    const [selectedRegion, setSelectedRegion] = useState<{
        code: string | null;
        name: string | null;
    }>({
        code: null,
        name: null
    });

    // Correction ici : valeur initiale = "oddl"
    const [activeTab, setActiveTab] = useState("oddl");

    const handleRegionSelect = (regionCode: string, regionName: string) => {
        setSelectedRegion({
            code: regionCode,
            name: regionName
        });
        setActiveTab("communes");
    };

    const handleResetRegion = () => {
        setSelectedRegion({
            code: null,
            name: null
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Card>
                <CardHeader className="text-gray-800">
                    <CardTitle className="text-3xl font-bold">Gestion des Données</CardTitle>
                </CardHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4 flex space-x-4 px-4">
                        <TabsTrigger value="oddl">ODDL - Gouvernance</TabsTrigger>
                        <TabsTrigger value="regions">Régions</TabsTrigger>
                        <TabsTrigger value="communes">Communes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="oddl" className="p-0">
                        <CardContent>
                            <DbOddlContent/>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="regions" className="p-0">
                        <CardContent>
                            <RegionList onRegionSelect={handleRegionSelect}/>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="communes" className="p-0">
                        <CardContent>
                            <CommuneInRegionList
                                selectedRegionCode={selectedRegion.code}
                                selectedRegionName={selectedRegion.name}
                                onResetRegion={handleResetRegion}
                            />
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}

export default DbDataContent;

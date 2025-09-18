'use client';

import React, {useEffect, useState} from 'react';
import {Skeleton} from '@/components/ui/atomes/skeleton';
import dynamic from 'next/dynamic';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {useGetEffectifTotalPopulation} from '@/services/api/commune/indic-demo-effec-commune.api';
import {sharedState} from '../communeTabs/DemoCOmTab';
import type {CommunePopulationData} from '@/services/types/indic-commune.type';

// Dynamique : évite erreur SSR avec Leaflet
const Map = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-b-2xl">
            <Skeleton className="w-full h-full rounded-xl"/>
        </div>
    )
});

export function CarteCommune() {
    const [selectedLocation, setSelectedLocation] = useState<{
        commune_code?: string;
        region?: string;
        province?: string;
    }>({});

    const {data, isLoading, isError} = useGetEffectifTotalPopulation({
        annee: new Date().getFullYear()
    });

    // Écouteur d'événement avec typage CustomEvent
    useEffect(() => {
        const handleMapViewToggle = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail?.selectedLocation) {
                setSelectedLocation(customEvent.detail.selectedLocation);
            }
        };

        window.addEventListener('mapViewToggled', handleMapViewToggle);
        return () => {
            window.removeEventListener('mapViewToggled', handleMapViewToggle);
        };
    }, []);

    // Synchroniser avec l'état partagé
    useEffect(() => {
        // Créez une copie locale de l'objet
        const currentSharedLocation = {...sharedState.selectedLocation};
        setSelectedLocation(currentSharedLocation);
        // Enlevez sharedState.selectedLocation du tableau de dépendances
    }, []);

    // Récupérer les communes uniques
    const getUniqueCommunes = (): CommunePopulationData[] => {
        if (sharedState.filteredCommunes && sharedState.filteredCommunes.length > 0) {
            return sharedState.filteredCommunes;
        }

        if (!data?.communes) return [];

        const uniqueMap: Record<string, CommunePopulationData> = {};

        data.communes.forEach((commune) => {
            if (!uniqueMap[commune.commune_code]) {
                uniqueMap[commune.commune_code] = commune;
            }
        });

        return Object.values(uniqueMap);
    };

    const uniqueCommunes = getUniqueCommunes();

    // Déterminer le titre en fonction de la sélection
    const getMapTitle = () => {
        if (selectedLocation.commune_code) {
            const commune = uniqueCommunes.find(c => c.commune_code === selectedLocation.commune_code);
            return `Carte de la commune ${commune?.commune || selectedLocation.commune_code}`;
        } else if (selectedLocation.region) {
            return `Carte de la région ${selectedLocation.region}`;
        } else if (selectedLocation.province) {
            return `Carte de la province de ${selectedLocation.province}`;
        } else {
            return "Carte des Communes de Madagascar";
        }
    };

    if (isLoading) {
        return (
            <Card className="w-full h-full shadow-lg rounded-2xl flex flex-col">
                <CardHeader>
                    <CardTitle className="text-center text-lg sm:text-xl font-semibold text-gray-800">
                        Chargement de la carte...
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 rounded-b-2xl overflow-hidden">
                    <Skeleton className="w-full h-full rounded-xl"/>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="w-full h-full shadow-lg rounded-2xl flex flex-col">
                <CardHeader>
                    <CardTitle className="text-center text-lg sm:text-xl font-semibold text-gray-800">
                        Erreur de chargement
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 rounded-b-2xl">
                    Une erreur est survenue lors du chargement de la carte. Veuillez réessayer plus tard.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full shadow-lg rounded-2xl flex flex-col">
            <CardHeader>
                <CardTitle className="text-center text-lg sm:text-xl font-semibold text-gray-800">
                    {getMapTitle()}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 rounded-b-2xl overflow-hidden">
                <Map
                    communesData={uniqueCommunes}
                    selectedLocation={selectedLocation}
                />
            </CardContent>
        </Card>
    );
}
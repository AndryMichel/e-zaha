'use client';

import React, {useEffect, useState} from 'react';
import {CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, {CircleMarkerOptions, LatLngBounds, LatLngTuple} from 'leaflet';
import {Home, MapPin, MapPinned, Users} from 'lucide-react';
import {CommunePopulationData} from '@/services/types/indic-commune.type';

// Centre et zoom initial
const madagascarCenter: LatLngTuple = [-18.9, 46.9];
const zoom = 6;

// Limites de Madagascar
const bounds: LatLngBounds = L.latLngBounds(
    L.latLng(-26.0, 42.0),
    L.latLng(-11.0, 51.5)
);

// Types pour les provinces
type ProvinceName = 'ANTANANARIVO' | 'FIANARANTSOA' | 'TOAMASINA' | 'MAHAJANGA' | 'TOLIARA' | 'ANTSIRANANA' | 'default';

// Couleurs par province
const provinceColors: Record<ProvinceName, string> = {
    "ANTANANARIVO": "#3388FF",
    "FIANARANTSOA": "#33A02C",
    "TOAMASINA": "#FF7F00",
    "MAHAJANGA": "#E31A1C",
    "TOLIARA": "#6A3D9A",
    "ANTSIRANANA": "#FF5733",
    "default": "#999999"
};

// Composant pour réinitialiser la vue
const ResetViewButton: React.FC = () => {
    const map = useMap();

    const handleClick = (): void => {
        map.setView(madagascarCenter, zoom);
    };

    return (
        <div className="absolute top-2 right-2 z-[1000]">
            <button
                onClick={handleClick}
                className="bg-white text-sm px-3 py-1 rounded shadow border border-gray-300 hover:bg-gray-100 transition flex items-center"
            >
                <MapPinned className="w-4 h-4 mr-1"/> Réinitialiser vue
            </button>
        </div>
    );
};

interface ZoomObserverProps {
    onZoomChange: (zoom: number) => void;
}

// Composant pour surveiller le niveau de zoom
const ZoomObserver: React.FC<ZoomObserverProps> = ({onZoomChange}) => {
    const map = useMapEvents({
        zoomend: () => {
            onZoomChange(map.getZoom());
        }
    });

    return null;
};

// Fonction pour calculer la taille du cercle basée sur la population et le niveau de zoom
const getCircleSize = (population: number, zoomLevel: number): number => {
    // Base size calculation with logarithmic scale for population
    const baseSize = Math.max(3, Math.min(12, Math.log10(population) * 2.5));

    // Adjust size based on zoom level
    if (zoomLevel <= 6) {
        return baseSize * 0.6; // Smaller at low zoom levels
    } else if (zoomLevel <= 8) {
        return baseSize * 0.8; // Medium at mid zoom levels
    } else {
        return baseSize; // Full size at high zoom levels
    }
};
type CircleStyleOptions = Omit<CircleMarkerOptions, "radius">;

// Fonction pour déterminer la couleur du cercle en fonction de la province et du taux de handicap
const getCircleColor = (
    province: string,
    totalPopulation: number,
    handicapPopulation: number
): CircleStyleOptions => {
    const baseColor = provinceColors[province as ProvinceName] || provinceColors.default;

    const percentage = (handicapPopulation / totalPopulation) * 100;

    const opacity = Math.min(0.9, Math.max(0.4, percentage / 5 + 0.4));

    return {
        fillColor: baseColor,
        fillOpacity: opacity,
        weight: percentage > 2 ? 2 : 1,
        color: percentage > 2 ? '#000' : '#555'
    };
};


interface MapPopulationViewProps {
    communesData: CommunePopulationData[] | undefined;
    selectedLocation?: {
        commune_code?: string;
        region?: string;
        province?: string;
    };
}

const MapPopulationView: React.FC<MapPopulationViewProps> = ({
                                                                 communesData,
                                                                 selectedLocation
                                                             }) => {
    const [filteredCommunes, setFilteredCommunes] = useState<CommunePopulationData[]>([]);
    const [zoomLevel, setZoomLevel] = useState<number>(zoom);
    const [selectedCommune, setSelectedCommune] = useState<CommunePopulationData | null>(null);

    useEffect(() => {
        // Ensure communesData is an array before attempting to spread it
        const communes = Array.isArray(communesData) ? communesData : [];

        // Filtrer les communes basées sur la sélection
        let filtered = [...communes];

        if (selectedLocation?.commune_code) {
            filtered = filtered.filter(commune =>
                commune.commune_code === selectedLocation.commune_code
            );
            // Si une commune spécifique est sélectionnée, on la définit comme selectedCommune
            if (filtered.length === 1) {
                setSelectedCommune(filtered[0]);
            }
        } else if (selectedLocation?.region) {
            filtered = filtered.filter(commune =>
                commune.region === selectedLocation.region
            );
        } else if (selectedLocation?.province) {
            filtered = filtered.filter(commune =>
                commune.province === selectedLocation.province
            );
        }

        // Filtrer les communes sans coordonnées valides
        filtered = filtered.filter(commune =>
            commune.coordinates &&
            typeof commune.coordinates.latitude === "number" &&
            typeof commune.coordinates.longitude === "number"
        );

        // Dédupliquer les données (basé sur le code commune)
        const uniqueCommunes = filtered.reduce<CommunePopulationData[]>((acc, current) => {
            const existingCommune = acc.find(item => item.commune_code === current.commune_code);
            if (!existingCommune) {
                acc.push(current);
            }
            return acc;
        }, []);

        setFilteredCommunes(uniqueCommunes);
    }, [communesData, selectedLocation]);

    // Si une commune spécifique est sélectionnée, centrer la carte sur cette commune
    const FocusOnSelectedCommune: React.FC<{ commune: CommunePopulationData | null }> = ({commune}) => {
        const map = useMap();

        useEffect(() => {
            if (commune &&
                commune.coordinates &&
                commune.coordinates.latitude &&
                commune.coordinates.longitude) {

                const position: LatLngTuple = [commune.coordinates.latitude, commune.coordinates.longitude];
                map.setView(position, 10);
            }
        }, [map, commune]);

        return null;
    };

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200">
            <MapContainer
                center={madagascarCenter}
                zoom={zoom}
                minZoom={5}
                maxZoom={14}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                style={{height: '100%', width: '100%'}}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                <ZoomObserver onZoomChange={setZoomLevel}/>

                {filteredCommunes.map((commune, index) => {
                    if (
                        !commune.coordinates ||
                        typeof commune.coordinates.latitude !== 'number' ||
                        typeof commune.coordinates.longitude !== 'number'
                    ) {
                        return null;
                    }


                    const circleStyle = getCircleColor(
                        commune.province,
                        commune.population.total,
                        commune.population.handicap
                    );

                    const percentage = ((commune.population.handicap / commune.population.total) * 100).toFixed(1);
                    const position: LatLngTuple = [commune.coordinates.latitude, commune.coordinates.longitude];

                    return (
                        <CircleMarker
                            key={`${commune.commune_code}-${index}`}
                            center={position}
                            radius={getCircleSize(commune.population.total, zoomLevel)}
                            {...circleStyle}
                        >
                            <Popup className="commune-popup">
                                <div className="p-1">
                                    <h3 className="font-bold flex items-center">
                                        <Home className="w-4 h-4 mr-1"/>
                                        {commune.commune}
                                    </h3>
                                    <p className="text-sm text-gray-600">{commune.district}, {commune.region}</p>
                                    <p className="text-xs text-gray-500">{commune.province}</p>
                                    <div className="mt-2">
                                        <div className="flex items-center mb-1">
                                            <Users className="w-4 h-4 mr-1"/>
                                            <span
                                                className="font-semibold">{commune.population.total.toLocaleString()}</span> habitants
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                            <div>Hommes: {commune.population.hommes.toLocaleString()}</div>
                                            <div>Femmes: {commune.population.femmes.toLocaleString()}</div>
                                            <div>0-5 ans: {commune.population.moins_5_ans.toLocaleString()}</div>
                                            <div>6-17 ans: {commune.population.ans_6_17.toLocaleString()}</div>
                                            <div>18-60 ans: {commune.population.ans_18_60.toLocaleString()}</div>
                                            <div>60+ ans: {commune.population.plus_60_ans.toLocaleString()}</div>
                                        </div>
                                        <div className="mt-1 text-xs">
                                            <span className="font-medium">Personnes en situation de handicap:</span>
                                            <div className="flex items-center">
                                                <span
                                                    className="font-semibold">{commune.population.handicap.toLocaleString()}</span>
                                                <span className="ml-1">({percentage}%)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                                        <MapPin className="w-3 h-3 mr-1"/>
                                        {typeof commune.coordinates.latitude === 'number'
                                            ? commune.coordinates.latitude.toFixed(4)
                                            : Number(commune.coordinates.latitude).toFixed(4)},
                                        {typeof commune.coordinates.longitude === 'number'
                                            ? commune.coordinates.longitude.toFixed(4)
                                            : Number(commune.coordinates.longitude).toFixed(4)}
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}

                <ResetViewButton/>
                <FocusOnSelectedCommune commune={selectedCommune}/>
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-40 p-2 rounded-md shadow text-xs z-[1000]">
                <div className="font-semibold mb-1">Légende:</div>

                {/* Province colors */}
                <div className="font-medium mt-1">Provinces:</div>
                <div className="grid grid-cols-2 gap-x-2">
                    {Object.entries(provinceColors)
                        .filter(([key]) => key !== 'default')
                        .map(([province, color]) => (
                            <div key={province} className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: color}}></div>
                                <span>{province}</span>
                            </div>
                        ))}
                </div>

            </div>
        </div>
    );
};

export default MapPopulationView;
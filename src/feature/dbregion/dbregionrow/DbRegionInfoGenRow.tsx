"use client";

import React from "react";
import {Region} from "@/services/types/dbregion.type";

interface DbRegionInfoGenRowProps {
    region: Region;
}

export function DbRegionInfoGenRow({region}: DbRegionInfoGenRowProps) {
    // Helper function pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold mb-2 text-blue-600">Informations générales</h3>
            <table className="w-full">
                <tbody>
                <tr>
                    <td className="py-1 font-medium">ID:</td>
                    <td>{region.id_situation_geographique}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Numéro de région:</td>
                    <td>{displayValue(region.num_region)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Nom de la région:</td>
                    <td>{region.region_nom}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Communes:</td>
                    <td>{region.effectif_commune}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Districts:</td>
                    <td>{region.effectif_district}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Superficie:</td>
                    <td>{region.superficie_region_km2} km²</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Limites Nord:</td>
                    <td>{displayValue(region.region_situee_nord)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Limites Sud:</td>
                    <td>{displayValue(region.region_situee_sud)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Limites Est:</td>
                    <td>{displayValue(region.region_situee_est)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Limites Ouest:</td>
                    <td>{displayValue(region.region_situee_ouest)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
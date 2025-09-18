"use client";

import React from "react";
import {EnvironnementRegion} from "@/services/types/dbregion.type";

interface EnvironnementRegionRowProps {
    EnvironnementRegion: EnvironnementRegion;
}

export function DbRegionEnvironnementRow({EnvironnementRegion}: EnvironnementRegionRowProps) {
    // Formatter pour les valeurs booléennes
    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    return (

        <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold mb-2 text-blue-600">Environnement</h3>
            <table className="w-full">
                <tbody>
                <tr>
                    <td className="py-1 font-medium">Structure de gestion des risques:</td>
                    <td>{formatBoolean(EnvironnementRegion.structure_gestion_risques)}</td>
                </tr>
                </tbody>
            </table>
        </div>


    );
}
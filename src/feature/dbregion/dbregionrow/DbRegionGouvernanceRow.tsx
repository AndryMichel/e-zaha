"use client";

import React from "react";
import {GouvernanceRegion} from "@/services/types/dbregion.type";

interface DbRegionGouvernanceRowProps {
    gouvernance: GouvernanceRegion;
}

export function DbRegionGouvernanceRow({gouvernance}: DbRegionGouvernanceRowProps) {
    // Formatter pour les valeurs booléennes
    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold mb-2 text-blue-600">Gouvernance</h3>
            <table className="w-full">
                <tbody>
                <tr>
                    <td className="py-1 font-medium">SRC opérationnelle:</td>
                    <td>{formatBoolean(gouvernance.src_operationnelle)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">SRAT à jour:</td>
                    <td>{formatBoolean(gouvernance.srat_a_jour)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Volet changement climatique:</td>
                    <td>{formatBoolean(gouvernance.volet_changement_climatique)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">PRD à jour:</td>
                    <td>{formatBoolean(gouvernance.prd_a_jour)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">Accès plateforme web:</td>
                    <td>{formatBoolean(gouvernance.acces_plateforme_web)}</td>
                </tr>
                <tr>
                    <td className="py-1 font-medium">État réalisation budget:</td>
                    <td>{displayValue(gouvernance.etat_realisation_budget)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
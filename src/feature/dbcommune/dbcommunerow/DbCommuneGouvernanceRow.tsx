"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneGouvernanceRowProps {
    gouvernance: Commune["gouvernance"];
}

export function DbCommuneGouvernanceRow({gouvernance}: DbCommuneGouvernanceRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };
    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Gouvernance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Existence SLC (Structure Locale de Concertation):</td>
                            <td>{formatBoolean(gouvernance.existence_slc)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Existence d&#39;outils de planification:</td>
                            <td>{formatBoolean(gouvernance.existence_outils_planification)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Existence PDL2 (Plan de Développement Local):</td>
                            <td>{formatBoolean(gouvernance.existence_pdl2)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Soumission d&#39;actes:</td>
                            <td>{formatBoolean(gouvernance.soumission_actes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Existence d&#39;association de jeunes:</td>
                            <td>{formatBoolean(gouvernance.existence_association_jeunes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Existence d&#39;association de femmes:</td>
                            <td>{formatBoolean(gouvernance.existence_association_femmes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Auto-évaluation IGL (Indice de Gouvernance Locale):</td>
                            <td>{formatBoolean(gouvernance.autoevaluation_igl)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Notes d&#39;évaluation</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Note AEIGL:</td>
                            <td>{displayValue(gouvernance.note_aeigl)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Note pilier A:</td>
                            <td>{displayValue(gouvernance.note_pilier_a)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Note pilier B:</td>
                            <td>{displayValue(gouvernance.note_pilier_b)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Note pilier C:</td>
                            <td>{displayValue(gouvernance.note_pilier_c)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Note pilier D:</td>
                            <td>{displayValue(gouvernance.note_pilier_d)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
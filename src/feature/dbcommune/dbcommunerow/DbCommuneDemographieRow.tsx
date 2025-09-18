"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneDemographieRowProps {
    demographie: Commune['situation_demographique'];
}

export function DbCommuneDemographieRow({demographie}: DbCommuneDemographieRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Démographie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Population</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Population totale:</td>
                            <td>{displayValue(demographie.effectif_total)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre d&#39;hommes:</td>
                            <td>{displayValue(demographie.effectif_hommes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre de femmes:</td>
                            <td>{displayValue(demographie.effectif_femmes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre de ménages:</td>
                            <td>{displayValue(demographie.effectif_total_menages)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnes en situation de handicap:</td>
                            <td>{displayValue(demographie.effectif_handicap)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Répartition par âge</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Moins de 5 ans:</td>
                            <td>{displayValue(demographie.effectif_moins_5_ans)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">6 à 17 ans:</td>
                            <td>{displayValue(demographie.effectif_6_17_ans)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">18 à 60 ans:</td>
                            <td>{displayValue(demographie.effectif_18_60_ans)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Plus de 60 ans:</td>
                            <td>{displayValue(demographie.effectif_60_plus)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">État civil</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Naissances:</td>
                            <td>{displayValue(demographie.effectif_naissance)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Actes de naissance délivrés:</td>
                            <td>{displayValue(demographie.effectif_acte_naissance)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Décès:</td>
                            <td>{displayValue(demographie.effectif_deces)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Mariages:</td>
                            <td>{displayValue(demographie.effectif_mariage)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
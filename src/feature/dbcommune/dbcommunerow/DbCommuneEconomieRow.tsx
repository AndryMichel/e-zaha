"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneEconomieRowProps {
    economie: Commune["situation_economique"];
}

export function DbCommuneEconomieRow({economie}: DbCommuneEconomieRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };
    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Situation Économique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Agriculture</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{formatBoolean(economie.agriculture.dispose)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif personnes:</td>
                            <td>{displayValue(economie.agriculture.effectif_personnes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif entreprises:</td>
                            <td>{displayValue(economie.agriculture.effectif_entreprises)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Type produit phare:</td>
                            <td>{displayValue(economie.agriculture.type_produit_phare)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Quantités produites:</td>
                            <td>{displayValue(economie.agriculture.quantites_produites)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(economie.agriculture.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Élevage</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{formatBoolean(economie.elevage.dispose)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif personnes:</td>
                            <td>{displayValue(economie.elevage.effectif_personnes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif entreprises:</td>
                            <td>{displayValue(economie.elevage.effectif_entreprises)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Type produit phare:</td>
                            <td>{displayValue(economie.elevage.type_produit_phare)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Quantités produites:</td>
                            <td>{displayValue(economie.elevage.quantites_produites)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(economie.elevage.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Pêche</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{formatBoolean(economie.peche.dispose)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif personnes:</td>
                            <td>{displayValue(economie.peche.effectif_personnes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif entreprises:</td>
                            <td>{displayValue(economie.peche.effectif_entreprises)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Type produit phare:</td>
                            <td>{displayValue(economie.peche.type_produit_phare)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Quantités produites:</td>
                            <td>{displayValue(economie.peche.quantites_produites)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(economie.peche.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Infrastructures</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose de marché:</td>
                            <td>{formatBoolean(economie.infrastructures.dispose_marche)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Dispose de barrage hydraulique:</td>
                            <td>{formatBoolean(economie.infrastructures.dispose_barrage_hydraulique)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Dispose d&#39;abattoirs:</td>
                            <td>{formatBoolean(economie.infrastructures.dispose_abattoirs)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Accessibilité des routes:</td>
                            <td>{formatBoolean(economie.infrastructures.accessibilite_routes)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
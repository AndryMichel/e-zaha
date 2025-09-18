"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneSecuriteRowProps {
    securite: Commune["securite"];
}

export function DbCommuneSecuriteRow({securite}: DbCommuneSecuriteRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Sécurité</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Gendarmerie - Poste Fixe</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{securite.gendarmerie.poste_fixe.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre:</td>
                            <td>{displayValue(securite.gendarmerie.poste_fixe.effectif)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel:</td>
                            <td>{displayValue(securite.gendarmerie.poste_fixe.effectif_personnels)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(securite.gendarmerie.poste_fixe.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Gendarmerie - Brigade</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{securite.gendarmerie.brigade.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre:</td>
                            <td>{displayValue(securite.gendarmerie.brigade.effectif)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel:</td>
                            <td>{displayValue(securite.gendarmerie.brigade.effectif_personnels)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(securite.gendarmerie.brigade.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Police - Commissariat</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{securite.police.commissariat.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre:</td>
                            <td>{displayValue(securite.police.commissariat.effectif)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel:</td>
                            <td>{displayValue(securite.police.commissariat.effectif_personnels)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(securite.police.commissariat.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
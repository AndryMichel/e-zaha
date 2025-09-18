"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneSanteRowProps {
    sante: Commune["centres_de_sante"];
}

export function DbCommuneSanteRow({sante}: DbCommuneSanteRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Centres de Santé</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">CSB1</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{sante.csb1.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif total:</td>
                            <td>{displayValue(sante.csb1.effectif_total)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel de formation:</td>
                            <td>{displayValue(sante.csb1.effectif_formation)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel de soins:</td>
                            <td>{displayValue(sante.csb1.effectif_soins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre de services:</td>
                            <td>{displayValue(sante.csb1.nombre_services)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Patients/jour (moy.):</td>
                            <td>{displayValue(sante.csb1.nombre_patients_moyen)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">CSB2</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{sante.csb2.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif total:</td>
                            <td>{displayValue(sante.csb2.effectif_total)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel de formation:</td>
                            <td>{displayValue(sante.csb2.effectif_formation)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel de soins:</td>
                            <td>{displayValue(sante.csb2.effectif_soins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre de services:</td>
                            <td>{displayValue(sante.csb2.nombre_services)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Patients/jour (moy.):</td>
                            <td>{displayValue(sante.csb2.nombre_patients_moyen)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">CHRD</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{sante.chrd.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Effectif total:</td>
                            <td>{displayValue(sante.chrd.effectif_total)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel de formation:</td>
                            <td>{displayValue(sante.chrd.effectif_formation)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Personnel de soins:</td>
                            <td>{displayValue(sante.chrd.effectif_soins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre de services:</td>
                            <td>{displayValue(sante.chrd.nombre_services)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Patients/jour (moy.):</td>
                            <td>{displayValue(sante.chrd.nombre_patients_moyen)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
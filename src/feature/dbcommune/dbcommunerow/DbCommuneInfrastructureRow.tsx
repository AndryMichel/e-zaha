"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneInfrastructureRowProps {
    infrastructure: Commune["eau_assainissement_electricite"];
}

export function DbCommuneInfrastructureRow({infrastructure}: DbCommuneInfrastructureRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Eau, Assainissement et Électricité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Sources d&#39;Eau</h4>

                    <h5 className="font-medium mt-2">Bornes Fontaines</h5>
                    <table className="w-full mb-2">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Disponible:</td>
                            <td>{infrastructure.sources_eau.borne_fontaine.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre:</td>
                            <td>{displayValue(infrastructure.sources_eau.borne_fontaine.effectif)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Bénéficiaires:</td>
                            <td>{displayValue(infrastructure.sources_eau.borne_fontaine.effectif_beneficiaires)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(infrastructure.sources_eau.borne_fontaine.observation)}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h5 className="font-medium mt-2">Forages</h5>
                    <table className="w-full mb-2">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Disponible:</td>
                            <td>{infrastructure.sources_eau.forage.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre:</td>
                            <td>{displayValue(infrastructure.sources_eau.forage.effectif)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Bénéficiaires:</td>
                            <td>{displayValue(infrastructure.sources_eau.forage.effectif_beneficiaires)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(infrastructure.sources_eau.forage.observation)}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h5 className="font-medium mt-2">Puits</h5>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Disponible:</td>
                            <td>{infrastructure.sources_eau.puits.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre:</td>
                            <td>{displayValue(infrastructure.sources_eau.puits.effectif)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Bénéficiaires:</td>
                            <td>{displayValue(infrastructure.sources_eau.puits.effectif_beneficiaires)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(infrastructure.sources_eau.puits.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Sources d&#39;Électricité</h4>

                    <h5 className="font-medium mt-2">Réseau Électrique</h5>
                    <table className="w-full mb-2">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Disponible:</td>
                            <td>{infrastructure.sources_electricite.electricite.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Ménages desservis:</td>
                            <td>{displayValue(infrastructure.sources_electricite.electricite.effectif_menages)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(infrastructure.sources_electricite.electricite.observation)}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h5 className="font-medium mt-2">Panneaux Solaires</h5>
                    <table className="w-full mb-2">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Disponible:</td>
                            <td>{infrastructure.sources_electricite.panneau_solaire.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Ménages équipés:</td>
                            <td>{displayValue(infrastructure.sources_electricite.panneau_solaire.effectif_menages)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(infrastructure.sources_electricite.panneau_solaire.observation)}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h5 className="font-medium mt-2">Groupes Électrogènes</h5>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Disponible:</td>
                            <td>{infrastructure.sources_electricite.groupe_electrogene.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Bénéficiaires:</td>
                            <td>{displayValue(infrastructure.sources_electricite.groupe_electrogene.effectif_beneficiaires)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Observation:</td>
                            <td>{displayValue(infrastructure.sources_electricite.groupe_electrogene.observation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
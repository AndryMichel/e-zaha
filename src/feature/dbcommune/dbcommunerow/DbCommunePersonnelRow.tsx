"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommunePersonnelRowProps {
    personnel: Commune['personnel_cle'];
}

export function DbCommunePersonnelRow({personnel}: DbCommunePersonnelRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Personnel Clé</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Maire</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom et prénoms:</td>
                            <td>{displayValue(personnel.maire.nom_prenoms)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(personnel.maire.sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(personnel.maire.telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Mandats:</td>
                            <td>{displayValue(personnel.maire.nombre_mandats)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut:</td>
                            <td>{displayValue(personnel.maire.statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(personnel.maire.niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme le plus élevé:</td>
                            <td>{displayValue(personnel.maire.diplome_eleve)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Premier Adjoint</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom et prénoms:</td>
                            <td>{displayValue(personnel.premier_adjoint.nom_prenoms)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(personnel.premier_adjoint.sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(personnel.premier_adjoint.telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Mandats:</td>
                            <td>{displayValue(personnel.premier_adjoint.nombre_mandats)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut:</td>
                            <td>{displayValue(personnel.premier_adjoint.statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(personnel.premier_adjoint.niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme le plus élevé:</td>
                            <td>{displayValue(personnel.premier_adjoint.diplome_eleve)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Secrétaire Général</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom et prénoms:</td>
                            <td>{displayValue(personnel.secretaire_general.nom_prenoms)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(personnel.secretaire_general.sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(personnel.secretaire_general.telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Années effectuées:</td>
                            <td>{displayValue(personnel.secretaire_general.annees_effectuees)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut:</td>
                            <td>{displayValue(personnel.secretaire_general.statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(personnel.secretaire_general.niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme le plus élevé:</td>
                            <td>{displayValue(personnel.secretaire_general.diplome_eleve)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Trésorier</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom et prénoms:</td>
                            <td>{displayValue(personnel.tresorier.nom_prenoms)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(personnel.tresorier.sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(personnel.tresorier.telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Années effectuées:</td>
                            <td>{displayValue(personnel.tresorier.annees_effectuees)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut:</td>
                            <td>{displayValue(personnel.tresorier.statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(personnel.tresorier.niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme le plus élevé:</td>
                            <td>{displayValue(personnel.tresorier.diplome_eleve)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
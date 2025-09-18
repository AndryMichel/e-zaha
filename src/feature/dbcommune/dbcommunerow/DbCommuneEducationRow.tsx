"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneEducationRowProps {
    education: Commune["etablissements_educatifs"];
}

export function DbCommuneEducationRow({education}: DbCommuneEducationRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };


    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Établissements Éducatifs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Primaire</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{education.primaire.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre total:</td>
                            <td>{displayValue(education.primaire.effectif_total)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Écoles privées:</td>
                            <td>{displayValue(education.primaire.effectif_privees)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Écoles publiques:</td>
                            <td>{displayValue(education.primaire.effectif_publiques)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves (privé):</td>
                            <td>{displayValue(education.primaire.effectif_eleves_prive)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves (public):</td>
                            <td>{displayValue(education.primaire.effectif_eleves_public)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves masculins:</td>
                            <td>{displayValue(education.primaire.effectif_eleves_masculins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves féminins:</td>
                            <td>{displayValue(education.primaire.effectif_eleves_feminins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Enseignants:</td>
                            <td>{displayValue(education.primaire.effectif_enseignants)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Collège</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{education.college.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre total:</td>
                            <td>{displayValue(education.college.effectif_total)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Collèges privés:</td>
                            <td>{displayValue(education.college.effectif_privees)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Collèges publics:</td>
                            <td>{displayValue(education.college.effectif_publiques)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves (privé):</td>
                            <td>{displayValue(education.college.effectif_eleves_prive)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves (public):</td>
                            <td>{displayValue(education.college.effectif_eleves_public)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves masculins:</td>
                            <td>{displayValue(education.college.effectif_eleves_masculins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves féminins:</td>
                            <td>{displayValue(education.college.effectif_eleves_feminins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Enseignants:</td>
                            <td>{displayValue(education.college.effectif_enseignants)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Lycée</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose:</td>
                            <td>{education.lycee.dispose ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre total:</td>
                            <td>{displayValue(education.lycee.effectif_total)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Lycées privés:</td>
                            <td>{displayValue(education.lycee.effectif_privees)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Lycées publics:</td>
                            <td>{displayValue(education.lycee.effectif_publiques)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves (privé):</td>
                            <td>{displayValue(education.lycee.effectif_eleves_prive)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves (public):</td>
                            <td>{displayValue(education.lycee.effectif_eleves_public)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves masculins:</td>
                            <td>{displayValue(education.lycee.effectif_eleves_masculins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Élèves féminins:</td>
                            <td>{displayValue(education.lycee.effectif_eleves_feminins)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Enseignants:</td>
                            <td>{displayValue(education.lycee.effectif_enseignants)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
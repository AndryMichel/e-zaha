"use client";

import React from "react";
import {StaffRegion} from "@/services/types/dbregion.type";

interface DbRegionStaffRowProps {
    StaffRegion: StaffRegion;
}

export function DbRegionStaffRow({StaffRegion}: DbRegionStaffRowProps) {
    // Formatter pour les valeurs booléennes
    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    // Helper function pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="mt-6">
            <h3 className="font-bold mb-4 text-xl text-blue-700">Personnel de la Région</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section: Gouverneur */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">Gouverneur</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffRegion.gouverneur_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffRegion.gouverneur_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffRegion.gouverneur_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffRegion.gouverneur_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffRegion.gouverneur_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffRegion.gouverneur_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffRegion.gouverneur_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: Secrétaire */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">Secrétaire</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffRegion.secretaire_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffRegion.secretaire_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffRegion.secretaire_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffRegion.secretaire_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffRegion.secretaire_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffRegion.secretaire_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffRegion.secretaire_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: Directeur de cabinet */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">Directeur de cabinet</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffRegion.directeur_cabinet_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffRegion.directeur_cabinet_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffRegion.directeur_cabinet_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffRegion.directeur_cabinet_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffRegion.directeur_cabinet_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffRegion.directeur_cabinet_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffRegion.directeur_cabinet_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: DAF */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">Directeur Administratif et Financier (DAF)</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffRegion.daf_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffRegion.daf_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffRegion.daf_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffRegion.daf_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffRegion.daf_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffRegion.daf_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffRegion.daf_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: Directeur Administratif */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">Directeur Administratif</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffRegion.directeur_admin_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffRegion.directeur_admin_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffRegion.directeur_admin_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffRegion.directeur_admin_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffRegion.directeur_admin_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffRegion.directeur_admin_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffRegion.directeur_admin_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: Directeur Infrastructure */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">Directeur Infrastructure</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffRegion.directeur_infra_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffRegion.directeur_infra_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffRegion.directeur_infra_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffRegion.directeur_infra_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffRegion.directeur_infra_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffRegion.directeur_infra_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffRegion.directeur_infra_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
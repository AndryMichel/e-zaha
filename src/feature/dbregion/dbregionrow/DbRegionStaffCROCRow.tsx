import React from "react";
import {StaffCrocRegion} from "@/services/types/dbregion.type";

// Fonction utilitaire pour afficher les valeurs
const displayValue = (value: string | number | null | undefined) => {
    return value || "Non spécifié";
};

// Fonction utilitaire pour formater les valeurs booléennes
const formatBoolean = (value: boolean) => {
    return value ? "Oui" : "Non";
};

export function DbRegionStaffCROCRow({StaffCrocRegion}: { StaffCrocRegion: StaffCrocRegion }) {
    return (
        <div className="mt-6">
            <h3 className="font-bold mb-4 text-xl text-blue-700">Personnel CROC</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section: Documentaliste */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">CROC - Documentaliste</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffCrocRegion.documentaliste_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffCrocRegion.documentaliste_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffCrocRegion.documentaliste_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffCrocRegion.documentaliste_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffCrocRegion.documentaliste_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffCrocRegion.documentaliste_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffCrocRegion.documentaliste_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: Responsable BDD */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">CROC - Responsable BDD</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_bdd_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_bdd_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_bdd_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_bdd_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_bdd_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_bdd_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffCrocRegion.responsable_bdd_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: Responsable Communication */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">CROC - Responsable Communication</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_comm_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_comm_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_comm_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_comm_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_comm_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_comm_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffCrocRegion.responsable_comm_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section: Responsable Suivi-Évaluation */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2 text-blue-600">CROC - Responsable Suivi-Évaluation</h3>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nom:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_se_nom)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sexe:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_se_sexe)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Téléphone:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_se_telephone)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut d&#39;emploi:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_se_statut_emploi)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Niveau d&#39;instruction:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_se_niveau_instruction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Diplôme:</td>
                            <td>{displayValue(StaffCrocRegion.responsable_se_diplome)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Statut actif:</td>
                            <td>{formatBoolean(StaffCrocRegion.responsable_se_statut)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
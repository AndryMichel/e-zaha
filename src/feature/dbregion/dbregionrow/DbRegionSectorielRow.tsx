"use client";

import React from "react";
import {IndicateursSectoriels} from "@/services/types/dbregion.type";

interface DbRegionSectorielRowProps {
    indicateurs: IndicateursSectoriels;
}

export function DbRegionSectorielRow({indicateurs}: DbRegionSectorielRowProps) {
    // Formatter pour les valeurs en pourcentage
    const formatPercentage = (value: unknown) => {
        const num = Number(value);
        return isNaN(num) ? "N/A" : `${num.toFixed(1)}%`;
    };

    // Helper function pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section: Eau et Assainissement */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Eau et Assainissement</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Taux d&#39;accès à l&#39;eau de base:</td>
                        <td>{formatPercentage(indicateurs.taux_acces_eau_base)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Taux d&#39;accès à l&#39;assainissement:</td>
                        <td>{formatPercentage(indicateurs.taux_acces_assainissement_base)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Nombre de communes ODF:</td>
                        <td>{displayValue(indicateurs.nombre_commune_odf)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Énergie et Foncier */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Énergie et Foncier</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Taux d&#39;accès à l&#39;électricité:</td>
                        <td>{formatPercentage(indicateurs.taux_acces_electricite)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Certificats fonciers distribués:</td>
                        <td>{displayValue(indicateurs.effectif_certificats_fonciers_distribues)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Titres cadastrés distribués:</td>
                        <td>{displayValue(indicateurs.effectif_titres_cadastres_distribues)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Éducation */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Éducation</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Taux brut de scolarisation primaire:</td>
                        <td>{formatPercentage(indicateurs.taux_brut_scolarisation_primaire)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Taux d&#39;abandon scolaire primaire:</td>
                        <td>{formatPercentage(indicateurs.taux_abandon_scolaire_primaire)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Santé */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Santé</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Ratio centres de santé/population:</td>
                        <td>{displayValue(indicateurs.ratio_fs_fonctionnel_population)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Ratio personnel santé/population:</td>
                        <td>{displayValue(indicateurs.ratio_personnel_sante_population)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Nutrition et Protection Sociale */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Nutrition et Protection Sociale</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Taux de malnutrition aiguë:</td>
                        <td>{formatPercentage(indicateurs.taux_malnutrition_aigue)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Taux d&#39;insécurité alimentaire:</td>
                        <td>{formatPercentage(indicateurs.taux_insecurite_alimentaire)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Bénéficiaires filets de sécurité sociale:</td>
                        <td>{displayValue(indicateurs.nombre_beneficiaire_filet_securite_sociale)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Agriculture */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Agriculture</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Culture phare:</td>
                        <td>{indicateurs.culture_phare ? indicateurs.culture_phare_details : "Non"}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Rendement par hectare:</td>
                        <td>{displayValue(indicateurs.rendement_culture_ha)} t/ha</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Élevage */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Élevage</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Élevage phare:</td>
                        <td>{indicateurs.elevage_phare ? indicateurs.elevage_phare_details : "Non"}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Nombre de têtes:</td>
                        <td>{displayValue(indicateurs.nombre_tete_elevage)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Produits Halieutiques */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Produits Halieutiques</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Produit halieutique phare:</td>
                        <td>{indicateurs.produit_halieutique_phare ? indicateurs.produit_halieutique_details : "Non"}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Production (tonnes):</td>
                        <td>{displayValue(indicateurs.production_halieutique_tonnes)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Section: Entreprises */}
            <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-blue-600">Indicateurs - Économie</h3>
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Nombre d&#39;entreprises dans la région:</td>
                        <td>{displayValue(indicateurs.nombre_entreprises_region)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
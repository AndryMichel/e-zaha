"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneInfoGenRowProps {
    commune: Commune;
}

export function DbCommuneInfoGenRow({commune}: DbCommuneInfoGenRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined
    const displayValue = (value: string | number | boolean | null | undefined): string => {
        return value === null || value === undefined ? "N/A" : String(value);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Informations Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Localisation</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">ID:</td>
                            <td>{displayValue(commune.id_situation_geographique)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Commune:</td>
                            <td>{displayValue(commune.localisation.commune)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">District:</td>
                            <td>{displayValue(commune.localisation.district)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Région:</td>
                            <td>{displayValue(commune.localisation.region)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Province:</td>
                            <td>{displayValue(commune.localisation.province)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Catégorie:</td>
                            <td>{displayValue(commune.localisation.categorie_commune)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Superficie:</td>
                            <td>{displayValue(commune.superficie)} km²</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Limites</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Nord:</td>
                            <td>{displayValue(commune.nord)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Sud:</td>
                            <td>{displayValue(commune.sud)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Est:</td>
                            <td>{displayValue(commune.est)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Ouest:</td>
                            <td>{displayValue(commune.ouest)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Coordonnées</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Distance du chef-lieu district:</td>
                            <td>{displayValue(commune.coordonnees.distance_chef_lieu_district)} km</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Distance du chef-lieu région:</td>
                            <td>{displayValue(commune.coordonnees.distance_chef_lieu_region)} km</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">GPS:</td>
                            <td>{displayValue(commune.coordonnees.gps_de_la_commune)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Latitude:</td>
                            <td>{displayValue(commune.coordonnees.latitude)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Longitude:</td>
                            <td>{displayValue(commune.coordonnees.longitude)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Altitude:</td>
                            <td>{displayValue(commune.coordonnees.altitude)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Bureau de la commune</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose d&#39;un bureau:</td>
                            <td>{commune.informations_commune.dispose_bureau ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Type d&#39;occupation:</td>
                            <td>{displayValue(commune.informations_commune.type_occupation)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Année de construction:</td>
                            <td>{displayValue(commune.informations_commune.annee_construction)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Dernière réhabilitation:</td>
                            <td>{displayValue(commune.informations_commune.annee_derniere_rehabilitation)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">État actuel:</td>
                            <td>{displayValue(commune.informations_commune.etat_actuel)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Nombre de salles:</td>
                            <td>{displayValue(commune.informations_commune.nombre_salles)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Outils informatiques</h4>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-1 font-medium">Dispose d&#39;outils:</td>
                            <td>{commune.outils_informatiques.dispose_outils ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Ordinateurs:</td>
                            <td>{displayValue(commune.outils_informatiques.nombre_ordinateurs)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Imprimantes:</td>
                            <td>{displayValue(commune.outils_informatiques.nombre_imprimantes)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Internet:</td>
                            <td>{commune.outils_informatiques.dispose_internet ? "Oui" : "Non"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Type de connexion:</td>
                            <td>{displayValue(commune.outils_informatiques.principale_connexion)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
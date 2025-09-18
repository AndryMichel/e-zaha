"use client";

import React from "react";
import {Commune} from "@/services/types/dbcommune.type";

interface DbCommuneEnvironnementRowProps {
    environnement: Commune["environnement"];
}

export function DbCommuneEnvironnementRow({environnement}: DbCommuneEnvironnementRowProps) {
    // Helper pour afficher les valeurs, avec N/A pour null/undefined

    const formatBoolean = (value: boolean) => {
        return value ? "Oui" : "Non";
    };

    return (
        <div className="bg-gray-50 p-4 rounded-md col-span-2">
            <h3 className="font-bold mb-2 text-blue-600">Environnement</h3>
            <div className="grid grid-cols-1 gap-4">
                <table className="w-full">
                    <tbody>
                    <tr>
                        <td className="py-1 font-medium">Existence GRC (Gestion des Risques et Catastrophes):</td>
                        <td>{formatBoolean(environnement.existence_grc)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Réalisation de filtrations:</td>
                        <td>{formatBoolean(environnement.realisation_filtrations)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-medium">Réalisation de protection:</td>
                        <td>{formatBoolean(environnement.realisation_protection)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
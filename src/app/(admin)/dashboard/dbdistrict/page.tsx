"use client";

import React, {Suspense} from "react";
import {CommuneInDistrictList} from "@/feature/dbDistrict/CommuneInDistrictList";

// Composant de chargement simple
const Loading = () => <div className="p-4">Chargement des données...</div>;

export default function SuiviEvaluationPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Suivi et Évaluation des Communes</h1>
            <Suspense fallback={<Loading/>}>
                <CommuneInDistrictList/>
            </Suspense>
        </div>
    );
}
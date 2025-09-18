'use client';

import {DbCommuneContent} from "@/feature/dbcommune/DbCommuneContent";
import {Suspense, useEffect} from "react";
import {useSearchParams} from "next/navigation";

// Create a separate component that uses useSearchParams
function DbCommuneWithTitle() {
    const searchParams = useSearchParams();
    const communeName = searchParams.get('commune_name');

    useEffect(() => {
        if (communeName) {
            document.title = `Données de ${decodeURIComponent(communeName)} | MDAT`;
        } else {
            document.title = "Données communales | MDAT";
        }
    }, [communeName]);

    return <DbCommuneContent/>;
}

// Main page component with Suspense
export default function DbCommunePage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <DbCommuneWithTitle/>
        </Suspense>
    );
}
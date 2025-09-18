// app/dashboard/actualites/page.tsx
import {DocumentsAdminPage} from "@/feature/document/DocumentsAdminPage";

export default function DashboardActualitesPage() {
    return <DocumentsAdminPage/>;
}

// Métadonnées pour la page
export const metadata = {
    title: "Gestion des Actualités - Dashboard ODDL",
    description: "Interface d'administration pour la gestion des actualités et annonces de l'ODDL",
};
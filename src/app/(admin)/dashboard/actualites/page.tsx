// app/dashboard/actualites/page.tsx
import {ActualitesAdminPage} from "@/feature/actualites/ActualitesAdminPage";

export default function DashboardActualitesPage() {
    return <ActualitesAdminPage/>;
}

// Métadonnées pour la page
export const metadata = {
    title: "Gestion des Actualités - Dashboard ODDL",
    description: "Interface d'administration pour la gestion des actualités et annonces de l'ODDL",
};
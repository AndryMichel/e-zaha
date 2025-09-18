"use client";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {useGetAllDbCommune} from "@/services/api/commune/get-dbCommune.api";
import {DbCommuneRow} from "@/feature/dbcommune/DbCommuneRow";
import {ChevronLeft, ChevronRight, Search} from "lucide-react";

// Define table columns
const COLUMNS = [
    {id: "id_situation_geographique", label: "ID", sortable: true},
    {id: "localisation.commune", label: "Commune", sortable: true},
    {id: "localisation.district", label: "District", sortable: true},
    {id: "localisation.region", label: "Région", sortable: true},
    {id: "localisation.province", label: "Province", sortable: true},
    {id: "superficie", label: "Superficie (km²)", sortable: true},
    {id: "personnel_cle.maire.nom_prenoms", label: "Maire", sortable: true},
    {id: "situation_demographique.effectif_total", label: "Population", sortable: true},
    {id: "etablissements_educatifs.primaire.effectif_total", label: "Écoles primaires", sortable: true},
    {id: "centres_de_sante.csb1.dispose", label: "CSB1", sortable: false},
    {id: "centres_de_sante.csb2.dispose", label: "CSB2", sortable: false},
    {id: "actions", label: "Actions", sortable: false}
];

export function DbCommuneContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const communeCodeFromUrl = searchParams.get('commune_code');
    const communeNameFromUrl = searchParams.get('commune_name');
    const districtCodeFromUrl = searchParams.get('district_code');
    const districtNameFromUrl = searchParams.get('district_name');
    const regionCodeFromUrl = searchParams.get('region_code');
    const regionNameFromUrl = searchParams.get('region_name');

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("id_situation_geographique");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const [filterByCommune, setFilterByCommune] = useState<string | null>(null);
    const [filterByDistrict, setFilterByDistrict] = useState<string | null>(null);
    const [filterByRegion, setFilterByRegion] = useState<string | null>(null);

    const {data: session} = useSession();
    const userRole = session?.user?.role;
    const userCommune = session?.user?.location?.commune_code as string | undefined;
    const userDistrict = session?.user?.location?.district_code as string | undefined;
    const userRegion = session?.user?.location?.region_code as string | undefined;

    // Filtrage automatique selon le rôle de l'utilisateur
    useEffect(() => {
        if (userRole === "communal" && userCommune) {
            const communeCode = Array.isArray(userCommune) ? userCommune[0] : userCommune;
            setFilterByCommune(communeCode);
        } else if (userRole === "district" && userDistrict) {
            const districtCode = Array.isArray(userDistrict) ? userDistrict[0] : userDistrict;
            setFilterByDistrict(districtCode);
        } else if (userRole === "regional" && userRegion) {
            const regionCode = Array.isArray(userRegion) ? userRegion[0] : userRegion;
            setFilterByRegion(regionCode);
        }
    }, [userRole, userCommune, userDistrict, userRegion]);

    // Effet pour gérer l'autofiltre par commune, district et région depuis l'URL
    useEffect(() => {
        if (communeCodeFromUrl) {
            setFilterByCommune(communeCodeFromUrl);
        } else if (districtCodeFromUrl) {
            setFilterByDistrict(districtCodeFromUrl);
        } else if (regionCodeFromUrl) {
            setFilterByRegion(regionCodeFromUrl);
        }
    }, [communeCodeFromUrl, districtCodeFromUrl, regionCodeFromUrl]);

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllDbCommune({
        page,
        limit: 20,
        search,
        sort_by: sortBy,
        order,
        filter_by_code_commune: filterByCommune,
        filter_by_code_district: !filterByCommune ? filterByDistrict : null,
        filter_by_code_region: !filterByCommune && !filterByDistrict ? filterByRegion : null
    });

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleSort = (field: string) => {
        if (field === "actions" || !field) return;

        if (sortBy === field) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setOrder("asc");
        }
    };

    const handleDelete = () => {
        mutate();
    };

    const handleBackToRegionView = () => {
        router.back();
    };

    // Fonction pour obtenir le titre selon le contexte
    const getPageTitle = () => {
        if (communeCodeFromUrl && communeNameFromUrl) {
            return `Commune: ${decodeURIComponent(communeNameFromUrl)}`;
        }
        if (districtCodeFromUrl && districtNameFromUrl) {
            return `District: ${decodeURIComponent(districtNameFromUrl)}`;
        }
        if (regionCodeFromUrl && regionNameFromUrl) {
            return `Région: ${decodeURIComponent(regionNameFromUrl)}`;
        }
        if (userRole === "communal" && session?.user?.location?.commune) {
            return `Ma commune: ${session.user.location.commune}`;
        }
        if (userRole === "district" && session?.user?.location?.district) {
            return `Mon district: ${session.user.location.district}`;
        }
        if (userRole === "regional" && session?.user?.location?.region) {
            return `Ma région: ${session.user.location.region}`;
        }
        return "Gestion de données communales";
    };

    // Vérification si l'utilisateur a accès aux données
    const hasDataAccess = () => {
        if (userRole === "administrateur" || userRole === "ODDL") return true;
        if (userRole === "regional" && filterByRegion) return true;
        if (userRole === "district" && filterByDistrict) return true;
        if (userRole === "communal" && filterByCommune) return true;
        return false;
    };

    // Fonction pour obtenir les classes CSS selon la colonne
    const getColumnClasses = (columnId: string) => {
        const baseClasses = "font-semibold text-gray-700 whitespace-nowrap px-4";

        switch (columnId) {
            case "id_situation_geographique":
                return `${baseClasses} min-w-[120px]`;
            case "localisation.commune":
                return `${baseClasses} min-w-[180px]`;
            case "localisation.district":
                return `${baseClasses} min-w-[170px]`;
            case "localisation.region":
                return `${baseClasses} min-w-[160px]`;
            case "localisation.province":
                return `${baseClasses} min-w-[160px]`;
            case "superficie":
                return `${baseClasses} min-w-[140px]`;
            case "personnel_cle.maire.nom_prenoms":
                return `${baseClasses} min-w-[150px]`;
            case "situation_demographique.effectif_total":
                return `${baseClasses} min-w-[120px]`;
            case "etablissements_educatifs.primaire.effectif_total":
                return `${baseClasses} min-w-[140px]`;
            case "centres_de_sante.csb1.dispose":
            case "centres_de_sante.csb2.dispose":
                return `${baseClasses} min-w-[80px]`;
            case "actions":
                return `${baseClasses} min-w-[200px]`;
            default:
                return `${baseClasses} min-w-[120px]`;
        }
    };

    // Message si pas d'accès
    if (!hasDataAccess()) {
        return (
            <div className="h-full flex flex-col">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-800">Accès restreint</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">
                                Vous n&#39;avez pas accès aux données communales.
                            </p>
                            <p className="text-sm text-gray-500">
                                Contactez votre administrateur si vous pensez qu&#39;il s&#39;agit d&#39;une erreur.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <Card className="flex-1 flex flex-col min-h-0">
                <CardHeader className="shrink-0 pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">{getPageTitle()}</CardTitle>

                    {/* Bouton retour et contexte */}
                    {((communeCodeFromUrl && communeNameFromUrl) ||
                        (districtCodeFromUrl && districtNameFromUrl) ||
                        (regionCodeFromUrl && regionNameFromUrl)) && (
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBackToRegionView}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft size={16}/>
                                Retour
                            </Button>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
                    {/* Barre de recherche et pagination - Fixe */}
                    <div className="shrink-0 space-y-4">
                        {/* Recherche */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                                <Input
                                    type="text"
                                    placeholder="Rechercher dans les données communales..."
                                    value={searchInput}
                                    onChange={handleSearchInput}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleSearch} size="default">
                                Rechercher
                            </Button>
                        </div>

                        {/* Pagination et statistiques */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
                            <div className="text-gray-600">
                                Affichage: {data?.length || 0} / {total || 0} résultats
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="flex items-center gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4"/>
                                    Précédent
                                </Button>
                                <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                                    Page {page} / {totalPages || 1}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page >= (totalPages || 1)}
                                    onClick={() => setPage(p => p + 1)}
                                    className="flex items-center gap-1"
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tableau avec scroll séparé */}
                    <div className="flex-1 min-h-0 border rounded-lg bg-white overflow-x-auto">
                        {isError ? (
                            <div className="flex items-center justify-center h-full min-w-full">
                                <div className="text-center">
                                    <div className="text-red-500 text-lg mb-2">⚠️</div>
                                    <div className="text-red-500 font-medium">Erreur lors du chargement des données
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1">Veuillez réessayer plus tard</div>
                                </div>
                            </div>
                        ) : (
                            <div className="min-w-max h-full flex flex-col">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-white z-10 border-b">
                                        <TableRow>
                                            {COLUMNS.map((column, index) => (
                                                <TableHead
                                                    key={index}
                                                    onClick={() => column.sortable && toggleSort(column.id)}
                                                    className={`${
                                                        column.sortable
                                                            ? "cursor-pointer hover:bg-gray-50 select-none"
                                                            : ""
                                                    } ${getColumnClasses(column.id)}`}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {column.label}
                                                        {column.sortable && sortBy === column.id && (
                                                            <span className="text-blue-500">
                                                                {order === "asc" ? "↑" : "↓"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                </Table>

                                {/* Corps du tableau avec scroll vertical séparé */}
                                <div className="flex-1 overflow-y-auto">
                                    <Table>
                                        <TableBody>
                                            {isLoading ? (
                                                // Loading skeleton
                                                [...Array(10)].map((_, i) => (
                                                    <TableRow key={i}>
                                                        {COLUMNS.map((column, j) => (
                                                            <TableCell key={j}
                                                                       className={getColumnClasses(column.id).replace('font-semibold text-gray-700', '') + ' py-3'}>
                                                                <div
                                                                    className="animate-pulse h-4 bg-gray-200 rounded"></div>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                            ) : data && data.length > 0 ? (
                                                // Données réelles
                                                data.map((commune) => (
                                                    <DbCommuneRow
                                                        key={commune.id_situation_geographique}
                                                        commune={commune}
                                                        onDelete={handleDelete}
                                                    />
                                                ))
                                            ) : (
                                                // Aucun résultat
                                                <TableRow>
                                                    <TableCell colSpan={COLUMNS.length} className="h-32">
                                                        <div
                                                            className="flex flex-col items-center justify-center text-gray-500">
                                                            <div className="text-4xl mb-2">📭</div>
                                                            <div className="font-medium">
                                                                {userRole === "communal"
                                                                    ? "Aucune donnée trouvée pour votre commune."
                                                                    : userRole === "district"
                                                                        ? "Aucune donnée trouvée pour votre district."
                                                                        : userRole === "regional"
                                                                            ? "Aucune donnée trouvée pour votre région."
                                                                            : search
                                                                                ? `Aucun résultat pour "${search}"`
                                                                                : "Aucune donnée disponible"
                                                                }
                                                            </div>
                                                            {search && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSearch("");
                                                                        setSearchInput("");
                                                                    }}
                                                                    className="text-blue-500 text-sm mt-2 hover:underline"
                                                                >
                                                                    Effacer la recherche
                                                                </button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
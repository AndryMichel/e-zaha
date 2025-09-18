// feature/dbregion/DbRegionContent.tsx - Version mise à jour

"use client";

import React, {useState} from "react";
import {useSession} from "next-auth/react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {useGetAllRegions} from "@/services/api/region/get-dbregion.api";
import {DbRegionRow} from "@/feature/dbregion/DbRegionRow";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/molécules/tabs";
import {DistrictInRegionList} from "@/feature/dbregion/DistrictInRegionList";
import {AllRegionsList} from "@/feature/dbregion/AllRegionsList";

// Define table columns
const COLUMNS = [
    {id: "id_situation_geographique", label: "ID", sortable: true},
    {id: "region_nom", label: "Région", sortable: true},
    {id: "effectif_commune", label: "Communes", sortable: true},
    {id: "effectif_district", label: "Districts", sortable: true},
    {id: "superficie_region_km2", label: "Superficie (km²)", sortable: true},
    {id: "gouvernance_region.src_operationnelle", label: "SRC Opérationnelle", sortable: false},
    {id: "gouvernance_region.srat_a_jour", label: "SRAT à jour", sortable: false},
    {id: "gouvernance_region.prd_a_jour", label: "PRD à jour", sortable: false},
    {id: "environnement_region.structure_gestion_risques", label: "Structure risques", sortable: false},
    {id: "staff_region.gouverneur_nom", label: "Gouverneur", sortable: true},
    {id: "indicateurs_sectoriels.taux_acces_eau_base", label: "Accès eau (%)", sortable: true},
    {id: "indicateurs_sectoriels.taux_acces_electricite", label: "Accès électricité (%)", sortable: true},
    {id: "actions", label: "Actions", sortable: false}
];

export function DbRegionContent() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("id_situation_geographique");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

    const {data: session} = useSession();
    const userRole = session?.user?.role;
    const code_region = session?.user?.location?.region_code;

    // ✅ AMÉLIORATION: Gestion plus robuste du code région
    const regionCode = Array.isArray(code_region) ? code_region[0] : code_region;

    console.log("📋 Filtrage région actif:");
    console.log("  - user_role:", userRole);
    console.log("  - region_code:", regionCode);

    // ✅ MODIFICATION: Déterminer quels onglets afficher selon le rôle
    const getTabsConfiguration = () => {
        switch (userRole) {
            case "regional":
                return {
                    showRegionTab: true,
                    showSecondTab: true,
                    secondTabValue: "districts",
                    secondTabLabel: "Districts de ma région"
                };
            case "administrateur":
            case "ODDL":
                return {
                    showRegionTab: true,
                    showSecondTab: true,
                    secondTabValue: "regions",
                    secondTabLabel: "Toutes les régions"
                };
            default:
                return {
                    showRegionTab: true,
                    showSecondTab: false,
                    secondTabValue: "",
                    secondTabLabel: ""
                };
        }
    };

    const tabsConfig = getTabsConfiguration();

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllRegions({
        page,
        limit: 50,
        search,
        sort_by: sortBy,
        order,
        filter_by_code_region: regionCode // ✅ filtre automatique ici
    });

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
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

    // ✅ AJOUT: Fonction pour obtenir le titre selon le contexte
    const getPageTitle = () => {
        if (userRole === "regional" && session?.user?.location?.region) {
            const regionName = Array.isArray(session.user.location.region)
                ? session.user.location.region[0]
                : session.user.location.region;
            return ` Région: ${regionName}`;
        }
        return "Gestion de données régionales";
    };

    // ✅ AJOUT: Vérification si l'utilisateur a accès aux données
    const hasDataAccess = () => {
        if (userRole === "administrateur" || userRole === "ODDL") return true;
        if (userRole === "regional" && regionCode) return true;
        return false;
    };

    // ✅ AJOUT: Message si pas d'accès
    if (!hasDataAccess()) {
        return (
            <div className="p-2 bg-gray-100">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                                Vous n&#39;avez pas accès aux données régionales.
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
        <div className="p-2 bg-gray-100">
            <Card>
                <Tabs defaultValue="region" className="w-full">
                    <TabsList className="mb-4 flex space-x-4 px-4 pt-4">
                        {tabsConfig.showRegionTab && (
                            <TabsTrigger value="region">Tableau Région</TabsTrigger>
                        )}
                        {tabsConfig.showSecondTab && (
                            <TabsTrigger value={tabsConfig.secondTabValue}>
                                {tabsConfig.secondTabLabel}
                            </TabsTrigger>
                        )}
                    </TabsList>

                    {tabsConfig.showRegionTab && (
                        <TabsContent value="region" className="p-0">
                            <CardContent>
                                {/* ✅ AJOUT: Titre dynamique */}
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h2>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                                    <div className="flex gap-2 w-full sm:w-1/2">
                                        <Input
                                            type="text"
                                            placeholder="Rechercher dans les données régionales..."
                                            value={searchInput}
                                            onChange={handleSearchInput}
                                        />
                                        <Button onClick={handleSearch}>Rechercher</Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                            Page précédente
                                        </Button>
                                        <span className="text-gray-600">
                                            Page {page} / {totalPages || 1} • {data?.length || 0} / {total || 0}
                                        </span>
                                        <Button size="sm" disabled={page >= (totalPages || 1)}
                                                onClick={() => setPage(p => p + 1)}>
                                            Page suivante
                                        </Button>
                                    </div>
                                </div>

                                {isError ? (
                                    <div className="text-red-500">Erreur lors du chargement des données.</div>
                                ) : (
                                    <div className="overflow-auto border rounded-md max-h-[80vh]">
                                        <Table>
                                            <TableHeader className="sticky top-0 bg-white">
                                                <TableRow>
                                                    {COLUMNS.map((column, index) => (
                                                        <TableHead
                                                            key={index}
                                                            onClick={() => column.sortable && toggleSort(column.id)}
                                                            className={column.sortable ? "cursor-pointer hover:underline" : ""}
                                                        >
                                                            {column.label} {sortBy === column.id ? (order === "asc" ? "↑" : "↓") : ""}
                                                        </TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isLoading ? (
                                                    [...Array(5)].map((_, i) => (
                                                        <TableRow key={i}>
                                                            {[...Array(COLUMNS.length)].map((_, j) => (
                                                                <TableCell key={j}>
                                                                    <div
                                                                        className="animate-pulse h-4 bg-gray-200 rounded"></div>
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : data && data.length > 0 ? (
                                                    data.map((region) => (
                                                        <DbRegionRow
                                                            key={region.id_situation_geographique}
                                                            region={region}
                                                            onDelete={handleDelete}
                                                        />
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={COLUMNS.length}
                                                                   className="text-center py-8 text-gray-500">
                                                            {userRole === "regional"
                                                                ? "Aucune donnée trouvée pour votre région."
                                                                : "Aucun résultat trouvé."
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </TabsContent>
                    )}

                    {/* ✅ MODIFICATION: Onglet conditionnel selon le rôle */}
                    {tabsConfig.showSecondTab && tabsConfig.secondTabValue === "districts" && (
                        <TabsContent value="districts" className="p-4">
                            <DistrictInRegionList
                                selectedRegionCode={regionCode ?? null}
                                selectedRegionName={Array.isArray(session?.user?.location?.region)
                                    ? session.user.location.region[0]
                                    : session?.user?.location?.region ?? null}
                            />
                        </TabsContent>
                    )}

                    {tabsConfig.showSecondTab && tabsConfig.secondTabValue === "regions" && (
                        <TabsContent value="regions" className="p-4">
                            <AllRegionsList/>
                        </TabsContent>
                    )}
                </Tabs>
            </Card>
        </div>
    );
}
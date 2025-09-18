// feature/dbregion/AllRegionsList.tsx

"use client";

import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, UserCheck} from "lucide-react";

import {RegionSummary, useGetAllRegionsSummary} from "@/services/api/region/get-all-regions-summary.api";

import {Card, CardContent} from "@/components/ui/molécules/card";
import {Input} from "@/components/ui/atomes/input";
import {Button} from "@/components/ui/atomes/button";
import Skeleton from "@/components/ui/atomes/skeleton";

export function AllRegionsList() {
    const router = useRouter();
    const {data: session} = useSession();
    const userRole = session?.user?.role;

    // ✅ Vérifier si on doit masquer les utilisateurs pour admin/oddl
    const shouldHideUserCount = userRole === "administrateur" || userRole === "ODDL";

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("region_name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const limit = 50;
    const [loadingRegionCode, setLoadingRegionCode] = useState<string | null>(null);

    const {regions, total, currentPage, totalPages, isLoading, isError} =
        useGetAllRegionsSummary(page, limit, search, sortBy, sortOrder);

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
        setPage(1);
    };

    const navigateToRegionDetails = (region: RegionSummary) => {
        setLoadingRegionCode(region.region_code);
        // Naviguer vers la page de détails de la région ou vers les districts
        router.push(`/dashboard/dbregion?region_code=${region.region_code}&region_name=${encodeURIComponent(region.region_name)}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 w-full max-w-sm">
                <Input
                    type="text"
                    placeholder="Rechercher une région..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="text-xs"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm" className="text-xs">
                    Rechercher
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
                <div>
                    <div className="text-sm font-medium flex items-center">
                        <span>Toutes les régions</span>
                        <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                            {total}
                        </span>
                    </div>
                </div>

                {!isLoading && !isError && totalPages > 1 && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="h-8 w-8"
                        >
                            <ChevronLeft size={16}/>
                        </Button>
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="h-8 w-8"
                        >
                            <ChevronRight size={16}/>
                        </Button>
                    </div>
                )}
            </div>

            {/* Boutons de tri */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant={sortBy === "region_name" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSort("region_name")}
                >
                    Nom {sortBy === "region_name" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
                {/*<Button*/}
                {/*    variant={sortBy === "district_count" ? "default" : "outline"}*/}
                {/*    size="sm"*/}
                {/*    onClick={() => handleSort("district_count")}*/}
                {/*>*/}
                {/*    Districts {sortBy === "district_count" && (sortOrder === "asc" ? "↑" : "↓")}*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*    variant={sortBy === "commune_count" ? "default" : "outline"}*/}
                {/*    size="sm"*/}
                {/*    onClick={() => handleSort("commune_count")}*/}
                {/*>*/}
                {/*    Communes {sortBy === "commune_count" && (sortOrder === "asc" ? "↑" : "↓")}*/}
                {/*</Button>*/}
            </div>

            {isError ? (
                <div className="text-red-500 text-sm">
                    Erreur lors du chargement des régions.
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton count={6} height={120} borderRadius={8}/>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regions.map((region, index) => (
                        <Card
                            key={`${region.region_code}-${index}`}
                            className="cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
                            onClick={() => navigateToRegionDetails(region)}
                        >
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                                            <MapPin size={16} className="text-blue-600"/>
                                            {region.region_name}
                                            {loadingRegionCode === region.region_code && (
                                                <span className="inline-block animate-pulse">⟳</span>
                                            )}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Code: {region.region_code}
                                        </p>
                                    </div>
                                </div>

                                {/*<div className="grid grid-cols-2 gap-2 text-xs">*/}
                                {/*    <div className="flex items-center gap-1">*/}
                                {/*        <Building2 size={12} className="text-gray-500"/>*/}
                                {/*        <span>{region.district_count} districts</span>*/}
                                {/*    </div>*/}
                                {/*    <div className="flex items-center gap-1">*/}
                                {/*        <Users size={12} className="text-gray-500"/>*/}
                                {/*        <span>{region.commune_count} communes</span>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/* ✅ Afficher le compteur utilisateurs seulement si pas admin/oddl */}
                                {!shouldHideUserCount && (
                                    <div className="flex items-center gap-1 text-xs">
                                        <UserCheck size={12} className="text-purple-600"/>
                                        <span>{region.utilisateurs_count} utilisateurs</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
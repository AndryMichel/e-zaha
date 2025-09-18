"use client";

import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {CheckCircle, ChevronLeft, ChevronRight, XCircle} from "lucide-react";

import {Card, CardContent} from "@/components/ui/molécules/card";
import {Input} from "@/components/ui/atomes/input";
import {Button} from "@/components/ui/atomes/button";
import {useGetCommuneInRegion} from "@/services/api/region/get-commune-liste-trie.api";
import Skeleton from "@/components/ui/atomes/skeleton";

export function CommuneList() {
    const {data: session} = useSession();
    const userRole = session?.user?.role;

    // Déterminer le code de région en fonction du rôle
    const getRegionCode = (): string => {
        if (userRole === "ODDL" || userRole === "administrateur") {
            return "all";
        }

        const code = session?.user?.location?.region_code;
        if (Array.isArray(code)) {
            return code[0] || "";
        }

        return code || "";
    };


    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 100; // Nombre de communes par page

    const regionCode = getRegionCode();

    const {communes, total, currentPage, totalPages, isLoading, isError} = useGetCommuneInRegion(
        regionCode,
        page,
        limit,
        search
    );

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1); // Réinitialiser à la première page lors d'une recherche
    };

    // Préparation du titre de la section
    const regionTitle = regionCode === "all"
        ? "Toutes les communes"
        : `Communes de la région ${session?.user?.location?.region || ''}`;

    return (
        <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="flex gap-2 w-full max-w-sm">
                <Input
                    type="text"
                    placeholder="Rechercher une commune..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="text-xs"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm" className="text-xs">Rechercher</Button>
            </div>

            {/* En-tête avec titre et pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
                <div className="text-sm font-medium flex items-center">
                    <span>{regionTitle}</span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                        {total}
                    </span>
                </div>

                {/* Pagination à droite */}
                {!isLoading && !isError && totalPages > 1 && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
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
                            onClick={() => setPage(p => p + 1)}
                            className="h-8 w-8"
                        >
                            <ChevronRight size={16}/>
                        </Button>
                    </div>
                )}
            </div>

            {/* Liste des communes */}
            {isError ? (
                <div className="text-red-500 text-sm">Erreur lors du chargement des communes.</div>
            ) : isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {[...Array(10)].map((_, index) => (
                        <Skeleton key={index} className="h-10 rounded-lg"/>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {communes.map((commune, index) => (
                        <Card
                            key={`${commune.commune_code}-${index}`}
                            className="cursor-pointer transition-transform hover:scale-105 hover:shadow-sm"
                            onClick={() => console.log(`Clicked on ${commune.commune_name}`)}
                        >
                            <CardContent className="p-2 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium truncate mr-1">{commune.commune_name}</span>
                                    <span className="text-xs text-gray-500 truncate">{commune.region_name}</span>
                                </div>
                                {commune.status_base ? (
                                    <CheckCircle size={14} className="text-green-600 flex-shrink-0"/>
                                ) : (
                                    <XCircle size={14} className="text-red-500 flex-shrink-0"/>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommuneList;
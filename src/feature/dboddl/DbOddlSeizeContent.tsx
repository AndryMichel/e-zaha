"use client";

import React, {useCallback, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {useGetAllOddSeize} from "@/services/api/oddl/get-odd-seize.api";
import ODDLSeizeRow from "./ODDLSeizeRow";

export function DbOddlSeizeContent() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("id_odds_16");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllOddSeize({
        page,
        limit: 10,
        search,
        sort_by: sortBy,
        order
    });


    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setOrder("asc");
        }
    };

    const handleDelete = useCallback(() => {
        mutate();
    }, [mutate]);

    return (
        <div className="p-2 bg-gray-100">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-xl font-bold">ODD 16 – Paix, Justice et Institutions
                        efficaces</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                        <div className="flex gap-2 w-full sm:w-1/2">
                            <Input
                                type="text"
                                placeholder="Rechercher dans les indicateurs..."
                                value={searchInput}
                                onChange={handleSearchInput}
                            />
                            <Button onClick={handleSearch}>Rechercher</Button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                Page précédente
                            </Button>
                            <span className="text-gray-600">
                                Page {page} / {totalPages || 1} • {data?.length || 0} / {total || 0}
                            </span>
                            <Button size="sm" disabled={page >= (totalPages || 1)} onClick={() => setPage(p => p + 1)}>
                                Page suivante
                            </Button>
                        </div>
                    </div>

                    {isError ? (
                        <div className="text-red-500">Erreur lors du chargement des données.</div>
                    ) : (
                        <div className="overflow-auto border rounded-md max-h-[600px]">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white">
                                    <TableRow>
                                        {[
                                            "ID",
                                            "Violences sexuelles",
                                            "Victimes signalées",
                                            "Population carcérale sans jugement",
                                            "Vindictes populaires",
                                            "Flux financiers illicites",
                                            "Indice corruption",
                                            "Satisfaction services publics",
                                            "Répartition postes",
                                            "Prise de décision ouverte",
                                            "Actions"
                                        ].map((col, i) => (
                                            <TableHead
                                                key={i}
                                                onClick={() => toggleSort(col.toLowerCase().replace(/\s/g, "_"))}
                                                className="cursor-pointer hover:underline"
                                            >
                                                {col} {sortBy === col.toLowerCase().replace(/\s/g, "_") ? (order === "asc" ? "↑" : "↓") : ""}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        [...Array(5)].map((_, i) => (
                                            <TableRow key={i}>
                                                {[...Array(11)].map((_, j) => (
                                                    <TableCell key={j}>
                                                        <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : data.length > 0 ? (
                                        data.map((odd) => <ODDLSeizeRow key={odd.id_odds_16} odd={odd}
                                                                        onDelete={handleDelete}/>)
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                                                Aucun résultat trouvé.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
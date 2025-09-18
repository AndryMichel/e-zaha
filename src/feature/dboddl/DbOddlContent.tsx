"use client";

import React, {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {useGetAllOddl} from "@/services/api/oddl/get-odd.api";
import {ODDLRow} from "./ODDLRow";

// Définition des colonnes du tableau
const COLUMNS = [
    {id: "id_localisation", label: "ID", sortable: true},
    {id: "notes_igl", label: "IGL", sortable: true},
    {id: "notes_pillier_a", label: "Pilier A", sortable: true},
    {id: "notes_pillier_b", label: "Pilier B", sortable: true},
    {id: "notes_pillier_c", label: "Pilier C", sortable: true},
    {id: "notes_pillier_d", label: "Pilier D", sortable: true},
    {id: "notes_scoring_moc", label: "MOC", sortable: true},
    {id: "notes_scoring_mr", label: "MR", sortable: true},
    {id: "notes_scoring_cgf", label: "CGF", sortable: true},
    {id: "scoring_ec", label: "EC", sortable: true},
    {id: "scoring_grh", label: "GRH", sortable: true},
    {id: "niveau_satisfaction", label: "Satisfaction", sortable: true},
    {id: "commune", label: "Commune", sortable: true},
    {id: "categorie_commune", label: "Catégorie", sortable: true},
    {id: "actions", label: "Actions", sortable: false}
];

export function DbOddlContent() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("id_localisation");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllOddl({
        page,
        limit: 50,
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


    return (
        <div className="p-2 bg-gray-100">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">ODDL – Gouvernance communale</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                        <div className="flex gap-2 w-full sm:w-1/2">
                            <Input
                                type="text"
                                placeholder="Rechercher dans les données ODDL..."
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
                            <Button size="sm" disabled={page >= (totalPages || 1)} onClick={() => setPage(p => p + 1)}>
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
                                                        <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : data && data.length > 0 ? (
                                        data.map((odd) => (
                                            <ODDLRow key={odd.id_localisation} odd={odd} onDelete={handleDelete}/>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={COLUMNS.length}
                                                       className="text-center py-8 text-gray-500">
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
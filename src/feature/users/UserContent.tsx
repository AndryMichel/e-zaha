"use client"

import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {UserRow} from "./UserRow";
import {useGetAllUsers} from "@/services/api/profil/get-all-user.api";
import {Button} from "@/components/ui/atomes/button";
import {Users} from "lucide-react";
import {Input} from "@/components/ui/atomes/input";

export function UserContent() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("nom");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

    const {users, isLoading, isError, totalPages, total, mutate} = useGetAllUsers({
        page,
        limit: 10,
        search,
        sort_by: sortBy,
        order,
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

    // Fonction pour actualiser la liste après suppression
    const handleUserDeleted = () => {
        mutate(); // Actualise les données SWR
    };

    return (
        <div className="bg-gray-100 p-2">
            <Card>
                <CardHeader className="text-gray-800 flex flex-row justify-between items-center">
                    <CardTitle className="text-2xl font-bold">Gestion des Utilisateurs</CardTitle>
                    <div className="bg-blue-100 text-blue-700 rounded-lg px-2 py-2 flex items-center">
                        <Users className="h-5 w-5 mr-2"/>
                        <span className="font-medium">Total: {total || 0} utilisateurs</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 w-1/2">
                            <Input
                                type="text"
                                placeholder="Rechercher par nom, email, username..."
                                className="border border-gray-300 rounded-md px-4 py-2"
                                value={searchInput}
                                onChange={handleSearchInput}
                            />
                            <Button onClick={handleSearch}>Rechercher</Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Page précédente
                            </Button>
                            <div className="text-gray-600 mx-2">
                                Page {page} / {totalPages || 1}
                                <span className="mx-2">•</span>
                                {users?.length || 0} / {total || 0}
                            </div>
                            <Button
                                size="sm"
                                disabled={page >= (totalPages || 1)}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Page suivante
                            </Button>
                        </div>
                    </div>

                    {isError ? (
                        <div className="text-red-500 p-4 bg-red-50 rounded-md">
                            Erreur lors de la récupération des utilisateurs
                        </div>
                    ) : (
                        <div className="overflow-auto max-h-[600px] border border-gray-200 rounded-md">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                    <TableRow>
                                        {["Utilisateur", "Contact", "Localisation", "Rôle", "Actions"].map((header, index) => (
                                            <TableHead
                                                key={index}
                                                onClick={() => toggleSort(header.toLowerCase())}
                                                className="cursor-pointer hover:underline"
                                            >
                                                {header} {sortBy === header.toLowerCase() ? (order === "asc" ? "\u2191" : "\u2193") : ""}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <UserRowSkeleton/>
                                    ) : users && users.length > 0 ? (
                                        users.map((user) => (
                                            <UserRow
                                                key={user.admin_id}
                                                user={user}
                                                onUserDeleted={handleUserDeleted}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                Aucun utilisateur trouvé
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

// Inline skeleton component for user rows only
function UserRowSkeleton() {
    return (
        <>
            {[...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {[...Array(6)].map((_, colIndex) => (
                        <TableCell key={colIndex}>
                            <div className="bg-gray-200 animate-pulse h-5 w-4/5 rounded"></div>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

export default UserContent;
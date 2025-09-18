// DirecteurAdminPage.tsx
"use client";

import React, {useCallback, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Badge} from "@/components/ui/atomes/badge";
import {Crown, Plus, User} from "lucide-react";
import {useGetAllDirecteur} from "@/services/api/directeur/directeur.api";
import {DirecteurItem} from "@/services/types/directeur.type";
import DirecteurRow from "@/feature/directeur/DirecteurRow";
import {CreateDirecteurModal} from "@/feature/directeur/CreateDirecteurModal";

export function DirecteurAdminPage() {
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllDirecteur({
        page,
        limit: 10,
        sort_by: sortBy,
        order
    });

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setOrder("asc");
        }
        setPage(1);
    };

    const handleDelete = useCallback(() => {
        mutate();
    }, [mutate]);

    const handleUpdate = useCallback(() => {
        mutate();
    }, [mutate]);

    const handleCreate = useCallback(() => {
        mutate();
        setIsCreateModalOpen(false);
    }, [mutate]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDirecteurActuel = () => {
        if (!data || data.length === 0) return null;
        // Le plus récent (premier dans la liste triée par date décroissante)
        return data[0];
    };

    const directeurActuel = getDirecteurActuel();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Directeurs</h1>
                    <p className="text-gray-600 mt-2">
                        Gérez les informations des directeurs. Le dernier ajouté est affiché sur la page publique.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Nouveau Directeur
                </Button>
            </div>

            {/* Statistiques et directeur actuel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <User className="h-6 w-6 text-blue-600"/>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{total || 0}</div>
                                <div className="text-sm text-gray-600">Total des directeurs</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Crown className="h-6 w-6 text-green-600"/>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-600 mb-1">Directeur actuel (affiché au public)</div>
                                {directeurActuel ? (
                                    <div className="font-medium text-gray-900">
                                        {directeurActuel.nom} {directeurActuel.prenom}
                                        <Badge variant="default" className="ml-2">Actuel</Badge>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">Aucun directeur enregistré</div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tableau des directeurs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5"/>
                        Liste des Directeurs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Pagination en haut */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                            Page {page} sur {totalPages || 1}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Précédent
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page >= (totalPages || 1)}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Suivant
                            </Button>
                        </div>
                    </div>

                    {isError ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 text-lg mb-2">Erreur lors du chargement</div>
                            <Button onClick={() => mutate()} variant="outline">
                                Réessayer
                            </Button>
                        </div>
                    ) : (
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead
                                            onClick={() => toggleSort("id")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            ID {sortBy === "id" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead>Photo</TableHead>
                                        <TableHead
                                            onClick={() => toggleSort("nom")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Nom {sortBy === "nom" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead>Prénom</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead
                                            onClick={() => toggleSort("created_at")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Créé le {sortBy === "created_at" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        // Skeleton loading
                                        [...Array(5)].map((_, i) => (
                                            <TableRow key={i}>
                                                {[...Array(8)].map((_, j) => (
                                                    <TableCell key={j}>
                                                        <div
                                                            className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : data.length > 0 ? (
                                        data.map((directeurItem: DirecteurItem, index: number) => (
                                            <DirecteurRow
                                                key={directeurItem.id}
                                                directeurItem={directeurItem}
                                                isActuel={index === 0} // Le premier est le directeur actuel
                                                onDelete={handleDelete}
                                                onUpdate={handleUpdate}
                                                formatDate={formatDate}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-12">
                                                <div className="text-gray-500">
                                                    <User className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                                                    <div className="text-lg font-medium mb-2">Aucun directeur trouvé
                                                    </div>
                                                    <div className="text-sm">
                                                        Commencez par ajouter le premier directeur
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination en bas */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Précédent
                            </Button>

                            <div className="flex gap-1">
                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                    const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                                    if (pageNum > totalPages) return null;

                                    return (
                                        <Button
                                            key={pageNum}
                                            size="sm"
                                            variant={page === pageNum ? "default" : "outline"}
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page >= (totalPages || 1)}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Suivant
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de création */}
            <CreateDirecteurModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreate}
            />
        </div>
    );
}
"use client";

import React, {useCallback, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Badge} from "@/components/ui/atomes/badge";
import {Camera, Filter, Plus} from "lucide-react";
import {useGetAllGalerie} from "@/services/api/galerie/galerie.api";
import {GALERIE_CATEGORIES, GalerieItem, GetAllGalerieParams} from "@/services/types/galerie.type";
import GalerieRow from "@/feature/galerie/GalerieRow";
import CreateGalerieModal from "@/feature/galerie/CreateGalerieModal";

export function GalerieAdminPage() {
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllGalerie({
        page,
        limit: 10,
        category: categoryFilter as GetAllGalerieParams['category'],
        date_from: dateFrom,
        date_to: dateTo,
        sort_by: sortBy,
        order
    });

    const resetFilters = () => {
        setCategoryFilter("all");
        setDateFrom("");
        setDateTo("");
        setPage(1);
    };

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

    const getCategoryVariant = (category: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (category) {
            case "formation":
                return "default";
            case "atelier":
                return "secondary";
            case "descente":
                return "destructive";
            case "partenariat":
                return "outline";
            case "directeurs":
                return "default";
            case "divers":
                return "outline";
            default:
                return "outline";
        }
    };

    const getCategoryLabel = (category: string): string => {
        const cat = GALERIE_CATEGORIES.find(c => c.id === category);
        return cat ? cat.name : category;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion de la Galerie</h1>
                    <p className="text-gray-600 mt-2">Ajoutez et gérez les images de la galerie par catégorie</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Nouvelle Image
                </Button>
            </div>

            {/* Filtres */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Filtre par catégorie */}
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Catégorie"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                {GALERIE_CATEGORIES.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Date de début */}
                        <div>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="Date de début"
                            />
                        </div>

                        {/* Date de fin */}
                        <div>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                placeholder="Date de fin"
                            />
                        </div>

                        {/* Bouton reset */}
                        <Button onClick={resetFilters} variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2"/>
                            Réinitialiser
                        </Button>
                    </div>

                    {/* Statistiques */}
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{data?.length || 0} / {total || 0} images</span>
                            {categoryFilter !== "all" && (
                                <Badge variant="outline">
                                    Catégorie: {getCategoryLabel(categoryFilter)}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau des images */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5"/>
                        Liste des Images
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
                                        <TableHead>Image</TableHead>
                                        <TableHead
                                            onClick={() => toggleSort("category")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Catégorie {sortBy === "category" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() => toggleSort("created_at")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Créé le {sortBy === "created_at" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        // Skeleton loading
                                        [...Array(5)].map((_, i) => (
                                            <TableRow key={i}>
                                                {[...Array(5)].map((_, j) => (
                                                    <TableCell key={j}>
                                                        <div
                                                            className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : data.length > 0 ? (
                                        data.map((galerieItem: GalerieItem) => (
                                            <GalerieRow
                                                key={galerieItem.id}
                                                galerieItem={galerieItem}
                                                onDelete={handleDelete}
                                                onUpdate={handleUpdate}
                                                formatDate={formatDate}
                                                getCategoryVariant={getCategoryVariant}
                                                getCategoryLabel={getCategoryLabel}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <div className="text-gray-500">
                                                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                                                    <div className="text-lg font-medium mb-2">Aucune image trouvée</div>
                                                    <div className="text-sm">
                                                        {categoryFilter !== "all" || dateFrom || dateTo
                                                            ? "Essayez de modifier vos critères de recherche"
                                                            : "Commencez par ajouter votre première image"
                                                        }
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
            <CreateGalerieModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreate}
            />
        </div>
    );
}
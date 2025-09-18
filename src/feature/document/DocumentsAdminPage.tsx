"use client"

import React, {useCallback, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Badge} from "@/components/ui/atomes/badge";
import {FileText, Filter, Plus, Search} from "lucide-react";
import {useGetAllDocuments} from "@/services/api/documents/document.api";
import {CATEGORY_LABELS, Document} from "@/services/types/document.type";
import {CreateDocumentModal} from "@/feature/document/CreateDocumentModal";
import {DocumentRow} from "@/feature/document/DocumentRow";

export function DocumentsAdminPage() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [categoryFilter, setcategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllDocuments({
        page,
        limit: 10,
        search,
        category: categoryFilter as "ressources" | "textes" | "travail" | "all",
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const resetFilters = () => {
        setSearchInput("");
        setSearch("");
        setcategoryFilter("all");
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
            case "ressources":
                return "default";
            case "textes":
                return "secondary";
            case "travail":
                return "outline";
            default:
                return "outline";
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Documents</h1>
                    <p className="text-gray-600 mt-2">Gérez les ressources, textes de lois et documents de travail</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Nouveau Document
                </Button>
            </div>

            {/* Filtres et recherche */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Recherche */}
                        <div className="lg:col-span-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Rechercher dans les titres et descriptions..."
                                    value={searchInput}
                                    onChange={handleSearchInput}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button onClick={handleSearch} variant="outline">
                                    <Search className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        {/* Filtre par catégorie */}
                        <Select value={categoryFilter} onValueChange={setcategoryFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Catégorie"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                <SelectItem value="ressources">Ressources</SelectItem>
                                <SelectItem value="textes">Textes et Lois</SelectItem>
                                <SelectItem value="travail">Document de travail</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Actions des filtres */}
                        <div className="flex gap-2">
                            <Button onClick={resetFilters} variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2"/>
                                Réinitialiser
                            </Button>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="flex justify-end items-center mt-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{data?.length || 0} / {total || 0} documents</span>
                            {categoryFilter !== "all" && <Badge
                                variant="outline">Catégorie: {CATEGORY_LABELS[categoryFilter as keyof typeof CATEGORY_LABELS]}</Badge>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau des documents */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5"/>
                        Liste des Documents
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
                                            onClick={() => toggleSort("id_doc")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            ID {sortBy === "id_doc" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() => toggleSort("category")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Catégorie {sortBy === "category" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() => toggleSort("titre")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Titre {sortBy === "titre" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Fichier</TableHead>
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
                                                {[...Array(7)].map((_, j) => (
                                                    <TableCell key={j}>
                                                        <div
                                                            className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : data.length > 0 ? (
                                        data.map((document: Document) => (
                                            <DocumentRow
                                                key={document.id_doc}
                                                document={document}
                                                onDelete={handleDelete}
                                                onUpdate={handleUpdate}
                                                formatDate={formatDate}
                                                getCategoryVariant={getCategoryVariant}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12">
                                                <div className="text-gray-500">
                                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                                                    <div className="text-lg font-medium mb-2">Aucun document trouvé
                                                    </div>
                                                    <div className="text-sm">
                                                        {search || categoryFilter !== "all"
                                                            ? "Essayez de modifier vos critères de recherche"
                                                            : "Commencez par ajouter votre premier document"
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
            <CreateDocumentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreate}
            />
        </div>
    );
}
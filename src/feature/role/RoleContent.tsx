"use client"

import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {RoleRow} from "./RoleRow";
import {roleRegisterApi, useGetAllRoleRegister} from "@/services/api/profil/get-all-role-register.api";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {FileJson, FileSpreadsheet, FileText, Users} from "lucide-react";
import {useAuth} from '@/feature/auth/context/AuthProvider';
import {RoleRegister} from '@/services/types/all-role-register.type';

export function RoleContent() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("utilisateur");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

    const {roles, isLoading, isError, totalPages, total, mutate} = useGetAllRoleRegister({
        page,
        limit: 50,
        search,
        sort_by: sortBy,
        order,
    });

    const {user} = useAuth();
    const token = user?.token || '';

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

    // Fonction appelée après la mise à jour du statut d'un utilisateur
    const handleStatusUpdate = (userId: string, newStatus: boolean) => {
        // Rafraîchir les données pour refléter le changement
        mutate();

        // Optionnel: log pour débugger
        console.log(`Statut de l'utilisateur ${userId} mis à jour: ${newStatus ? 'Actif' : 'Inactif'}`);
    };

    // Fonction pour convertir un objet en CSV avec type approprié
    const convertToCSV = (data: RoleRegister[]): string => {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows: string[] = [];

        // Ajouter l'en-tête
        csvRows.push(headers.join(','));

        // Ajouter les données
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header as keyof RoleRegister];
                const escaped = (value === null || value === undefined) ? '' :
                    String(value).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    };

    // Fonction pour télécharger un fichier
    const downloadFile = (data: string | Blob, filename: string, type?: string): void => {
        let blob: Blob;

        if (typeof data === 'string') {
            blob = new Blob([data], {type: type || 'text/plain'});
        } else {
            blob = data;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Fonction pour exporter les données
    const handleExport = async (format: 'xlsx' | 'csv' | 'json'): Promise<void> => {
        if (!token) return;

        setIsExporting(true);

        try {
            if (format === 'xlsx') {
                // Option 1: Si le backend supporte l'export XLSX
                try {
                    const blob = await roleRegisterApi.exportData(token, {
                        search,
                        sort_by: sortBy,
                        order,
                    });
                    downloadFile(blob, `roles_export_${new Date().toISOString()}.xlsx`);
                } catch (error) {
                    console.error("Erreur lors de l'exportation XLSX:", error);

                    // Option 2: S'il n'y a pas d'endpoint d'export, on récupère toutes les données
                    // et on utilise l'URL de téléchargement
                    const params = new URLSearchParams();
                    if (search) params.append('search', search);
                    if (sortBy) params.append('sort_by', sortBy);
                    if (order) params.append('order', order);

                    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
                    const exportUrl = `${API_URL}/api/roleRegister/export-xlsx?${params.toString()}`;

                    // Ouvrir dans un nouvel onglet
                    window.open(exportUrl, '_blank');
                }
            } else {
                // Pour CSV et JSON, on récupère toutes les données et on génère le fichier côté client
                const response = await roleRegisterApi.getAllRoleRegister(token, {
                    search,
                    sort_by: sortBy,
                    order,
                    // limit non spécifié pour récupérer toutes les données
                });

                const allRoles = response.roles;

                if (format === 'csv') {
                    const csvData = convertToCSV(allRoles);
                    downloadFile(csvData, `roles_export_${new Date().toISOString()}.csv`, 'text/csv');
                } else if (format === 'json') {
                    const jsonData = JSON.stringify(allRoles, null, 2);
                    downloadFile(jsonData, `roles_export_${new Date().toISOString()}.json`, 'application/json');
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'exportation:", error);
            alert("Une erreur est survenue lors de l'exportation des données.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-gray-100 p-2">
            <Card>
                <CardHeader className="text-gray-800 flex flex-row justify-between items-center">
                    <CardTitle className="text-2xl font-bold">Gestion des Rôles</CardTitle>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 rounded-lg px-2 py-2 flex items-center">
                            <Users className="h-5 w-5 mr-2"/>
                            <span className="font-medium">Total: {total || 0} verification Role</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExport('xlsx')}
                                disabled={isExporting || isLoading}
                                className="flex items-center gap-1"
                            >
                                <FileSpreadsheet className="h-4 w-4"/>
                                XLSX
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExport('csv')}
                                disabled={isExporting || isLoading}
                                className="flex items-center gap-1"
                            >
                                <FileText className="h-4 w-4"/>
                                CSV
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExport('json')}
                                disabled={isExporting || isLoading}
                                className="flex items-center gap-1"
                            >
                                <FileJson className="h-4 w-4"/>
                                JSON
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 w-1/2">
                            <Input
                                type="text"
                                placeholder="Rechercher par nom, région, district..."
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
                                {roles?.length || 0} / {total || 0}
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
                            Erreur lors de la récupération des rôles
                        </div>
                    ) : (
                        <div className="overflow-auto max-h-[600px] border border-gray-200 rounded-md">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                    <TableRow>
                                        {["Utilisateur", "Province", "Région", "District", "Commune", "Statut", "Actions"].map((header, index) => (
                                            <TableHead
                                                key={index}
                                                onClick={() => index < 6 ? toggleSort(header.toLowerCase()) : undefined}
                                                className={index < 6 ? "cursor-pointer hover:underline" : ""}
                                            >
                                                {header} {index < 6 && sortBy === header.toLowerCase() ? (order === "asc" ? "\u2191" : "\u2193") : ""}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <RoleRowSkeleton/>
                                    ) : roles && roles.length > 0 ? (
                                        roles.map((role) => (
                                            <RoleRow
                                                key={role.id_register_users}
                                                role={role}
                                                onStatusUpdate={handleStatusUpdate}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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

// Inline skeleton component for role rows only
function RoleRowSkeleton() {
    return (
        <>
            {[...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {[...Array(7)].map((_, colIndex) => (
                        <TableCell key={colIndex}>
                            <div className="bg-gray-200 animate-pulse h-5 w-4/5 rounded"></div>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

export default RoleContent;
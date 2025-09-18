// MessagesAdminPage.tsx
"use client";

import React, {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/organismes/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/molécules/card";
import {Button} from "@/components/ui/atomes/button";
import {Badge} from "@/components/ui/atomes/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";
import {Archive, Eye, Filter, Mail, MailOpen, RefreshCw, Trash2} from "lucide-react";
import {deleteMessage, updateMessageStatut, useGetAllMessages} from "@/services/api/message/message.api";
import {ContactMessage, GetMessagesParams, MESSAGE_STATUTS} from "@/services/types/message.type";
import {toast} from "sonner";
import {useSession} from "next-auth/react";
import DeleteConfirmationModal from "@/components/ui/molécules/DeleteConfirmationModal";

export function MessagesAdminPage() {
    const {data: session} = useSession();
    const [statutFilter, setStatutFilter] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {data, isLoading, isError, totalPages, total, mutate} = useGetAllMessages({
        page,
        limit: 10,
        statut: statutFilter as GetMessagesParams['statut'],
        sort_by: sortBy,
        order
    });

    const resetFilters = () => {
        setStatutFilter("all");
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

    const handleUpdateStatut = async (messageId: number, newStatut: ContactMessage['statut']) => {
        try {
            const token = session?.user?.token || "";
            const result = await updateMessageStatut({id: messageId, statut: newStatut}, token);

            if (result.success) {
                toast.success(`Message marqué comme ${newStatut}`);
                mutate();
            } else {
                throw new Error(result.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.error("Erreur mise à jour statut:", error);
            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`);
            } else {
                toast.error("Une erreur inattendue s'est produite");
            }
        }
    };

    const handleDeleteClick = (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedMessage) return;

        try {
            setIsDeleting(true);
            const token = session?.user?.token || "";

            const result = await deleteMessage(selectedMessage.id, token);

            if (result.success) {
                toast.success("Message supprimé avec succès");
                mutate();
            } else {
                throw new Error(result.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`);
            } else {
                toast.error("Une erreur inattendue s'est produite");
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setSelectedMessage(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatutBadgeVariant = (statut: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (statut) {
            case "nouveau":
                return "destructive";
            case "lu":
                return "default";
            case "archive":
                return "secondary";
            default:
                return "outline";
        }
    };

    const getStatutLabel = (statut: string): string => {
        const stat = MESSAGE_STATUTS.find(s => s.id === statut);
        return stat ? stat.name : statut;
    };

    const getStatutCounts = () => {
        const nouveaux = data.filter(m => m.statut === 'nouveau').length;
        const lus = data.filter(m => m.statut === 'lu').length;
        const archives = data.filter(m => m.statut === 'archive').length;

        return {nouveaux, lus, archives};
    };

    const {nouveaux, lus, archives} = getStatutCounts();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Messages</h1>
                    <p className="text-gray-600 mt-2">Gérez les messages reçus depuis le formulaire de contact</p>
                </div>
                <Button
                    onClick={() => mutate()}
                    variant="outline"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <RefreshCw className="h-4 w-4 mr-2"/>
                    Actualiser
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Mail className="h-6 w-6 text-blue-600"/>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{total || 0}</div>
                                <div className="text-sm text-gray-600">Total des messages</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <Mail className="h-6 w-6 text-red-600"/>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{nouveaux}</div>
                                <div className="text-sm text-gray-600">Nouveaux messages</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <MailOpen className="h-6 w-6 text-green-600"/>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{lus}</div>
                                <div className="text-sm text-gray-600">Messages lus</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <Archive className="h-6 w-6 text-gray-600"/>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{archives}</div>
                                <div className="text-sm text-gray-600">Messages archivés</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Filtre par statut */}
                        <Select value={statutFilter} onValueChange={setStatutFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Statut"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {MESSAGE_STATUTS.map(statut => (
                                    <SelectItem key={statut.id} value={statut.id}>
                                        {statut.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Bouton reset */}
                        <Button onClick={resetFilters} variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2"/>
                            Réinitialiser
                        </Button>

                        {/* Info */}
                        <div className="flex items-center text-sm text-gray-600">
                            <span>{data?.length || 0} / {total || 0} messages</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau des messages */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5"/>
                        Liste des Messages
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
                                        <TableHead
                                            onClick={() => toggleSort("nom")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Expéditeur {sortBy === "nom" && (order === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Sujet</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead
                                            onClick={() => toggleSort("created_at")}
                                            className="cursor-pointer hover:bg-gray-100 font-semibold"
                                        >
                                            Reçu le {sortBy === "created_at" && (order === "asc" ? "↑" : "↓")}
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
                                        data.map((message: ContactMessage) => (
                                            <MessageRow
                                                key={message.id}
                                                message={message}
                                                onUpdateStatut={handleUpdateStatut}
                                                onDelete={handleDeleteClick}
                                                formatDate={formatDate}
                                                getStatutBadgeVariant={getStatutBadgeVariant}
                                                getStatutLabel={getStatutLabel}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12">
                                                <div className="text-gray-500">
                                                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                                                    <div className="text-lg font-medium mb-2">Aucun message trouvé</div>
                                                    <div className="text-sm">
                                                        {statutFilter !== "all"
                                                            ? "Essayez de modifier vos critères de recherche"
                                                            : "Aucun message n'a encore été reçu"
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

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedMessage(null);
                }}
                onConfirm={handleDeleteConfirm}
                itemId={selectedMessage?.id.toString() || ""}
                isDeleting={isDeleting}
                title="Supprimer le message"
                message={`Êtes-vous sûr de vouloir supprimer le message de "${selectedMessage?.nom}" ? Cette action est irréversible.`}
            />
        </div>
    );
}

// Composant MessageRow séparé pour la lisibilité
interface MessageRowProps {
    message: ContactMessage;
    onUpdateStatut: (id: number, statut: ContactMessage['statut']) => void;
    onDelete: (message: ContactMessage) => void;
    formatDate: (date: string) => string;
    getStatutBadgeVariant: (statut: string) => "default" | "secondary" | "destructive" | "outline";
    getStatutLabel: (statut: string) => string;
}

function MessageRow({
                        message,
                        onUpdateStatut,
                        onDelete,
                        formatDate,
                        getStatutBadgeVariant,
                        getStatutLabel
                    }: MessageRowProps) {
    const [showFullMessage, setShowFullMessage] = useState(false);

    return (
        <>
            <TableRow
                className={`hover:bg-gray-50 transition-colors ${message.statut === 'nouveau' ? 'bg-red-50' : ''}`}>
                <TableCell className="font-medium text-gray-900">
                    #{message.id}
                </TableCell>
                <TableCell>
                    <div className="font-medium text-gray-900">{message.nom}</div>
                </TableCell>
                <TableCell>
                    <div className="text-sm text-gray-700">{message.email}</div>
                </TableCell>
                <TableCell>
                    <div className="max-w-xs truncate" title={message.sujet}>
                        {message.sujet}
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={getStatutBadgeVariant(message.statut)}>
                        {getStatutLabel(message.statut)}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="text-sm text-gray-700">
                        {formatDate(message.created_at)}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFullMessage(!showFullMessage)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                        >
                            <Eye className="h-4 w-4"/>
                        </Button>

                        {message.statut === 'nouveau' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUpdateStatut(message.id, 'lu')}
                                className="hover:bg-green-50 hover:border-green-300"
                                title="Marquer comme lu"
                            >
                                <MailOpen className="h-4 w-4"/>
                            </Button>
                        )}

                        {message.statut !== 'archive' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUpdateStatut(message.id, 'archive')}
                                className="hover:bg-gray-50 hover:border-gray-300"
                                title="Archiver"
                            >
                                <Archive className="h-4 w-4"/>
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(message)}
                            className="hover:bg-red-50 hover:border-red-300 text-red-600"
                        >
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {showFullMessage && (
                <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50 p-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold">De:</span> {message.nom} ({message.email})
                                </div>
                                <div>
                                    <span className="font-semibold">Sujet:</span> {message.sujet}
                                </div>
                            </div>
                            <div>
                                <span className="font-semibold text-sm">Message:</span>
                                <div className="mt-2 p-4 bg-white rounded border text-gray-800 whitespace-pre-wrap">
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default MessagesAdminPage;
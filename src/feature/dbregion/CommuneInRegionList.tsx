"use client";

import React, {useCallback, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {ArrowLeftCircle, CheckCircle, ChevronLeft, ChevronRight, XCircle} from "lucide-react";

import {CommuneInRegion, useGetCommuneInRegion} from "@/services/api/region/get-commune-liste-trie.api";

import {Card, CardContent} from "@/components/ui/molécules/card";
import {Input} from "@/components/ui/atomes/input";
import {Button} from "@/components/ui/atomes/button";
import Skeleton from "@/components/ui/atomes/skeleton";
import UpdateConfirmationModal from "@/components/ui/molécules/UpdateConfirmationModal";
import {updateBaseStatus} from "@/services/api/commune/base-update-status-commune.api";
import {toast} from "sonner";


interface CommuneInRegionListProps {
    selectedRegionCode: string | null;
    selectedRegionName: string | null;
    onResetRegion: () => void;
}

interface SelectedCommune {
    code: string;
    name: string;
    newStatus: boolean;
    currentStatus: boolean;
}

export function CommuneInRegionList({
                                        selectedRegionCode,
                                        selectedRegionName,
                                        onResetRegion,
                                    }: CommuneInRegionListProps) {
    const router = useRouter();
    const {data: session} = useSession();
    const userRole = session?.user?.role;

    const getRegionCode = (): string => {
        if (selectedRegionCode) return selectedRegionCode;
        if (userRole === "ODDL" || userRole === "administrateur") return "all";

        const rawCode = session?.user?.location?.region_code;
        return Array.isArray(rawCode) ? rawCode[0] ?? "" : rawCode ?? "";
    };

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    // Ajout d'une clé de rafraîchissement
    const limit = 100;
    const [selectedCommune, setSelectedCommune] = useState<SelectedCommune | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [loadingCommuneCode, setLoadingCommuneCode] = useState<string | null>(null);

    const regionCode = getRegionCode();

    // Passer la clé de rafraîchissement à useGetCommuneInRegion
    const {communes, total, currentPage, totalPages, isLoading, isError, mutate} =
        useGetCommuneInRegion(regionCode, page, limit, search);

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const getRegionTitle = () => {
        if (selectedRegionCode && selectedRegionName) {
            return `Communes de la région ${selectedRegionName}`;
        }
        if (regionCode === "all") return "Toutes les communes";
        return `Communes de la région ${session?.user?.location?.region || ''}`;
    };

    const handleStatusToggle = (commune: CommuneInRegion) => {
        setSelectedCommune({
            code: commune.commune_code,
            name: commune.commune_name,
            newStatus: !commune.status_base,
            currentStatus: commune.status_base
        });
    };

    const refreshData = useCallback(() => {
        mutate();
    }, [mutate]);

    const navigateToDbCommune = (commune: CommuneInRegion) => {
        setLoadingCommuneCode(commune.commune_code);
        // Naviguer vers la page dbcommune avec le code de commune en paramètre d'URL
        router.push(`/dashboard/dbcommune?commune_code=${commune.commune_code}&commune_name=${encodeURIComponent(commune.commune_name)}`);
    };

    const confirmUpdate = async () => {
        if (!selectedCommune) return;
        setIsUpdating(true);
        try {
            const token = session?.user?.token || "";

            // Utilisation de la nouvelle API au lieu du proxy
            const result = await updateBaseStatus(
                selectedCommune.code,
                selectedCommune.newStatus,
                token
            );

            if (!result.success || !result.success[0]) {
                throw new Error(result.message?.[0] || "Erreur lors de la mise à jour du statut.");
            }

            toast.success(result.message?.[0] || "Statut de la commune mis à jour avec succès");
            // Rafraîchir les données
            refreshData();
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                toast.error(`Erreur: ${err.message}`);
            } else {
                toast.error("Une erreur inattendue s'est produite");
            }
        } finally {
            setIsUpdating(false);
            setSelectedCommune(null);
        }
    };

    const closeModal = () => {
        setSelectedCommune(null);
    };

    const regionTitle = getRegionTitle();

    return (
        <div className="space-y-4">
            {selectedRegionCode &&
                (userRole === "ODDL" || userRole === "administrateur") && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetRegion}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeftCircle size={16}/>
                        <span>Toutes les communes</span>
                    </Button>
                )}

            <div className="flex gap-2 w-full max-w-sm">
                <Input
                    type="text"
                    placeholder="Rechercher une commune..."
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
                        <span>{regionTitle}</span>
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

            {isError ? (
                <div className="text-red-500 text-sm">
                    Erreur lors du chargement des communes.
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    <Skeleton count={100} height={40} borderRadius={8}/>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {communes.map((commune, index) => (
                        <Card
                            key={`${commune.commune_code}-${index}`}
                            className="cursor-pointer transition-transform hover:scale-105 hover:shadow-md overflow-hidden"
                        >
                            <CardContent className="p-2 flex items-center justify-between">
                                <div
                                    className="flex flex-col overflow-hidden w-4/5"
                                    onClick={() => navigateToDbCommune(commune)}
                                >
                                    <span className="text-xs font-medium truncate max-w-full">
                                        {commune.commune_name}
                                        {loadingCommuneCode === commune.commune_code && (
                                            <span className="ml-2 inline-block animate-pulse">⟳</span>
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-500 truncate max-w-full">
                                        {commune.region_name}
                                    </span>
                                </div>
                                <div className="flex-shrink-0 w-1/5 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="p-0 h-6 w-6 min-w-6"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche le déclenchement du onClick de la Card
                                            handleStatusToggle(commune);
                                        }}
                                    >
                                        {commune.status_base ? (
                                            <CheckCircle size={16} className="text-green-600"/>
                                        ) : (
                                            <XCircle size={16} className="text-red-500"/>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <UpdateConfirmationModal
                isOpen={selectedCommune !== null}
                onClose={closeModal}
                onConfirm={confirmUpdate}
                isUpdating={isUpdating}
                communeName={selectedCommune?.name || ""}
                newStatus={selectedCommune?.newStatus || false}
            />
        </div>
    );
}
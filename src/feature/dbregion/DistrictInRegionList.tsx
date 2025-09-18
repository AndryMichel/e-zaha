"use client";

import React, {useCallback, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {Building2, CheckCircle, ChevronLeft, ChevronRight,  XCircle} from "lucide-react";
import {toast} from "sonner";

import {DistrictInRegion, useGetDistrictsInRegion} from "@/services/api/region/get-districts-in-region.api";
import {updateDistrictBaseStatus} from "@/services/api/region/district-base-status.api";

import {Card, CardContent} from "@/components/ui/molécules/card";
import {Input} from "@/components/ui/atomes/input";
import {Button} from "@/components/ui/atomes/button";
import Skeleton from "@/components/ui/atomes/skeleton";
import UpdateConfirmationModal from "@/components/ui/molécules/UpdateConfirmationModal";

interface DistrictInRegionListProps {
    selectedRegionCode: string | null;
    selectedRegionName: string | null;
}

interface SelectedDistrict {
    code: string;
    name: string;
    newStatus: boolean;
    currentStatus: boolean;
}

export function DistrictInRegionList({
                                         selectedRegionCode,
                                         selectedRegionName,
                                     }: DistrictInRegionListProps) {
    const router = useRouter();
    const {data: session} = useSession();

    const getRegionCode = (): string => {
        if (selectedRegionCode) return selectedRegionCode;

        const rawCode = session?.user?.location?.region_code;
        return Array.isArray(rawCode) ? rawCode[0] ?? "" : rawCode ?? "";
    };

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    // const [sortBy, setSortBy] = useState("district_name");
    // const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedDistrict, setSelectedDistrict] = useState<SelectedDistrict | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const limit = 50;
    const [loadingDistrictCode, setLoadingDistrictCode] = useState<string | null>(null);

    const regionCode = getRegionCode();

    const {districts, total, currentPage, totalPages, isLoading, isError, mutate} =
        useGetDistrictsInRegion(regionCode, page, limit, search);

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const getRegionTitle = () => {
        if (selectedRegionCode && selectedRegionName) {
            return `Districts de la région ${selectedRegionName}`;
        }
        return `Districts de la région ${session?.user?.location?.region || ''}`;
    };

    // const handleSort = (field: string) => {
    //     if (sortBy === field) {
    //         setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    //     } else {
    //         setSortBy(field);
    //         setSortOrder("asc");
    //     }
    //     setPage(1);
    // };

    const navigateToDistrictCommunes = (district: DistrictInRegion) => {
        setLoadingDistrictCode(district.district_code);
        router.push(`/dashboard/dbcommune?district_code=${district.district_code}&district_name=${encodeURIComponent(district.district_name)}`);
    };

    // ✅ Nouvelle fonction pour gérer le toggle du statut
    const handleStatusToggle = (district: DistrictInRegion) => {
        setSelectedDistrict({
            code: district.district_code,
            name: district.district_name,
            newStatus: !district.status_base,
            currentStatus: district.status_base
        });
    };

    // ✅ Fonction pour rafraîchir les données
    const refreshData = useCallback(() => {
        mutate();
    }, [mutate]);

    // ✅ Fonction pour confirmer la mise à jour
    const confirmUpdate = async () => {
        if (!selectedDistrict) return;
        setIsUpdating(true);
        try {
            const token = session?.user?.token || "";

            const result = await updateDistrictBaseStatus(
                selectedDistrict.code,
                selectedDistrict.newStatus,
                token
            );

            if (!result.success || !result.success[0]) {
                throw new Error(result.message?.[0] || "Erreur lors de la mise à jour du statut.");
            }

            toast.success(result.message?.[0] || "Statut du district mis à jour avec succès");
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
            setSelectedDistrict(null);
        }
    };

    // ✅ Fonction pour fermer le modal
    const closeModal = () => {
        setSelectedDistrict(null);
    };

    const regionTitle = getRegionTitle();

    return (
        <div className="space-y-4">
            <div className="flex gap-2 w-full max-w-sm">
                <Input
                    type="text"
                    placeholder="Rechercher un district..."
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

            {/* Boutons de tri */}
            {/*<div className="flex gap-2 flex-wrap">*/}
            {/*    <Button*/}
            {/*        variant={sortBy === "district_name" ? "default" : "outline"}*/}
            {/*        size="sm"*/}
            {/*        onClick={() => handleSort("district_name")}*/}
            {/*    >*/}
            {/*        Nom {sortBy === "district_name" && (sortOrder === "asc" ? "↑" : "↓")}*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        variant={sortBy === "commune_count" ? "default" : "outline"}*/}
            {/*        size="sm"*/}
            {/*        onClick={() => handleSort("commune_count")}*/}
            {/*    >*/}
            {/*        Nb Communes {sortBy === "commune_count" && (sortOrder === "asc" ? "↑" : "↓")}*/}
            {/*    </Button>*/}
            {/*</div>*/}

            {isError ? (
                <div className="text-red-500 text-sm">
                    Erreur lors du chargement des districts.
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton count={6} height={120} borderRadius={8}/>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {districts.map((district, index) => (
                        <Card
                            key={`${district.district_code}-${index}`}
                            className="cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
                        >
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div
                                        className="flex-1"
                                        onClick={() => navigateToDistrictCommunes(district)}
                                    >
                                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                                            <Building2 size={16} className="text-blue-600"/>
                                            {district.district_name}
                                            {loadingDistrictCode === district.district_code && (
                                                <span className="inline-block animate-pulse">⟳</span>
                                            )}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Code: {district.district_code}
                                        </p>
                                    </div>
                                    {/* ✅ Bouton de statut */}
                                    <div className="flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="p-0 h-6 w-6 min-w-6"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusToggle(district);
                                            }}
                                        >
                                            {district.status_base ? (
                                                <CheckCircle size={14} className="text-green-600"/>
                                            ) : (
                                                <XCircle size={14} className="text-red-500"/>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/*<div className="flex items-center gap-1 text-xs">*/}
                                {/*    <Users size={12} className="text-gray-500"/>*/}
                                {/*    <span>{district.commune_count} communes</span>*/}
                                {/*</div>*/}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ✅ Modal de confirmation */}
            <UpdateConfirmationModal
                isOpen={selectedDistrict !== null}
                onClose={closeModal}
                onConfirm={confirmUpdate}
                isUpdating={isUpdating}
                communeName={selectedDistrict?.name || ""}
                newStatus={selectedDistrict?.newStatus || false}
                entityType="district"
            />
        </div>
    );
}
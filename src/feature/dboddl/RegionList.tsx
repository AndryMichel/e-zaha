"use client";

import React, {useCallback, useState} from "react";
import {CheckCircle, MapPin, XCircle} from "lucide-react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";

import {Card, CardContent} from "@/components/ui/molécules/card";
import {Input} from "@/components/ui/atomes/input";
import {Button} from "@/components/ui/atomes/button";
import Skeleton from "@/components/ui/atomes/skeleton";
import UpdateConfirmationModal from "@/components/ui/molécules/UpdateConfirmationModal";
import {useGetAllRegionList} from "@/services/api/oddl/get-all-region-list.api";
import {updateRegionBaseStatus} from "@/services/api/region/region-base-status.api";

// ✅ Typage des props
interface RegionListProps {
    onRegionSelect?: (regionCode: string, regionName: string) => void;
}

interface SelectedRegion {
    code: string;
    name: string;
    newStatus: boolean;
    currentStatus: boolean;
}

interface Region {
    region_code: string;
    region_name: string;
    status_base: boolean;
}


export function RegionList({onRegionSelect}: RegionListProps) {
    const {data: session} = useSession();
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [loadingRegionCode, setLoadingRegionCode] = useState<string | null>(null);

    // ✅ Ne passer QUE le paramètre search, sans status_base
    const {data: regions, totalRegions, isLoading, isError, mutate} = useGetAllRegionList({
        search
        // status_base complètement supprimé pour afficher toutes les régions
    });

    const handleSearch = () => {
        setSearch(searchInput);
    };

    // ✅ Typage explicite des paramètres
    const handleRegionClick = (regionCode: string, regionName: string) => {
        if (onRegionSelect) {
            setLoadingRegionCode(regionCode);
            onRegionSelect(regionCode, regionName);
        }
    };

    const handleStatusToggle = (region: Region) => {
        setSelectedRegion({
            code: region.region_code,
            name: region.region_name,
            newStatus: !region.status_base,
            currentStatus: region.status_base
        });
    };

    const refreshData = useCallback(() => {
        mutate();
    }, [mutate]);

    const confirmUpdate = async () => {
        if (!selectedRegion) return;
        setIsUpdating(true);
        try {
            const token = session?.user?.token || "";

            const result = await updateRegionBaseStatus(
                selectedRegion.code,
                selectedRegion.newStatus,
                token
            );

            if (!result.success || !result.success[0]) {
                throw new Error(result.message?.[0] || "Erreur lors de la mise à jour du statut.");
            }

            toast.success(result.message?.[0] || "Statut de la région mis à jour avec succès");
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
            setSelectedRegion(null);
        }
    };

    const closeModal = () => {
        setSelectedRegion(null);
    };

    return (
        <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="flex gap-2 w-full max-w-sm">
                <Input
                    type="text"
                    placeholder="Rechercher une région..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="text-xs"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm" className="text-xs">
                    Rechercher
                </Button>
            </div>

            {/* En-tête avec titre */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
                <div className="text-sm font-medium flex items-center">
                    <span>Liste des régions</span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                        {totalRegions}
                    </span>
                </div>
                <div className="text-xs text-gray-500">
                    Toutes les régions (actives et inactives)
                </div>
            </div>

            {/* Liste des régions */}
            {isError ? (
                <div className="text-red-500 text-sm">Erreur lors du chargement des régions.</div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(10)].map((_, index) => (
                        <Skeleton key={index} className="h-20 rounded-lg"/>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regions.map((region, index) => (
                        <Card
                            key={`${region.region_code}-${index}`}
                            className="cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
                        >
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div
                                        className="flex-1"
                                        onClick={() => handleRegionClick(region.region_code, region.region_name)}
                                    >
                                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                                            <MapPin size={16} className="text-blue-600"/>
                                            {region.region_name}
                                            {loadingRegionCode === region.region_code && (
                                                <span className="inline-block animate-pulse">⟳</span>
                                            )}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Code: {region.region_code}
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
                                                handleStatusToggle(region);
                                            }}
                                        >
                                            {region.status_base ? (
                                                <CheckCircle size={14} className="text-green-600"/>
                                            ) : (
                                                <XCircle size={14} className="text-red-500"/>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <UpdateConfirmationModal
                isOpen={selectedRegion !== null}
                onClose={closeModal}
                onConfirm={confirmUpdate}
                isUpdating={isUpdating}
                communeName={selectedRegion?.name || ""}
                newStatus={selectedRegion?.newStatus || false}
                entityType="région"
            />
        </div>
    );
}

export default RegionList;
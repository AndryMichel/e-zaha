"use client"

import React, {useState} from 'react';
import {Card} from '@/components/ui/molécules/card';
import {AlertCircle, ArrowRight, Calendar, Filter, Search, SortAsc, SortDesc, Sparkles, Star} from 'lucide-react';
import {motion} from '@/components/ui/templates/motion';
import {Button} from '@/components/ui/atomes/button';
import ActualiteContent from './ActualiteContent';
import Image from "next/image";
import {useGetAllActualitesPublic} from "@/services/api/actualites/actualite.api";
import {getImageUrl} from "@/services/helpers/imageUtils";
import {Actualite} from "@/services/types/actualite.type";

export const AccueilPage = () => {
    // États pour les filtres et la recherche
    const [searchInput, setSearchInput] = useState(""); // Valeur temporaire de l'input
    const [searchTerm, setSearchTerm] = useState(""); // Valeur réelle utilisée pour l'API
    const [typeFilter, setTypeFilter] = useState<"all" | "actualite" | "annonce">("all");
    const [sortBy, setSortBy] = useState<"created_at" | "titre">("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showFilters, setShowFilters] = useState(true); // Changé à true pour afficher par défaut

    // Récupération des actualités via l'API publique avec les paramètres de filtrage
    const {data: actualites, isLoading, isError, mutate} = useGetAllActualitesPublic({
        limit: 6,
        search: searchTerm,
        type: typeFilter,
        sort_by: sortBy,
        order: sortOrder
    });

    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Gestionnaire pour le formulaire de recherche
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(searchInput.trim());
    };

    // Gestionnaire pour l'input de recherche (seulement pour l'état local)
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleTypeFilterChange = (type: "all" | "actualite" | "annonce") => {
        setTypeFilter(type);
    };

    const handleSortChange = (newSortBy: "created_at" | "titre") => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(newSortBy);
            setSortOrder("desc");
        }
    };

    const resetFilters = () => {
        setSearchInput("");
        setSearchTerm("");
        setTypeFilter("all");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    // Composant de loading
    const LoadingSkeleton = () => (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
                <motion.div
                    key={index}
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.1, duration: 0.6}}
                    className="group"
                >
                    <Card
                        className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/60 overflow-hidden h-full">
                        <div className="flex flex-col h-full">
                            {/* Skeleton image */}
                            <div className="h-52 bg-gray-200 animate-pulse"></div>

                            {/* Skeleton content */}
                            <div className="p-6 flex-grow space-y-4">
                                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );

    // Composant d'erreur
    const ErrorDisplay = () => (
        <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-6">
                Impossible de charger les actualités pour le moment.
            </p>
            <Button
                onClick={() => mutate()}
                variant="outline"
                className="mx-auto"
            >
                Réessayer
            </Button>
        </div>
    );

    // Composant pour les actualités vides
    const EmptyState = () => (
        <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || typeFilter !== "all" ? "Aucun résultat trouvé" : "Aucune actualité disponible"}
            </h3>
            <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter !== "all"
                    ? "Essayez de modifier vos critères de recherche."
                    : "Les actualités seront bientôt disponibles."
                }
            </p>
            {(searchTerm || typeFilter !== "all") && (
                <Button onClick={resetFilters} variant="outline">
                    Réinitialiser les filtres
                </Button>
            )}
        </div>
    );

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-gray-800 relative overflow-hidden">
            {/* Éléments décoratifs de fond améliorés */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-indigo-400/12 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-r from-cyan-300/8 to-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div
                    className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-300/8 to-pink-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                <div
                    className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-300/6 to-teal-300/8 rounded-full blur-3xl animate-pulse delay-3000"></div>
            </div>

            {/* Header Hero Section */}
            <section
                className="relative min-h-[400px] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
                {/* Background avec overlay plus sophistiqué */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src="/assets/aceuiloddl.png"
                        alt="ODDL Background"
                        fill
                        className="object-cover opacity-12"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60"></div>
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30"></div>
                </div>

                {/* Éléments flottants décoratifs améliorés */}
                <div className="absolute top-32 left-1/4 opacity-40">
                    <Sparkles className="w-7 h-7 text-blue-500 animate-pulse drop-shadow-sm"/>
                </div>
                <div className="absolute top-20 right-1/3 opacity-35">
                    <Star className="w-6 h-6 text-indigo-500 animate-pulse delay-500 drop-shadow-sm"/>
                </div>
                <div className="absolute bottom-12 left-1/5 opacity-30">
                    <Sparkles className="w-5 h-5 text-cyan-500 animate-pulse delay-1000 drop-shadow-sm"/>
                </div>
                <div className="absolute top-1/3 right-1/5 opacity-25">
                    <Star className="w-4 h-4 text-purple-500 animate-pulse delay-1500 drop-shadow-sm"/>
                </div>

                <div className="relative z-10 max-w-6xl">
                    <motion.h1
                        initial={{opacity: 0, y: -30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1.2, ease: "easeOut"}}
                        className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-slate-700 via-gray-800 to-slate-600 bg-clip-text text-transparent drop-shadow-sm"
                        style={{
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Observatoire de la{' '}
                        <span className="bg-clip-text text-transparent">
                            Décentralisation
                        </span>
                        <br/>
                        et du Développement Local
                    </motion.h1>

                    <motion.div
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 1, delay: 0.4}}
                        className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-8 shadow-lg"
                    ></motion.div>

                    <motion.p
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1.2, delay: 0.6}}
                        className="text-lg md:text-xl lg:text-2xl font-medium text-slate-600 max-w-4xl mx-auto leading-relaxed"
                        style={{
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                    >
                        Faire de la décentralisation le{' '}
                        <span className="text-blue-600 font-semibold">moteur de l&#39;émergence</span>
                        {' '}de Madagascar
                    </motion.p>
                </div>
            </section>

            {/* Section Actualités et Annonces */}
            <section className="py-12 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-gray-800 to-slate-600 bg-clip-text text-transparent">
                            Actualités & Annonces
                        </h2>
                        <div
                            className="w-28 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full shadow-lg"></div>
                        <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
                            Restez informé des dernières initiatives de développement
                        </p>
                    </motion.div>

                    {/* Barre de recherche et filtres - VERSION COMPACTE */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="mb-8"
                    >
                        <div className="max-w-6xl mx-auto">
                            {/* Ligne unique : Recherche + Bouton filtres */}
                            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
                                {/* Barre de recherche avec formulaire */}
                                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg flex gap-2">
                                    <div className="relative flex-1">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="sm"
                                        className="h-11 px-4 py-2.5 rounded-lg"
                                    >
                                        <Search className="h-4 w-4"/>
                                    </Button>
                                </form>

                                {/* Bouton filtres avec icône */}
                                <Button
                                    onClick={() => setShowFilters(!showFilters)}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap"
                                >
                                    <Filter className="h-4 w-4"/>
                                    {showFilters ? "Masquer filtres" : "Filtres"}
                                </Button>
                            </div>

                            {/* Filtres - Affichage conditionnel en ligne compacte */}
                            {showFilters && (
                                <motion.div
                                    initial={{opacity: 0, height: 0}}
                                    animate={{opacity: 1, height: "auto"}}
                                    exit={{opacity: 0, height: 0}}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-gray-200"
                                >
                                    <div
                                        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                        {/* Filtres par type */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className="text-sm font-medium text-gray-700 whitespace-nowrap">Type:</span>
                                            <div className="flex gap-1">
                                                {[
                                                    {value: "all", label: "Tous"},
                                                    {value: "actualite", label: "Actualités"},
                                                    {value: "annonce", label: "Annonces"}
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleTypeFilterChange(option.value as "all" | "actualite" | "annonce")}
                                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                                            typeFilter === option.value
                                                                ? "bg-blue-500 text-white shadow-md"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Section avec bouton reset devant et tri après */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Bouton réinitialiser - maintenant devant */}
                                            {(searchTerm || typeFilter !== "all" || sortBy !== "created_at" || sortOrder !== "desc") && (
                                                <Button
                                                    onClick={resetFilters}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs px-3 py-1.5"
                                                >
                                                    Reset
                                                </Button>
                                            )}

                                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Trier par:</span>
                                            <div className="flex gap-1">
                                                <Button
                                                    onClick={() => handleSortChange("created_at")}
                                                    variant="outline"
                                                    size="sm"
                                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                                        sortBy === "created_at"
                                                            ? "bg-blue-500 text-white shadow-md border-blue-500 hover:bg-blue-600"
                                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    Date
                                                    {sortBy === "created_at" && (
                                                        sortOrder === "desc" ? <SortDesc className="h-3 w-3"/> :
                                                            <SortAsc className="h-3 w-3"/>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() => handleSortChange("titre")}
                                                    variant="outline"
                                                    size="sm"
                                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                                        sortBy === "titre"
                                                            ? "bg-blue-500 text-white shadow-md border-blue-500 hover:bg-blue-600"
                                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    Titre
                                                    {sortBy === "titre" && (
                                                        sortOrder === "desc" ? <SortDesc className="h-3 w-3"/> :
                                                            <SortAsc className="h-3 w-3"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Contenu conditionnel selon l'état */}
                    {isLoading ? (
                        <LoadingSkeleton/>
                    ) : isError ? (
                        <ErrorDisplay/>
                    ) : !actualites || actualites.length === 0 ? (
                        <EmptyState/>
                    ) : (
                        <>
                            {/* Grid 3 colonnes pour les actualités */}
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {actualites.map((actualite: Actualite, index: number) => (
                                    <motion.div
                                        key={actualite.id}
                                        initial={{opacity: 0, y: 40, scale: 0.95}}
                                        animate={{opacity: 1, y: 0, scale: 1}}
                                        transition={{
                                            delay: index * 0.15,
                                            duration: 0.7,
                                            ease: "easeOut"
                                        }}
                                        className="group transform transition-all duration-500 hover:scale-105"
                                    >
                                        <Card
                                            className="bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl border border-white/60 overflow-hidden h-full relative group-hover:border-blue-200/50 transition-all duration-500">
                                            {/* Effet de lueur au survol amélioré */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-indigo-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                            <div className="flex flex-col h-full relative z-10">
                                                {/* En-tête avec image de couverture */}
                                                <div className="h-52 overflow-hidden relative">
                                                    <Image
                                                        src={getImageUrl(actualite.image_url)}
                                                        alt={actualite.titre}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                                    <div className="absolute top-4 right-4">
                                                        <div
                                                            className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border shadow-lg ${
                                                                actualite.type === "annonce"
                                                                    ? "bg-gradient-to-r from-emerald-500/95 to-green-500/95 text-white border-emerald-300/40"
                                                                    : "bg-gradient-to-r from-blue-500/95 to-indigo-500/95 text-white border-blue-300/40"
                                                            }`}>
                                                            {actualite.type === "annonce" ? "Annonce" : "Actualité"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contenu avec ActualiteContent */}
                                                <div className="flex-1">
                                                    <ActualiteContent
                                                        id={actualite.id}
                                                        titre={actualite.titre}
                                                        contenu={actualite.contenu}
                                                        type={actualite.type}
                                                        date={formatDate(actualite.created_at)}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bouton "Voir plus" - N'affiche que si il y a 6 actualités ou plus */}
                            {actualites && actualites.length >= 6 && (
                                <motion.div
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 1.2, duration: 0.6}}
                                    className="text-center mt-16"
                                >
                                    <Button
                                        className="group px-10 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl border border-blue-500/20">
                                        Voir toutes les actualités
                                        <ArrowRight
                                            className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300"/>
                                    </Button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Section décorative finale améliorée */}
            <div
                className="h-24 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-indigo-500/3 to-purple-500/3 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
        </div>
    );
};

export default AccueilPage;
"use client"
import React, {useState} from 'react';
import {Card, CardContent} from '@/components/ui/molécules/card';
import {motion} from '@/components/ui/templates/motion';
import Image from 'next/image';
import PageHeader from '@/components/ui/templates/PageHeader';
import CategoryFilter from '@/components/ui/templates/CategoryFilter';
import ImageModal from '@/components/ui/templates/ImageModal';
import {AlertCircle} from 'lucide-react';
import {Button} from '@/components/ui/atomes/button';
import {useGetAllGaleriePublic} from "@/services/api/galerie/galerie.api";
import {getImageUrl} from "@/services/helpers/imageUtils";
import {GalerieItem, GetAllGalerieParams} from "@/services/types/galerie.type";

export const GaleriePage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<GalerieItem | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    // Récupération des images via l'API publique
    const {data: galerieImages, isLoading, isError} = useGetAllGaleriePublic({
        limit: "", // Récupérer toutes les images
        category: activeFilter as GetAllGalerieParams['category'],
        sort_by: "created_at",
        order: "desc"
    });

    const categories = [
        {id: 'all', name: 'toutes les galeries'},
        {id: 'formation', name: 'Formation'},
        {id: 'atelier', name: 'Atelier'},
        {id: 'descente', name: 'Descente sur terrain'},
        {id: 'partenariat', name: 'Partenariat'},
        {id: 'directeurs', name: 'Directeurs de l\'ODDL'},
        {id: 'divers', name: 'Divers'}
    ];

    // Composant de loading
    const LoadingSkeleton = () => (
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, index) => (
                <motion.div
                    key={index}
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.1}}
                    className="transform transition duration-500"
                >
                    <Card className="overflow-hidden h-full shadow-lg">
                        <CardContent className="p-0">
                            <div className="h-48 sm:h-56 md:h-64 lg:h-72 bg-gray-200 animate-pulse"></div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );

    // Composant d'erreur
    const ErrorDisplay = () => (
        <div className="text-center py-12 sm:py-16 lg:py-20">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-6">
                Impossible de charger les images de la galerie pour le moment.
            </p>
            <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mx-auto"
            >
                Réessayer
            </Button>
        </div>
    );

    // Composant pour galerie vide
    const EmptyState = () => (
        <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-gray-500 text-base sm:text-lg lg:text-xl mb-4">
                📷
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune image disponible
            </h3>
            <p className="text-gray-600">
                {activeFilter === 'all'
                    ? "La galerie sera bientôt remplie d'images."
                    : `Aucune image disponible pour la catégorie "${categories.find(c => c.id === activeFilter)?.name}".`}
            </p>
        </div>
    );

    const handleImageSelect = (image: GalerieItem): void => {
        setSelectedImage(image);
    };

    const handlePrevImage = (): void => {
        if (selectedImage && galerieImages) {
            const currentIndex = galerieImages.findIndex(item => item.id === selectedImage.id);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : galerieImages.length - 1;
            setSelectedImage(galerieImages[prevIndex]);
        }
    };

    const handleNextImage = (): void => {
        if (selectedImage && galerieImages) {
            const currentIndex = galerieImages.findIndex(item => item.id === selectedImage.id);
            const nextIndex = currentIndex < galerieImages.length - 1 ? currentIndex + 1 : 0;
            setSelectedImage(galerieImages[nextIndex]);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeader
                title="Galerie de nos réalisations"
            />

            <section className="py-4 sm:py-6 lg:py-8 bg-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <CategoryFilter
                        categories={categories}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />
                </div>
            </section>

            <section className="py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <LoadingSkeleton/>
                    ) : isError ? (
                        <ErrorDisplay/>
                    ) : !galerieImages || galerieImages.length === 0 ? (
                        <EmptyState/>
                    ) : (
                        <div
                            className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {galerieImages.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{opacity: 0, y: 30}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: index * 0.1}}
                                    className="transform transition duration-500 hover:scale-105"
                                >
                                    <Card
                                        className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <CardContent className="p-0">
                                            <div
                                                className="cursor-pointer h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden relative group"
                                                onClick={() => handleImageSelect(item)}
                                            >
                                                <Image
                                                    src={getImageUrl(item.image_url)}
                                                    alt={`Image de galerie - ${item.category} du ${new Date(item.created_at).toLocaleDateString('fr-FR')}`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                    priority={index < 6}
                                                />
                                                {/* Badge de catégorie */}
                                                <div className="absolute top-2 left-2">
                                                    <div
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg ${getCategoryColor(item.category)}`}>
                                                        {getCategoryName(item.category)}
                                                    </div>
                                                </div>
                                                {/* Overlay au survol */}
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"/>
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div
                                                        className="bg-white bg-opacity-90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                        <svg
                                                            className="w-6 h-6 text-gray-800"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal d'image */}
            {selectedImage && galerieImages && (
                <ImageModal
                    selectedImage={{
                        id: selectedImage.id,
                        category: selectedImage.category,
                        image: selectedImage.image_url,
                        date: selectedImage.created_at
                    }}
                    images={galerieImages.map(item => ({
                        id: item.id,
                        category: item.category,
                        image: item.image_url,
                        date: item.created_at
                    }))}
                    onClose={() => setSelectedImage(null)}
                    onPrev={handlePrevImage}
                    onNext={handleNextImage}
                />
            )}
        </div>
    );
};

// Fonctions utilitaires pour les catégories
const getCategoryColor = (category: string): string => {
    switch (category) {
        case 'formation':
            return 'bg-gradient-to-r from-blue-500/95 to-indigo-500/95 text-white border-blue-300/40';
        case 'atelier':
            return 'bg-gradient-to-r from-green-500/95 to-emerald-500/95 text-white border-green-300/40';
        case 'descente':
            return 'bg-gradient-to-r from-orange-500/95 to-red-500/95 text-white border-orange-300/40';
        case 'partenariat':
            return 'bg-gradient-to-r from-purple-500/95 to-pink-500/95 text-white border-purple-300/40';
        case 'directeurs':
            return 'bg-gradient-to-r from-amber-500/95 to-yellow-500/95 text-white border-amber-300/40';
        case 'divers':
            return 'bg-gradient-to-r from-gray-500/95 to-slate-500/95 text-white border-gray-300/40';
        default:
            return 'bg-gradient-to-r from-gray-500/95 to-slate-500/95 text-white border-gray-300/40';
    }
};

const getCategoryName = (category: string): string => {
    switch (category) {
        case 'formation':
            return 'Formation';
        case 'atelier':
            return 'Atelier';
        case 'descente':
            return 'Descente';
        case 'partenariat':
            return 'Partenariat';
        case 'directeurs':
            return 'Directeurs de l\'ODDL';
        case 'divers':
            return 'Divers';
        default:
            return 'Divers';
    }
};

export default GaleriePage;
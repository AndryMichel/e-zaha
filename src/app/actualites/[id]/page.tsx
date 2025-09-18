// app/actualites/[id]/page.tsx
"use client";

import React from 'react';
import {useParams} from 'next/navigation';
import {Card, CardContent} from '@/components/ui/molécules/card';
import {Button} from '@/components/ui/atomes/button';
import {Badge} from '@/components/ui/atomes/badge';
import {AlertCircle, ArrowLeft, Calendar, Clock, FileText, Share2, Tag} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {motion} from 'framer-motion';
import useSWR from 'swr';
import {apiClient} from "@/services/helpers/apiClient";
import {getImageUrl} from "@/services/helpers/imageUtils";
import {Actualite} from '@/services/types/actualite.type';

// Type pour la réponse de l'API single actualité
interface GetSingleActualiteResponse {
    success: boolean[];
    data: Actualite[];
}

// API call pour récupérer une actualité spécifique
const fetchActualiteById = async (id: string) => {
    const response = await apiClient.get<GetSingleActualiteResponse>(
        `/api/actualites-public/get-actualite-public/${id}`
    );

    // Extraire le premier élément du tableau data
    return {
        success: response.success[0], // Premier élément du tableau success
        data: response.data[0]        // Premier élément du tableau data
    };
};

export default function ActualiteDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const {data, error, isLoading} = useSWR(
        id ? [`actualite-${id}`] : null,
        () => fetchActualiteById(id)
    );

    const actualite = data?.data;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: actualite?.titre,
                    text: actualite?.contenu.substring(0, 100) + '...',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Erreur lors du partage:', err);
            }
        } else {
            // Fallback: copier l'URL dans le presse-papiers
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('URL copiée dans le presse-papiers !');
            } catch (err) {
                console.log('Erreur lors de la copie:', err);
            }
        }
    };
    console.log("contenuuuuuuu", actualite)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Loading skeleton */}
                        <div className="space-y-6">
                            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-32"></div>
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !actualite) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-6"/>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Actualité non trouvée
                        </h1>
                        <p className="text-gray-600 mb-8">
                            L&#39;actualité que vous recherchez n&#39;existe pas ou a été supprimée.
                        </p>
                        <Link href="/">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <ArrowLeft className="h-4 w-4 mr-2"/>
                                Retour à l&#39;accueil
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Background décoratif */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-indigo-400/8 rounded-full blur-3xl"></div>
                <div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-400/8 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Navigation */}
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5}}
                        className="mb-8"
                    >
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2"/>
                                Retour à l&#39;accueil
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Article principal */}
                    <motion.article
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                    >
                        <Card
                            className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/60 overflow-hidden">
                            {/* En-tête de l'article */}
                            <div className="relative">
                                {actualite.image_url && (
                                    <div className="relative h-80 lg:h-96 overflow-hidden">
                                        <Image
                                            src={getImageUrl(actualite.image_url)}
                                            alt={actualite.titre}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                    </div>
                                )}

                                {/* Métadonnées sur l'image ou en arrière-plan */}
                                <div
                                    className={`absolute ${actualite.image_url ? 'bottom-6 left-6 right-6' : 'top-6 left-6 right-6'}`}>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge
                                            variant={actualite.type === "annonce" ? "secondary" : "default"}
                                            className={`${actualite.image_url ? 'bg-white/90 text-gray-900' : ''} text-sm font-semibold`}
                                        >
                                            <Tag className="h-3 w-3 mr-1"/>
                                            {actualite.type === "annonce" ? "Annonce" : "Actualité"}
                                        </Badge>
                                        <div
                                            className={`flex items-center gap-1 text-sm ${actualite.image_url ? 'text-white' : 'text-gray-600'}`}>
                                            <Calendar className="h-4 w-4"/>
                                            {formatDate(actualite.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-8 lg:p-12">
                                {/* Titre */}
                                <motion.h1
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.6, delay: 0.2}}
                                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                                >
                                    {actualite.titre}
                                </motion.h1>

                                {/* Métadonnées détaillées */}
                                <motion.div
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.6, delay: 0.3}}
                                    className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200"
                                >
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FileText className="h-4 w-4"/>
                                        <span className="text-sm">Article #{actualite.id}</span>
                                    </div>

                                    {actualite.updated_at !== actualite.created_at && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-4 w-4"/>
                                            <span className="text-sm">
                                                Mis à jour le {formatDate(actualite.updated_at)}
                                            </span>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleShare}
                                        variant="outline"
                                        size="sm"
                                        className="ml-auto"
                                    >
                                        <Share2 className="h-4 w-4 mr-2"/>
                                        Partager
                                    </Button>
                                </motion.div>

                                {/* Contenu */}
                                <motion.div
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.6, delay: 0.4}}
                                    className="prose prose-lg max-w-none"
                                >
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                        {actualite.contenu}
                                    </div>
                                </motion.div>

                                {/* Footer de l'article */}
                                <motion.div
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.6, delay: 0.5}}
                                    className="mt-12 pt-8 border-t border-gray-200"
                                >
                                    <div
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="text-sm text-gray-500">
                                            <p>Publié par l&#39;Observatoire de la Décentralisation et du Développement
                                                Local</p>
                                            <p>© 2025 ODDL Madagascar</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <Link href="/">
                                                <Button variant="outline" size="sm">
                                                    Plus d&#39;actualités
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={handleShare}
                                                variant="default"
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                <Share2 className="h-4 w-4 mr-2"/>
                                                Partager
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.article>

                    {/* Suggestions d'articles similaires */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.6}}
                        className="mt-16"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Autres actualités
                            </h2>
                            <p className="text-gray-600">
                                Découvrez nos dernières publications
                            </p>
                        </div>

                        <div className="text-center">
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="bg-white/80 backdrop-blur-sm hover:bg-white/90 px-8 py-3 text-lg"
                                >
                                    Voir toutes les actualités
                                    <ArrowLeft className="h-5 w-5 ml-2 rotate-180"/>
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
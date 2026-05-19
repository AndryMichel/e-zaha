"use client"

import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import Image from 'next/image';
import {useGetDirecteurActuel} from "@/services/api/directeur/directeur.api";
import {getImageUrl} from "@/services/helpers/imageUtils";
import {Loader2, User} from "lucide-react";

export const MotDirPage = () => {
    const {data: directeur, isLoading, isError} = useGetDirecteurActuel();


    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Section */}
            <PageHeaderMenu
                title="Mot du Directeur"
            />

            {/* Main Content Section with Director Image */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Contenu principal toujours affiché */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Text Content */}
                        <motion.div
                            initial={{opacity: 0, x: -50}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.8}}
                            className="md:w-2/3"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Chères toutes et tous,
                            </h2>

                            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                                <p className="text-justify">
                                    Pilier central du développement territorial, Ministère de l&#39;interieur et de la Décentralisation (MID) assure la mise en œuvre efficace du
                                    Plan
                                    National de Décentralisation Développement local (PNDDL), moteur de la transformation
                                    socio-économique de notre pays.L&#39;Observatoire de la Décentralisation
                                    et
                                    du Développement Local est un dispositif stratégique qui permet d&#39;assurer le
                                    suivi
                                    et l&#39;évaluation du processus de décentralisation à Madagascar. Il a pour mission
                                    d&#39;analyser, de capitaliser et de valoriser les résultats des études et
                                    recherches
                                    menées sur la gouvernance locale, tout en consolidant les acquis des Collectivités
                                    Territoriales Décentralisées (CTD).
                                </p>

                                <p className="text-justify">
                                    Dans cette dynamique, nous avons mis en place cette plateforme numérique, qui se
                                    veut être un outil interactif et opérationnel facilitant le partage
                                    d&#39;informations,
                                    la communication et la diffusion des données relatives à la gouvernance locale et
                                    au développement des territoires.
                                </p>

                                <p className="text-justify">Cette plateforme vise à permettre :</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Un cadre structuré pour le suivi et l&#39;évaluation des politiques de
                                        décentralisation.
                                    </li>
                                    <li>Une meilleure circulation des informations et des expériences entre les acteurs
                                        locaux.
                                    </li>
                                    <li>Une amélioration de l&#39;efficacité des outils comme l&#39;Indice de
                                        Gouvernance Locale
                                        (IGL),
                                        essentiel pour mesurer les performances des communes et identifier les axes
                                        d&#39;amélioration.
                                    </li>
                                    <li>Le renforcement des capacités des Centres Régionaux d&#39;Observation et de
                                        Communication (CROCs),
                                        déployés dans les 23 régions, afin d&#39;optimiser la collecte, l&#39;analyse et
                                        la
                                        gestion des
                                        données territoriales.
                                    </li>
                                </ul>

                                <p className="text-justify">
                                    Les Collectivités Territoriales Décentralisées sont au cœur du développement local.
                                    Grâce à cette plateforme, elles bénéficieront de :
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Un accès facilité aux données et aux résultats des évaluations de gouvernance.
                                    </li>
                                    <li>Des outils performants pour mieux orienter leurs décisions stratégiques et
                                        optimiser
                                        la gestion de leurs ressources.
                                    </li>
                                    <li>Un accompagnement pour renforcer leurs capacités en suivi-évaluation et en
                                        gouvernance locale.
                                    </li>
                                </ul>

                                <p className="text-justify">
                                    La réussite de cette plateforme repose sur l&#39;implication active de tous les
                                    acteurs
                                    :
                                    administrations centrales, Collectivités Territoriales Décentralisées, partenaires
                                    techniques et financiers. Nous encourageons fortement chaque utilisateur à
                                    s&#39;approprier
                                    cet outil, à y contribuer activement et à l&#39;utiliser comme levier
                                    d&#39;amélioration
                                    continue pour nos territoires.
                                </p>

                                <p>
                                    Nous sommes convaincus que cette initiative permettra de renforcer la transparence,
                                    l&#39;efficacité et la performance de notre gouvernance locale, pour un
                                    développement
                                    harmonieux et inclusif de Madagascar.
                                </p>

                                <p className="text-1xl font-bold text-gray-900 mb-6 text-center">
                                    &quot;Ensemble, faisons de cette plateforme un véritable moteur du changement au
                                    service
                                    de nos Collectivités Territoriales Décentralisées.&quot;
                                </p>
                            </div>
                        </motion.div>

                        {/* Director Image and Signature - Section dynamique */}
                        <motion.div
                            initial={{opacity: 0, x: 50}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.8, delay: 0.2}}
                            className="md:w-1/3 flex flex-col items-center"
                        >
                            {isLoading ? (
                                // État de chargement pour la section directeur
                                <div className="w-full flex flex-col items-center">
                                    <div
                                        className="relative w-full h-96 mb-6 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-white flex items-center justify-center ring-2 ring-blue-200/50 ring-offset-4">
                                        <Loader2 className="h-12 w-12 animate-spin text-blue-600"/>
                                    </div>
                                    <div className="text-center mt-4">
                                        <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ) : isError || !directeur ? (
                                // État d'erreur ou pas de directeur pour la section directeur
                                <div className="w-full flex flex-col items-center">
                                    <div
                                        className="relative w-full h-96 mb-6 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-white flex items-center justify-center ring-2 ring-gray-200/50 ring-offset-4">
                                        <div className="text-center">
                                            <User className="h-16 w-16 mx-auto mb-4 text-gray-300"/>
                                            <p className="text-gray-500 text-sm">Photo non disponible</p>
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Directeur ODDL
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            Directeur de l&#39;Observatoire de la Décentralisation et du Développement
                                            Local
                                            (ODDL)
                                        </p>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Informations en cours de mise à jour
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Contenu avec les informations du directeur - VERSION SÉCURISÉE
                                <>
                                    <div
                                        className="relative w-full h-96 mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-2 ring-blue-200/50 ring-offset-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-3xl transition-all duration-300 hover:ring-blue-300/70 hover:scale-[1.02]">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10"></div>
                                        <Image
                                            src={getImageUrl(directeur?.image_url) || '/assets/directeur.jpeg'}
                                            alt={`Photo de ${directeur?.nom || 'Directeur'}${directeur?.prenom ? ` ${directeur.prenom}` : ''}`}
                                            fill
                                            style={{objectFit: 'cover', objectPosition: 'top center'}}
                                            className="rounded-xl transition-transform duration-300 hover:scale-105"
                                        />
                                        <div
                                            className="absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse z-20"></div>
                                    </div>

                                    <div
                                        className="text-center mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                                        <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            {(directeur?.nom || 'DIRECTEUR').toUpperCase()}{directeur?.prenom ? ` ${directeur.prenom}` : ''}
                                        </h3>
                                        <p className="text-gray-600 mt-1 font-medium">
                                            {directeur?.description || "Directeur de l'Observatoire de la Décentralisation et du Développement Local (ODDL)"}
                                        </p>
                                        <div
                                            className="text-xs text-gray-500 mt-3 px-3 py-1 bg-gray-50 rounded-full inline-block border">
                                            {directeur?.updated_at ? (
                                                `Mis à jour le ${new Date(directeur.updated_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}`
                                            ) : (
                                                'Date de mise à jour inconnue'
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MotDirPage;
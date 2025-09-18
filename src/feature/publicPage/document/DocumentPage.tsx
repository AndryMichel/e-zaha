"use client";
import React from 'react';
import {Card, CardContent} from '@/components/ui/molécules/card';
import {motion} from '@/components/ui/templates/motion';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import {useGetDocumentsByCategory} from "@/services/api/documents/document.api";
import {getDocumentUrl, getFileIcon} from "@/services/helpers/documentUtils";
import {Download, FolderOpen, Loader2} from 'lucide-react';

export const DocumentPage = () => {
    const {data: documents, isLoading, isError} = useGetDocumentsByCategory("travail");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white text-gray-900">
                <PageHeaderMenu
                    title="Documents de Travail"
                    subtitle="Consultez et téléchargez nos guides et documents de référence"
                />
                <section className="py-16">
                    <div className="container mx-auto px-6 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600"/>
                    </div>
                </section>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-white text-gray-900">
                <PageHeaderMenu
                    title="Documents de Travail"
                    subtitle="Consultez et téléchargez nos guides et documents de référence"
                />
                <section className="py-16">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-red-600">Erreur lors du chargement des documents</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Documents de Travail"
                subtitle="Consultez et téléchargez nos guides et documents de référence"
            />

            <section className="py-16">
                <div className="container mx-auto px-6">
                    {documents.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderOpen className="h-16 w-16 mx-auto text-gray-400 mb-4"/>
                            <p className="text-gray-600">Aucun document de travail disponible pour le moment</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {documents.map((document, index) => (
                                <motion.div
                                    key={document.id_doc}
                                    initial={{opacity: 0, y: 30}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: index * 0.1}}
                                    className="transform transition duration-500 hover:scale-105"
                                >
                                    <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl">
                                        <CardContent className="p-6 flex flex-col items-center">
                                            <div className="text-4xl mb-4">
                                                {getFileIcon(document.file_url)}
                                            </div>
                                            <h3 className="text-xl font-bold text-center mb-2">{document.titre}</h3>
                                            {document.description && (
                                                <p className="text-gray-600 text-center mb-4">{document.description}</p>
                                            )}
                                            <div
                                                className="flex flex-col sm:flex-row gap-2 mt-auto w-full justify-center">
                                                <a
                                                    href={getDocumentUrl(document.file_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 text-center"
                                                >
                                                    Consulter
                                                </a>
                                                <a
                                                    href={getDocumentUrl(document.file_url)}
                                                    download={document.titre}
                                                    className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300 text-center gap-2"
                                                >
                                                    <Download className="h-4 w-4"/>
                                                    Télécharger
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
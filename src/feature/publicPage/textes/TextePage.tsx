"use client";
import React from 'react';
import {Card, CardContent} from '@/components/ui/molécules/card';
import {motion} from '@/components/ui/templates/motion';
import PageHeaderMenu from "@/components/ui/templates/PageHeaderMenu";
import {useGetDocumentsByCategory} from "@/services/api/documents/document.api";
import {getDocumentUrl, getFileIcon} from "@/services/helpers/documentUtils";
import {Download, Gavel, Loader2} from 'lucide-react';

export const TextesPage = () => {
    const {data: documents, isLoading, isError} = useGetDocumentsByCategory("textes");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white text-gray-900">
                <PageHeaderMenu
                    title="Textes et Lois"
                    subtitle="Consultez et téléchargez les textes légaux et réglementaires"
                />
                <section className="py-12">
                    <div className="container mx-auto px-4 flex justify-center">
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
                    title="Textes et Lois"
                    subtitle="Consultez et téléchargez les textes légaux et réglementaires"
                />
                <section className="py-12">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-red-600">Erreur lors du chargement des documents</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <PageHeaderMenu
                title="Textes et Lois"
                subtitle="Consultez et téléchargez les textes légaux et réglementaires"
            />

            <section className="py-12">
                <div className="container mx-auto px-4">
                    {documents.length === 0 ? (
                        <div className="text-center py-12">
                            <Gavel className="h-16 w-16 mx-auto text-gray-400 mb-4"/>
                            <p className="text-gray-600">Aucun texte de loi disponible pour le moment</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {documents.map((document, index) => (
                                <motion.div
                                    key={document.id_doc}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: index * 0.1}}
                                    className="transform transition duration-300 hover:scale-102"
                                >
                                    <Card className="overflow-hidden h-full shadow-md hover:shadow-lg">
                                        <CardContent className="p-4 flex flex-col items-center">
                                            <div className="text-3xl mb-2">
                                                {getFileIcon(document.file_url)}
                                            </div>
                                            <h3 className="text-lg font-bold text-center mb-1">{document.titre}</h3>
                                            {document.description && (
                                                <p className="text-gray-600 text-sm text-center mb-3">{document.description}</p>
                                            )}
                                            <div className="flex flex-row gap-2 mt-auto w-full justify-center">
                                                <a
                                                    href={getDocumentUrl(document.file_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition duration-300 text-center"
                                                >
                                                    Consulter
                                                </a>
                                                <a
                                                    href={getDocumentUrl(document.file_url)}
                                                    download={document.titre}
                                                    className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded text-sm transition duration-300 text-center gap-1"
                                                >
                                                    <Download className="h-3 w-3"/>
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
"use client"

import React from 'react';
import {CardContent, CardTitle} from '@/components/ui/molécules/card';
import {Calendar, Clock, ExternalLink} from 'lucide-react';
import Link from 'next/link';

export interface ActualiteContentProps {
    id: number;
    titre: string;
    contenu: string;
    type: string;
    date: string;
}

const ActualiteContent: React.FC<ActualiteContentProps> = ({id, titre, contenu, date}) => {
    // Fonction pour tronquer le contenu si trop long
    const truncateContent = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    return (
        <CardContent className="p-6 flex-grow flex flex-col">
            <CardTitle className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                {titre}
            </CardTitle>

            {/* Date de publication avec icône */}
            <div className="flex items-center text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0"/>
                <span className="text-sm font-medium">{date}</span>
                <div className="ml-auto flex items-center text-gray-400">
                    <Clock className="h-3 w-3 mr-1"/>
                    <span className="text-xs">Publié</span>
                </div>
            </div>

            {/* Contenu tronqué */}
            <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                {truncateContent(contenu)}
            </p>

            {/* Lien vers le détail */}
            <div className="mt-auto">
                <Link
                    href={`/actualites/${id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group"
                >
                    Lire la suite
                    <ExternalLink
                        className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"/>
                </Link>
            </div>
        </CardContent>
    );
};

export default ActualiteContent;
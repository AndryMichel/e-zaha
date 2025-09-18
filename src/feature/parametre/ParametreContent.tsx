"use client"

import React from 'react';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';

import {AlertTriangle, Calendar} from 'lucide-react';

export function ParametreContent() {

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Card>
                <CardHeader className="text-gray-800">
                    <CardTitle className="text-3xl font-bold">Planification</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center max-w-2xl">
                            <div className="flex justify-center mb-4">
                                <AlertTriangle size={48} className="text-yellow-500"/>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Fonctionnalité Paramètres non disponible
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Le module de planification est actuellement en cours de développement et n&#39;est pas
                                encore disponible.
                                Nous travaillons activement pour vous offrir cette fonctionnalité très prochainement.
                            </p>
                            <div className="flex items-center justify-center mb-4">
                                <Calendar className="h-6 w-6 text-gray-500 mr-2"/>
                                <span className="text-gray-500">Disponible prochainement</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ParametreContent;
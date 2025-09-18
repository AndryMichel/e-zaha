"use client"

import React, {useState} from 'react';
import {TableCell, TableRow} from '@/components/ui/organismes/table';
import {Button} from '@/components/ui/atomes/button';
import {Check, CheckCircle, Copy, Loader2, MapPin, UserCircle, XCircle} from 'lucide-react';
import {RoleRegister} from '@/services/types/all-role-register.type';
import {roleRegisterApi} from '@/services/api/profil/get-all-role-register.api';
import {useAuth} from '@/feature/auth/context/AuthProvider';

interface RoleRegisterWithPassword extends RoleRegister {
    mot_de_passe?: string;
}

interface RoleRowProps {
    role: RoleRegisterWithPassword;
    onStatusUpdate?: (userId: string, newStatus: boolean) => void;
}

export function RoleRow({role, onStatusUpdate}: RoleRowProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(role.status_register);

    const {user} = useAuth();
    const token = user?.token || '';

    // Utilisation des données de la base de données
    const password = role.mot_de_passe || '1254484';

    const copyCredentials = async () => {
        const credentials = `nom d'utilisateur: ${role.utilisateur}\nmot de passe: ${password}`;
        try {
            await navigator.clipboard.writeText(credentials);
            setCopiedField('credentials');
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    };

    const handleStatusToggle = async () => {
        if (!token) return;

        setIsUpdatingStatus(true);
        const newStatus = !currentStatus;

        try {
            const response = await roleRegisterApi.updateStatus(
                role.id_register_users,
                newStatus,
                token
            );

            if (response.success) {
                setCurrentStatus(newStatus);
                // Callback pour informer le composant parent de la mise à jour
                onStatusUpdate?.(role.id_register_users, newStatus);

                // Optionnel: afficher un message de succès
                console.log(response.message);
            } else {
                console.error('Erreur lors de la mise à jour:', response.message);
                alert('Erreur lors de la mise à jour du statut');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            alert('Erreur lors de la mise à jour du statut');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center space-x-3">
                    <UserCircle className="h-10 w-10 text-gray-500"/>
                    <div>
                        <div className="font-medium">{role.utilisateur}</div>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500"/>
                        <span className="text-sm">
                            {role.province_name || ""}
                        </span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500"/>
                        <span className="text-sm">
                            {role.region_name || ""}
                        </span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500"/>
                        <span className="text-sm">
                            {role.district_name || ""}
                        </span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500"/>
                        <span className="text-sm">
                            {role.commune_name || ""}
                        </span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center space-x-2">
                    <button
                        className="inline-flex items-center px-2 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                        title={currentStatus ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
                        onClick={handleStatusToggle}
                        disabled={isUpdatingStatus}
                    >
                        {isUpdatingStatus ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                <Loader2 className="h-4 w-4 mr-1 animate-spin"/>
                                ...
                            </span>
                        ) : currentStatus ? (
                            <span
                                className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200">
                                <CheckCircle className="h-4 w-4 mr-1"/>
                                Actif
                            </span>
                        ) : (
                            <span
                                className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200">
                                <XCircle className="h-4 w-4 mr-1"/>
                                Inactif
                            </span>
                        )}
                    </button>
                </div>
            </TableCell>

            {/* Colonne Actions */}
            <TableCell>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={copyCredentials}
                    className="flex items-center gap-2"
                    title="Copier les identifiants"
                >
                    {copiedField === 'credentials' ? (
                        <>
                            <Check className="h-4 w-4 text-green-600"/>
                            <span className="text-green-600">Copié!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4"/>
                            <span>Copier</span>
                        </>
                    )}
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default RoleRow;
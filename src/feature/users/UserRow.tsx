"use client"

import React, {useState} from 'react';
import {TableCell, TableRow} from '@/components/ui/organismes/table';
import {Button} from '@/components/ui/atomes/button';
import {Mail, MapPin, Phone, Shield, UserCircle} from 'lucide-react';
import {User} from '@/services/types/all-user.type';
import {userApi} from '@/services/api/profil/get-all-user.api';
import {useSession} from "next-auth/react";
import ModalConfirmDelete from "@/feature/users/ModalConfirmDelete";

interface UserRowProps {
    user: User;
    onUserDeleted?: () => void; // Callback pour actualiser la liste
}

export function UserRow({user, onUserDeleted}: UserRowProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const {data: session} = useSession();


    const token = session?.user?.token || "";

    const handleDelete = async () => {
        if (!token) return;

        setIsDeleting(true);
        try {
            const response = await userApi.deleteUser(user.admin_id, token);

            if (response.success) {
                console.log("Utilisateur supprimé avec succès");
                onUserDeleted?.(); // Actualiser la liste
                setShowModal(false);
            } else {
                console.error("Erreur lors de la suppression:", response.message);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center space-x-3">
                    <UserCircle className="h-10 w-10 text-gray-500"/>
                    <div>
                        <div className="font-medium">{`${user.prenom} ${user.nom}`}</div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500"/>
                        <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500"/>
                        <span className="text-sm">{user.phone}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <MapPin className="h-4 w-4 text-gray-500"/>
                <div>
                    <div className="text-sm">{user.commune_name || "Commune inconnue"}</div>
                    <div className="text-xs text-gray-500 text-wrap">
                        {`${user.district_name || ''}, ${user.region_name || ''}, ${user.province_name || ''}`}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500"/>
                    <span className="capitalize">{user.role}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setShowModal(true)}
                    >
                        Supprimer
                    </Button>
                </div>

                {/* Modal de confirmation */}
                <ModalConfirmDelete
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleDelete}
                    user={user}
                    isDeleting={isDeleting}
                />
            </TableCell>
        </TableRow>
    );
}
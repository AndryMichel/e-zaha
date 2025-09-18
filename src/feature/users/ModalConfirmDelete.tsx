"use client";

import React from "react";
import {Button} from "@/components/ui/atomes/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";
import {AlertTriangle, UserX} from "lucide-react";
import {User} from "@/services/types/all-user.type";

interface ModalConfirmDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: User | null;
    isDeleting?: boolean;
}

export function ModalConfirmDelete({
                                       isOpen,
                                       onClose,
                                       onConfirm,
                                       user,
                                       isDeleting = false
                                   }: ModalConfirmDeleteProps) {

    const handleConfirm = () => {
        onConfirm();
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5"/>
                        Confirmer la suppression
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex items-start gap-3">
                            <UserX className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"/>
                            <div className="space-y-2">
                                <p className="text-red-800 font-medium">
                                    Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                                </p>

                                <div className="space-y-1 text-sm text-red-700">
                                    <p>
                                        <span className="font-medium">Nom :</span> {user.prenom} {user.nom}
                                    </p>
                                    <p>
                                        <span className="font-medium">Email :</span> {user.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">Username :</span> {user.username}
                                    </p>
                                    <p>
                                        <span className="font-medium">Rôle :</span> {user.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex space-x-2 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Suppression...
                            </>
                        ) : (
                            'Supprimer définitivement'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ModalConfirmDelete;
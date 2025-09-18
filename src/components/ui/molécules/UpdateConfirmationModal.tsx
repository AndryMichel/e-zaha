"use client";

import React from "react";
import {Button} from "@/components/ui/atomes/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";
import {CheckCircle, XCircle} from "lucide-react";

interface UpdateConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isUpdating: boolean;
    communeName: string;
    newStatus: boolean;
    entityType?: 'commune' | 'région' | 'district'; // Nouveau prop pour différencier le type d'entité
}

export function UpdateConfirmationModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            isUpdating,
                                            communeName,
                                            newStatus,
                                        }: UpdateConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirmer la modification</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p>Données vérifiées
                        - <strong>{communeName}</strong> : <strong className="flex items-center gap-1">
                            {newStatus ? (
                                <>
                                    <CheckCircle className="h-4 w-4 text-green-600"/>
                                    Actif
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-red-500"/>
                                    Inactif
                                </>
                            )}
                        </strong> ?
                    </p>
                </div>

                <DialogFooter className="flex space-x-2 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isUpdating}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Mise à jour..." : "Confirmer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateConfirmationModal;
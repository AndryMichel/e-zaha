"use client";

import React from "react";
import {Button} from "@/components/ui/atomes/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemId: string;
    isDeleting: boolean;
    message?: string; // Ajouté la propriété message
    title?: string;
}

export function DeleteConfirmationModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            itemId,
                                            isDeleting
                                        }: DeleteConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p>Êtes-vous sûr de vouloir supprimer cet enregistrement (ID: {itemId}) ?</p>
                    <p className="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
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
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteConfirmationModal;
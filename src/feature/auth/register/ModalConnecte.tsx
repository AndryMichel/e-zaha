"use client";

import React from "react";
import {Button} from "@/components/ui/atomes/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/molécules/dialog";
import {CheckCircle} from "lucide-react";
import {useRouter} from "next/navigation";

interface ModalConnecteProps {
    isOpen: boolean;
    onClose: () => void;
    username?: string;
    role?: string;
    message?: string;
}

export function ModalConnecte({
                                  isOpen,
                                  onClose,
                                  username,
                                  role,
                                  message = "Inscription réussie !"
                              }: ModalConnecteProps) {
    const router = useRouter();

    const handleSeConnecter = () => {
        onClose();
        router.push('/login');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5"/>
                        Inscription réussie
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-green-800 font-medium mb-2">
                            {message}
                        </p>

                        {username && (
                            <div className="space-y-1 text-sm text-green-700">
                                <p>
                                    <span className="font-medium">Nom d&#39;utilisateur :</span> {username}
                                </p>
                                {role && (
                                    <p>
                                        <span className="font-medium">Rôle :</span> {role}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <p className="text-gray-600 text-sm text-center">
                        Vous pouvez maintenant vous connecter avec vos identifiants.
                    </p>
                </div>

                <DialogFooter className="flex space-x-2 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Fermer
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSeConnecter}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Se connecter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ModalConnecte;
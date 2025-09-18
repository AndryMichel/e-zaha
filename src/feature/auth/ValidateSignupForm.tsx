"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/atomes/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/molécules/dialog";
import {Input} from "@/components/ui/atomes/input";
import {Label} from "@/components/ui/atomes/label";
import {Alert, AlertDescription} from "@/components/ui/atomes/alert";
import {AlertCircle, CheckCircle, Loader2} from "lucide-react";
import {validateSignup} from "@/services/api/auth/validate-signup.api";
import {PasswordInput} from "@/components/ui/atomes/PasswordInput";

interface ValidateSignupFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ValidateSignupForm({
                                       isOpen,
                                       onClose,
                                       onSuccess,
                                   }: ValidateSignupFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isValidated, setIsValidated] = useState(false);


    useEffect(() => {
        if (isOpen) {
            setSuccess(null);
            setError(null);
            setUsername("");
            setPassword("");
            setIsValidated(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await validateSignup({
                utilisateur: username,
                mot_de_passe: password
            });

            if (response.success && response.user) {
                let role = "communal";
                const usernameValue = String(response.user.utilisateur || "");
                const usernameLower = usernameValue.toLowerCase();

                if (usernameLower.startsWith("admin")) {
                    role = "administrateur";
                } else if (usernameValue.toUpperCase().startsWith("ODDL")) {
                    role = "ODDL";
                } else if (usernameLower.startsWith("region")) {
                    role = "regional";
                } else if (usernameLower.startsWith("district")) {
                    role = "district";
                }

                setSuccess(`Compte validé. Votre nom d'utilisateur est ${usernameValue} et votre rôle sera ${role}.`);
                setIsValidated(true);

                sessionStorage.setItem("validationData", JSON.stringify({
                    username: usernameValue,
                    id_register_users: response.user.id_register_users || "",
                    province: response.user.province,
                    region: response.user.region,
                    district: response.user.district,
                    commune: response.user.commune,
                    role: role,
                    validated: true
                }));

                // Attendre 2 secondes avant de fermer et rediriger
                setTimeout(() => {
                    onSuccess();
                    // Ne pas rediriger car on est déjà sur la page register
                }, 2000);

            } else {
                setError(response.message || "La validation a échoué. Veuillez vérifier vos informations.");
            }
        } catch (err) {
            console.error("Erreur de validation:", err);
            setError(err instanceof Error ? err.message : "Une erreur s'est produite lors de la validation");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => isLoading && e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Validation d&#39;inscription</DialogTitle>
                    <DialogDescription>
                        Veuillez entrer vos informations de validation pour accéder à l&#39;inscription
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-4 w-4"/>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Afficher le loader pendant le traitement */}
                    {isLoading && !success && (
                        <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                            <AlertDescription>Validation en cours...</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="username">Nom d&#39;utilisateur</Label>
                        <Input
                            id="username"
                            placeholder="Entrez votre nom d'utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="validationPassword">Mot de passe de validation</Label>
                        <PasswordInput
                            id="validationPassword"
                            placeholder="Entrez votre mot de passe de validation"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || isValidated}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Validation en cours...
                                </>
                            ) : isValidated ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4"/>
                                    Validé
                                </>
                            ) : (
                                "Valider"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
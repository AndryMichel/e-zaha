// RegisterForm.tsx - Version élégante avec même style que login
"use client";

import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {
    AlertCircle,
    Calendar,
    FileText,
    Home,
    Loader2,
    Lock,
    Mail,
    Phone,
    User,
    UserCheck,
    UserPlus
} from "lucide-react";
import {useRegister} from "@/feature/auth/hooks/useRegister";
import {RegisterFormData} from "@/services/types/register.type";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {Label} from "@/components/ui/atomes/label";
import {Textarea} from "@/components/ui/atomes/textarea";
import {Alert, AlertDescription} from "@/components/ui/atomes/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/molécules/select";
import {ValidateSignupForm} from "@/feature/auth/ValidateSignupForm";
import {cancelSignup} from "@/services/api/auth/cancel-signup.api";
import {PasswordInput} from "@/components/ui/atomes/PasswordInput";
import ModalConnecte from "@/feature/auth/register/ModalConnecte";

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentPropsWithoutRef<"div">) {

    const [showValidationModal, setShowValidationModal] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    // États pour la modal de succès
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registrationData, setRegistrationData] = useState<{
        username?: string;
        role?: string;
        message?: string;
    }>({});

    const [formData, setFormData] = useState<RegisterFormData>({
        nom: "",
        prenom: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        role: "",
        gender: "",
        situation: "",
        description: "",
        date_of_birth: "",
        validated: false,
        province_name: "",
        region_name: "",
        district_name: "",
        commune_name: ""
    });
    const {register, isLoading, error, success} = useRegister();

    // Vérifier si l'utilisateur a déjà passé la validation
    useEffect(() => {
        const validationData = sessionStorage.getItem("validationData");
        if (validationData) {
            const parsedData = JSON.parse(validationData);
            if (parsedData.validated) {
                setIsValidated(true);

                let autoRole = parsedData.role || "communal";

                if (!parsedData.role && parsedData.username && typeof parsedData.username === 'string') {
                    const usernameLower = parsedData.username.toLowerCase();
                    if (usernameLower.startsWith("admin")) {
                        autoRole = "administrateur";
                    } else if (parsedData.username.toUpperCase().startsWith("ODDL")) {
                        autoRole = "ODDL";
                    } else if (usernameLower.startsWith("region")) {
                        autoRole = "regional";
                    } else if (usernameLower.startsWith("district")) {
                        autoRole = "district";
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    username: parsedData.username || prev.username,
                    role: autoRole,
                    validated: true,
                    province_name: parsedData.province || "",
                    region_name: parsedData.region || "",
                    district_name: parsedData.district || "",
                    commune_name: parsedData.commune || "",
                    id_register_users: parsedData.id_register_users || ""
                }));
            }
        } else {
            setShowValidationModal(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        if (name === "password") {
            validatePassword(value);
            if (confirmPassword) validateConfirmPassword(value, confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validateConfirmPassword(formData.password, value);
    };

    const validatePassword = (password: string) => {
        if (password && password.length < 6) {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
            return false;
        }
        setPasswordError(null);
        return true;
    };

    const validateConfirmPassword = (password: string, confirmPwd: string) => {
        if (confirmPwd && password !== confirmPwd) {
            setConfirmPasswordError("Les mots de passe ne correspondent pas");
            return false;
        }
        setConfirmPasswordError(null);
        return true;
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.validated) {
            setShowValidationModal(true);
            return;
        }

        if (!formData.nom || !formData.prenom || !formData.phone || !formData.email ||
            !formData.username || !formData.password || !formData.gender ||
            !formData.date_of_birth || !formData.situation || !formData.description) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        const isPasswordValid = validatePassword(formData.password);
        const isConfirmPasswordValid = validateConfirmPassword(formData.password, confirmPassword);

        if (!isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        const registerSuccess = await register(formData);

        if (registerSuccess) {
            sessionStorage.removeItem("validationData");

            setRegistrationData({
                username: formData.username,
                role: formData.role,
                message: success || "Inscription réussie !"
            });

            setShowSuccessModal(true);
        }
    };

    const handleValidationSuccess = () => {
        setIsValidated(true);
        setShowValidationModal(false);

        const validationData = sessionStorage.getItem("validationData");
        if (validationData) {
            const parsedData = JSON.parse(validationData);

            let autoRole = parsedData.role || "communal";

            if (!parsedData.role && parsedData.username && typeof parsedData.username === 'string') {
                const usernameLower = parsedData.username.toLowerCase();
                if (usernameLower.startsWith("admin")) {
                    autoRole = "administrateur";
                } else if (parsedData.username.toUpperCase().startsWith("ODDL")) {
                    autoRole = "ODDL";
                } else if (usernameLower.startsWith("region")) {
                    autoRole = "regional";
                } else if (usernameLower.startsWith("district")) {
                    autoRole = "district";
                }
            }

            setFormData(prev => ({
                ...prev,
                username: parsedData.username || "",
                role: autoRole,
                validated: true,
                province_name: parsedData.province || "",
                region_name: parsedData.region || "",
                district_name: parsedData.district || "",
                commune_name: parsedData.commune || "",
                id_register_users: parsedData.id_register_users || ""
            }));
        }
    };

    const handleCancelValidation = async () => {
        if (formData.username) {
            try {
                const res = await cancelSignup(formData.username);

                if (res && typeof res === "object" && "success" in res) {
                    if (res.success) {
                        setFormData({
                            nom: "",
                            prenom: "",
                            phone: "",
                            email: "",
                            username: "",
                            password: "",
                            role: "",
                            gender: "",
                            situation: "",
                            description: "",
                            date_of_birth: "",
                            validated: false,
                            province_name: "",
                            region_name: "",
                            district_name: "",
                            commune_name: ""
                        });
                        setConfirmPassword("");
                        setPasswordError(null);
                        setConfirmPasswordError(null);

                        sessionStorage.removeItem("validationData");
                        setIsValidated(false);
                        setShowValidationModal(true);
                    } else {
                        alert("Erreur lors de l'annulation");
                    }
                } else {
                    alert("Réponse du serveur invalide. Veuillez réessayer.");
                }
            } catch (error) {
                console.error("Erreur lors de l'annulation:", error);
                alert("Une erreur s'est produite lors de l'annulation. Veuillez réessayer.");
            }
        } else {
            setFormData({
                nom: "",
                prenom: "",
                phone: "",
                email: "",
                username: "",
                password: "",
                role: "",
                gender: "",
                situation: "",
                description: "",
                date_of_birth: "",
                validated: false,
                province_name: "",
                region_name: "",
                district_name: "",
                commune_name: ""
            });
            setConfirmPassword("");
            sessionStorage.removeItem("validationData");
            setIsValidated(false);
            setShowValidationModal(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setFormData({
            nom: "",
            prenom: "",
            phone: "",
            email: "",
            username: "",
            password: "",
            role: "",
            gender: "",
            situation: "",
            description: "",
            date_of_birth: "",
            validated: false,
            province_name: "",
            region_name: "",
            district_name: "",
            commune_name: ""
        });
        setConfirmPassword("");
        setPasswordError(null);
        setConfirmPasswordError(null);
        setIsValidated(false);
    };

    return (
        <div className={cn("w-full max-w-5xl mx-auto", className)} {...props}>
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                    Créer un compte
                </h2>
                <p className="text-gray-500 text-base leading-relaxed">
                    Rejoignez la plateforme e-Zaha
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Alertes */}
                {error && (
                    <Alert variant="destructive" className="border-0 bg-red-50/80 backdrop-blur-sm animate-pulse">
                        <AlertCircle className="h-4 w-4 text-red-500"/>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!isValidated && (
                    <Alert variant="default" className="border-0 bg-amber-50/80 backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4 text-amber-600"/>
                        <AlertDescription>
                            Vous devez d&#39;abord valider votre compte pour vous inscrire.
                            <Button
                                variant="link"
                                className="p-0 ml-2 text-amber-700 underline font-semibold"
                                onClick={() => setShowValidationModal(true)}
                            >
                                Cliquez ici pour valider
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {isValidated && (
                    <Alert variant="default" className="border-0 bg-green-50/80 backdrop-blur-sm">
                        <UserCheck className="h-4 w-4 text-green-600"/>
                        <AlertDescription>
                            <div className="space-y-2">
                                <p className="font-semibold">
                                    Compte validé ! Nom d&#39;utilisateur: <span
                                    className="font-bold">{formData.username}</span>
                                    {" "}• Rôle: <span className="font-bold">{formData.role}</span>
                                </p>

                                {/* Localisation selon le rôle */}
                                {formData.role === "communal" && formData.commune_name && (
                                    <div className="text-sm opacity-90">
                                        <strong>Localisation:</strong>
                                        {formData.province_name && <span> Province: {formData.province_name}</span>}
                                        {formData.region_name && <span> • Région: {formData.region_name}</span>}
                                        {formData.district_name && <span> • District: {formData.district_name}</span>}
                                        {formData.commune_name && <span> • Commune: {formData.commune_name}</span>}
                                    </div>
                                )}

                                {formData.role === "regional" && formData.region_name && (
                                    <div className="text-sm opacity-90">
                                        <strong>Localisation:</strong> Région: {formData.region_name}
                                    </div>
                                )}

                                {formData.role === "district" && formData.district_name && (
                                    <div className="text-sm opacity-90">
                                        <strong>Localisation:</strong>
                                        {formData.region_name && <span> Région: {formData.region_name} • </span>}
                                        District: {formData.district_name}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 font-medium"
                                    onClick={handleCancelValidation}
                                >
                                    Annuler la validation
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Informations personnelles */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <Label htmlFor="nom"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Nom *
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                                </div>
                                <Input
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200"
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                        </div>
                        <div className="group">
                            <Label htmlFor="prenom"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Prénom *
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                                </div>
                                <Input
                                    id="prenom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200"
                                    placeholder="Votre prénom"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <Label htmlFor="phone"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Téléphone *
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                                </div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200"
                                    placeholder="+261 XX XXX XXXX"
                                    required
                                />
                            </div>
                        </div>
                        <div className="group">
                            <Label htmlFor="email"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Email *
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label htmlFor="username"
                               className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                            Nom d&#39;utilisateur *
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <UserCheck
                                    className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                            </div>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isValidated}
                                className={cn(
                                    "w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200",
                                    isValidated && "bg-gray-100 cursor-not-allowed opacity-70"
                                )}
                                placeholder="Nom d'utilisateur unique"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <Label htmlFor="password"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Mot de passe *
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-14 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="h-6 mt-2">
                                {passwordError && (
                                    <p className="text-sm text-red-500 flex items-center animate-fadeIn">
                                        <AlertCircle className="h-3 w-3 mr-1.5"/>
                                        {passwordError}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="group">
                            <Label htmlFor="confirmPassword"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Confirmer le mot de passe *
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                                </div>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="w-full pl-12 pr-14 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="h-6 mt-2">
                                {confirmPasswordError && (
                                    <p className="text-sm text-red-500 flex items-center animate-fadeIn">
                                        <AlertCircle className="h-3 w-3 mr-1.5"/>
                                        {confirmPasswordError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <Label htmlFor="gender"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Genre *
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange("gender", value)}
                                value={formData.gender}
                                required
                            >
                                <SelectTrigger
                                    className="w-full py-4 px-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 hover:border-gray-300 hover:bg-white/70 border-gray-200">
                                    <SelectValue placeholder="Sélectionnez votre genre"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Homme">Homme</SelectItem>
                                    <SelectItem value="Femme">Femme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="group">
                            <Label htmlFor="date_of_birth"
                                   className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                                Date de naissance *
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                                </div>
                                <Input
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label htmlFor="situation"
                               className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                            Situation familiale *
                        </Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("situation", value)}
                            value={formData.situation}
                            required
                        >
                            <SelectTrigger
                                className="w-full py-4 px-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 hover:border-gray-300 hover:bg-white/70 border-gray-200">
                                <SelectValue placeholder="Sélectionnez votre situation"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="celibataire">Célibataire</SelectItem>
                                <SelectItem value="marie">Marié(e)</SelectItem>
                                <SelectItem value="divorce">Divorcé(e)</SelectItem>
                                <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="group">
                        <Label htmlFor="description"
                               className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors">
                            Description *
                        </Label>
                        <div className="relative">
                            <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                                <FileText
                                    className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                            </div>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white hover:border-gray-300 hover:bg-white/70 border-gray-200 min-h-[120px] resize-none"
                                placeholder="Décrivez-vous en quelques mots..."
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <Button
                        type="submit"
                        className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold text-base rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg border border-gray-600 hover:border-gray-500"
                        disabled={isLoading || !isValidated || !!passwordError || !!confirmPasswordError || formData.password.length < 6}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="h-5 w-5 mr-3 animate-spin"/>
                                Inscription en cours...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <UserPlus className="h-5 w-5 mr-3"/>
                                Créer mon compte
                            </span>
                        )}
                    </Button>
                </div>
            </form>

            <div className="mt-10 text-center">
                <p className="text-gray-600 mb-4">
                    Vous avez déjà un compte ?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-gray-800 hover:text-gray-900 transition-colors hover:underline"
                    >
                        Connectez-vous
                    </Link>
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-all duration-200 group hover:scale-105"
                >
                    <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform"/>
                    Retour à l&#39;accueil
                </Link>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>

            {/* Modal de validation */}
            <ValidateSignupForm
                isOpen={showValidationModal}
                onClose={() => setShowValidationModal(false)}
                onSuccess={handleValidationSuccess}
            />

            {/* Modal de succès */}
            <ModalConnecte
                isOpen={showSuccessModal}
                onClose={handleCloseSuccessModal}
                username={registrationData.username}
                role={registrationData.role}
                message={registrationData.message}
            />
        </div>
    );
}
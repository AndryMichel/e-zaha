// LoginForm.tsx - Version ultra-moderne et élégante
"use client";

import {useState} from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {useRouter, useSearchParams} from "next/navigation";
import {AlertCircle, Eye, EyeOff, Home, Loader2, Lock, LogIn, Mail, UserPlus} from "lucide-react";
import {Button} from "@/components/ui/atomes/button";
import {Input} from "@/components/ui/atomes/input";
import {Label} from "@/components/ui/atomes/label";
import {useAuth} from "@/feature/auth/context/AuthProvider";
import {Alert, AlertDescription} from "@/components/ui/atomes/alert";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentPropsWithoutRef<"div">) {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        identifier: "",
        password: "",
        general: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [touched, setTouched] = useState({
        identifier: false,
        password: false,
    });
    const {login} = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const validateIdentifier = (value: string) => {
        if (!value.trim()) {
            return "L'identifiant est requis";
        }
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) {
            return "Le mot de passe est requis";
        }
        if (value.length < 6) {
            return "Le mot de passe doit contenir au moins 6 caractères";
        }
        return "";
    };

    const handleBlur = (field: "identifier" | "password") => {
        setTouched({...touched, [field]: true});

        if (field === "identifier") {
            setErrors({...errors, identifier: validateIdentifier(identifier)});
        } else if (field === "password") {
            setErrors({...errors, password: validatePassword(password)});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const identifierError = validateIdentifier(identifier);
        const passwordError = validatePassword(password);

        setTouched({identifier: true, password: true});
        setErrors({
            identifier: identifierError,
            password: passwordError,
            general: "",
        });

        if (identifierError || passwordError) {
            return;
        }

        setIsSubmitting(true);

        try {
            const success = await login({
                identifier,
                password
            });

            if (success) {
                router.push(callbackUrl);
            } else {
                setErrors({
                    ...errors,
                    general: "Identifiant ou mot de passe incorrect",
                });
            }
        } catch {
            setErrors({
                ...errors,
                general: "Une erreur s'est produite. Veuillez réessayer.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = () => {
        setIsRegistering(true);
        router.push('/register');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                    Connexion
                </h2>
                <p className="text-gray-500 text-base leading-relaxed">
                    Accédez à votre espace personnel
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {errors.general && (
                    <Alert variant="destructive" className="border-0 bg-red-50/80 backdrop-blur-sm animate-pulse">
                        <AlertCircle className="h-4 w-4 text-red-500"/>
                        <AlertDescription>
                            {errors.general}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div className="group">
                        <Label
                            htmlFor="identifier"
                            className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors"
                        >
                            Email ou téléphone
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail
                                    className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                            </div>
                            <Input
                                id="identifier"
                                name="identifier"
                                placeholder="votre@email.com"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                onBlur={() => handleBlur("identifier")}
                                aria-invalid={!!errors.identifier}
                                autoComplete="username"
                                className={cn(
                                    "w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                    "focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white",
                                    "hover:border-gray-300 hover:bg-white/70",
                                    touched.identifier && errors.identifier
                                        ? "border-red-400 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500"
                                        : "border-gray-200"
                                )}
                                required
                            />
                        </div>
                        {touched.identifier && errors.identifier && (
                            <p className="text-sm text-red-500 mt-2 flex items-center animate-fadeIn">
                                <AlertCircle className="h-3 w-3 mr-1.5"/>
                                {errors.identifier}
                            </p>
                        )}
                    </div>

                    <div className="group">
                        <Label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-gray-800 transition-colors"
                        >
                            Mot de passe
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock
                                    className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors"/>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleBlur("password")}
                                aria-invalid={!!errors.password}
                                autoComplete="current-password"
                                className={cn(
                                    "w-full pl-12 pr-14 py-4 text-base border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                    "focus:ring-4 focus:ring-gray-500/20 focus:border-gray-600 focus:bg-white",
                                    "hover:border-gray-300 hover:bg-white/70",
                                    touched.password && errors.password
                                        ? "border-red-400 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500"
                                        : "border-gray-200"
                                )}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200 rounded-lg hover:bg-gray-100"
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5"/>
                                ) : (
                                    <Eye className="h-5 w-5"/>
                                )}
                            </button>
                        </div>
                        {touched.password && errors.password && (
                            <p className="text-sm text-red-500 mt-2 flex items-center animate-fadeIn">
                                <AlertCircle className="h-3 w-3 mr-1.5"/>
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <Button
                        type="submit"
                        className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold text-base rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg border border-gray-600 hover:border-gray-500"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="h-5 w-5 mr-3 animate-spin"/>
                                Connexion en cours...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <LogIn className="h-5 w-5 mr-3"/>
                                Se connecter
                            </span>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full py-4 px-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50/50 text-gray-700 font-semibold text-base rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm disabled:opacity-70"
                        onClick={handleRegister}
                        disabled={isRegistering}
                    >
                        {isRegistering ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="h-5 w-5 mr-3 animate-spin"/>
                                Redirection...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <UserPlus className="h-5 w-5 mr-3"/>
                                Créer un compte
                            </span>
                        )}
                    </Button>
                </div>
            </form>

            <div className="mt-10 text-center">
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
        </div>
    );
}

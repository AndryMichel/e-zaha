'use client'
import {AppSidebar} from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/molécules/breadcrumb"
import {Separator} from "@/components/ui/atomes/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/molécules/sidebar"
import {Button} from "@/components/ui/atomes/button"
import {useAuth} from "@/feature/auth/context/AuthProvider"
import {usePathname} from "next/navigation"
import {useState} from "react"
import {useSession} from "next-auth/react";
import {ToastContext} from "@/components/ui/atomes/toast"
import {useToast} from "@/components/ui/atomes/use-toast"
import {migrationApi} from "@/services/api/maj/maj-donne.api";
import {databaseExportApi} from "@/services/api/maj/get-database.api";
import {
    ChevronDown,
    Download,
    FileDown,
    FileSpreadsheet,
    FileText,
    Loader2,
    LogOut,
    MapPin,
    Menu,
    RefreshCw,
    User
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/atomes/dropdown-menu";
import {Badge} from "@/components/ui/atomes/badge";
import NotificationIcon from "@/feature/message/NotificationIcon";

// Define proper types for data export
type ExportDataType = "odd16" | "commune" | "region" | "oddl";
type ExportFormat = "csv" | "xlsx";

interface ExportFilters {
    userRole: string;
    userCommuneCode?: string;
    userDistrictCode?: string;
    userRegionCode?: string;
}

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <ToastContext>
            <DashboardContent>{children}</DashboardContent>
        </ToastContext>
    )
}

function DashboardContent({children}: { children: React.ReactNode }) {
    const {data: session} = useSession();
    const token = session?.user?.token;
    const {logout, user} = useAuth()
    const pathname = usePathname()
    const [isUpdating, setIsUpdating] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const {toast} = useToast()

    // Fonction pour obtenir le titre de la page actuelle
    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'Accueil'
        if (pathname === '/dashboard/commune') return 'Indicateurs Communes'
        if (pathname === '/dashboard/region') return 'Indicateurs Régions'
        if (pathname === '/dashboard/oddl') return 'Indicateur ODDL'
        if (pathname === '/dashboard/dbcommune') return 'Gestion Commune'
        if (pathname === '/dashboard/dbdistrict') return 'Gestion District'
        if (pathname === '/dashboard/dbregion') return 'Gestion Région'
        if (pathname === '/dashboard/dboddlo') return 'Gestion ODDL'
        if (pathname === '/dashboard/dboddseize') return 'Gestion ODDL 16'
        if (pathname === '/dashboard/users') return 'Gestion Utilisateurs'
        if (pathname === '/dashboard/role') return 'Gestion Rôles'
        if (pathname === '/dashboard/parametre') return 'Paramètres'
        return 'Dashboard'
    }

    // Fonction pour afficher la localisation en fonction du rôle de l'utilisateur
    const getLocationDisplay = () => {
        if (!user || !user.location) return '';

        switch (user.role) {
            case 'administrateur':
            case 'ODDL':
                return '';
            case 'regional':
                return `${user.location.region}`;
            case 'district':
                return `${user.location.district}`;
            case 'communal':
                return `${user.location.commune}`;
            default:
                return `${user.location.region}-${user.location.province}-${user.location.commune}`;
        }
    }

    const shouldDisplayLocation = () => {
        return user && user.role !== 'administrateur' && user.role !== 'ODDL';
    }

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'administrateur':
                return 'destructive';
            case 'ODDL':
                return 'default';
            case 'regional':
                return 'secondary';
            case 'district':
                return 'outline';
            case 'communal':
                return 'outline';
            default:
                return 'outline';
        }
    }

    // Fonction pour exécuter la migration des données
    const handleDataUpdate = async () => {
        if (!token) {
            toast({
                title: "Erreur d'authentification",
                description: "Vous devez être connecté pour effectuer cette action.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsUpdating(true);
            const response = await migrationApi.executeMigration(token);

            if (response.success && response.success[0]) {
                toast({
                    title: "Mise à jour réussie",
                    description: response.message[0],
                    variant: "default",
                });
            } else {
                toast({
                    title: "Erreur de mise à jour",
                    description: "Une erreur est survenue lors de la mise à jour des données.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            toast({
                title: "Erreur",
                description: errorMessage || "Impossible de se connecter au serveur pour la mise à jour des données.",
                variant: "destructive",
            });
            console.error("Erreur lors de la mise à jour:", error);
        } finally {
            setIsUpdating(false);
        }
    }

    // Téléchargement du document métadon
    const handleMetadonDownload = () => {
        const link = document.createElement('a');
        link.href = '/document/metadon.pdf';
        link.download = 'Métadonnées.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Téléchargement lancé",
            description: "Le document Métadonnées.pdf est en cours de téléchargement.",
            variant: "default",
        });
    }

    // Fonction pour construire les filtres d'exportation basés sur le rôle utilisateur
    const buildExportFilters = (): ExportFilters => {
        if (!user) return {userRole: ''};

        const filters: ExportFilters = {
            userRole: user.role
        };

        if (user.role === 'communal' && user.location?.commune_code) {
            filters.userCommuneCode = Array.isArray(user.location.commune_code)
                ? user.location.commune_code[0]
                : user.location.commune_code;
        }

        if ((user.role === 'district' || user.role === 'regional') && user.location?.district_code) {
            filters.userDistrictCode = Array.isArray(user.location.district_code)
                ? user.location.district_code[0]
                : user.location.district_code;
        }

        if (user.role === 'regional' && user.location?.region_code) {
            filters.userRegionCode = Array.isArray(user.location.region_code)
                ? user.location.region_code[0]
                : user.location.region_code;
        }

        return filters;
    };

    // Fonction générique pour gérer l'exportation des données avec filtrage par rôle
    const handleExport = async (dataType: ExportDataType, format: ExportFormat) => {
        if (!token) {
            toast({
                title: "Erreur d'authentification",
                description: "Vous devez être connecté pour effectuer cette action.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsExporting(true);
            let blob: Blob;
            let fileName: string;

            const filters = buildExportFilters();

            switch (dataType) {
                case "odd16":
                    blob = await databaseExportApi.exportOdd16Data(token, format);
                    fileName = `odd16_data.${format}`;
                    break;
                case "commune":
                    blob = await databaseExportApi.exportCommuneData(token, format, filters);
                    fileName = `communes_data.${format}`;
                    break;
                case "region":
                    blob = await databaseExportApi.exportRegionData(token, format, filters);
                    fileName = `region_data.${format}`;
                    break;
                case "oddl":
                    blob = await databaseExportApi.exportOddlData(token, format);
                    fileName = `oddl_localisation_data.${format}`;
                    break;
                default:
                    throw new Error("Type de données non pris en charge");
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "Exportation réussie",
                description: `Les données ont été exportées au format ${format.toUpperCase()}.`,
                variant: "default",
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            toast({
                title: "Erreur d'exportation",
                description: errorMessage || "Impossible d'exporter les données.",
                variant: "destructive",
            });
            console.error("Erreur lors de l'exportation:", error);
        } finally {
            setIsExporting(false);
        }
    }

    const isAdmin = user && (user.role === 'administrateur' || user.role === 'ODDL' || user.role === 'regional');
    const canDownloadMetadon = user && (user.role === 'administrateur' || user.role === 'ODDL');
    const canExportData = user && ['administrateur', 'ODDL', 'regional', 'district', 'communal'].includes(user.role);

    const getExportableDataTypes = (): ExportDataType[] => {
        if (!user) return [];

        if (user.role === 'administrateur' || user.role === 'ODDL') {
            return ["odd16", "commune", "region", "oddl"];
        }

        if (user.role === 'regional') {
            return ["region", "commune"];
        }

        if (user.role === 'district') {
            return ["commune"];
        }

        if (user.role === 'communal') {
            return ["commune"];
        }

        return [];
    };

    const exportableDataTypes = getExportableDataTypes();

    const getDataTypeName = (dataType: string) => {
        switch (dataType) {
            case "odd16":
                return "ODD16";
            case "commune":
                if (user?.role === 'communal') return "Ma commune";
                if (user?.role === 'district') return "Communes de mon district";
                if (user?.role === 'regional') return "Communes de ma région";
                return "Communes";
            case "region":
                if (user?.role === 'regional') return "Ma région";
                return "Régions";
            case "oddl":
                return "ODDL";
            default:
                return dataType;
        }
    };

    return (
        <SidebarProvider>
            {/* CHANGEMENT 1: Suppression de h-screen et overflow-hidden */}
            <div className="flex min-h-screen w-full">
                {/* Sidebar avec breakpoint responsive optimisé */}
                <div className="hidden lg:block shrink-0">
                    <AppSidebar/>
                </div>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div
                            className="fixed left-0 top-0 h-full w-64 bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AppSidebar/>
                        </div>
                    </div>
                )}

                {/* CHANGEMENT 2: Modification de la structure flex pour permettre le scroll */}
                <SidebarInset className="flex flex-col flex-1 min-w-0">
                    {/* Header fixe avec hauteur optimisée */}
                    <header
                        className="flex h-14 shrink-0 items-center justify-between border-b px-3 lg:px-6 w-full bg-white/95 backdrop-blur-sm sticky top-0 z-40">
                        {/* Section gauche - Navigation compacte */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Menu burger pour mobile */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <Menu className="h-4 w-4"/>
                            </Button>

                            {/* Trigger sidebar pour desktop */}
                            <div className="hidden lg:block">
                                <SidebarTrigger className="h-7 w-7"/>
                            </div>

                            <Separator orientation="vertical" className="h-4 hidden sm:block"/>

                            {/* Breadcrumb condensé */}
                            <Breadcrumb className="hidden md:flex">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/dashboard" className="text-sm text-muted-foreground">
                                            Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator/>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-sm font-medium">
                                            {getPageTitle()}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>

                            {/* Titre compact pour mobile */}
                            <div className="text-sm font-semibold md:hidden truncate">
                                {getPageTitle()}
                            </div>
                        </div>

                        {/* Section droite - Actions et profil compacts */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Notification */}
                            <NotificationIcon className="hidden sm:block"/>

                            {/* Actions administratives - Menu dropdown compact pour mobile */}
                            {(isAdmin || canDownloadMetadon || canExportData) && (
                                <div className="flex lg:hidden">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8">
                                                Actions
                                                <ChevronDown className="h-3 w-3 ml-1"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            {isAdmin && (
                                                <DropdownMenuItem
                                                    onClick={handleDataUpdate}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                                            Mise à jour...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RefreshCw className="h-4 w-4 mr-2"/>
                                                            Mise à jour
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            )}

                                            {canDownloadMetadon && (
                                                <DropdownMenuItem onClick={handleMetadonDownload}>
                                                    <Download className="h-4 w-4 mr-2"/>
                                                    Métadonnées
                                                </DropdownMenuItem>
                                            )}

                                            {canExportData && exportableDataTypes.length > 0 && (
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <FileDown className="h-4 w-4 mr-2"/>
                                                        Exporter
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        {exportableDataTypes.map((dataType) => (
                                                            <DropdownMenuSub key={dataType}>
                                                                <DropdownMenuSubTrigger>
                                                                    {getDataTypeName(dataType)}
                                                                </DropdownMenuSubTrigger>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleExport(dataType, "csv")}
                                                                    >
                                                                        <FileText className="h-4 w-4 mr-2"/>
                                                                        CSV
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleExport(dataType, "xlsx")}
                                                                    >
                                                                        <FileSpreadsheet className="h-4 w-4 mr-2"/>
                                                                        XLSX
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuSub>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}

                            {/* Actions administratives - Boutons individuels pour desktop */}
                            <div className="hidden lg:flex items-center gap-2">
                                {isAdmin && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDataUpdate}
                                        disabled={isUpdating}
                                        className="h-8"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                                Mise à jour...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2"/>
                                                Mise à jour
                                            </>
                                        )}
                                    </Button>
                                )}

                                {canDownloadMetadon && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleMetadonDownload}
                                        className="h-8"
                                    >
                                        <Download className="h-4 w-4 mr-2"/>
                                        Métadonnées
                                    </Button>
                                )}

                                {canExportData && exportableDataTypes.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={isExporting}
                                                className="h-8"
                                            >
                                                {isExporting ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                                        Export...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileDown className="h-4 w-4 mr-2"/>
                                                        Exporter
                                                    </>
                                                )}
                                                <ChevronDown className="h-3 w-3 ml-1"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>Exporter les données</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuGroup>
                                                {exportableDataTypes.map((dataType) => (
                                                    <DropdownMenuSub key={dataType}>
                                                        <DropdownMenuSubTrigger>
                                                            <span>{getDataTypeName(dataType)}</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem
                                                                onClick={() => handleExport(dataType, "csv")}
                                                            >
                                                                <FileText className="h-4 w-4 mr-2"/>
                                                                Format CSV
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleExport(dataType, "xlsx")}
                                                            >
                                                                <FileSpreadsheet className="h-4 w-4 mr-2"/>
                                                                Format XLSX
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                ))}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>

                            <div className="flex sm:hidden">
                                <NotificationIcon/>
                            </div>

                            <Separator orientation="vertical" className="h-4"/>

                            {/* Informations utilisateur compactes */}
                            {user && (
                                <>
                                    {/* Desktop user info */}
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3 text-muted-foreground"/>
                                                <span className="text-xs font-medium truncate max-w-[100px]">
                                                    {user.name}
                                                </span>
                                                <Badge variant={getRoleBadgeVariant(user.role)}
                                                       className="text-xs px-1 py-0">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            {shouldDisplayLocation() && getLocationDisplay() && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3"/>
                                                    <span className="truncate max-w-[100px]">
                                                        {getLocationDisplay()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile user info */}
                                    <div className="flex sm:hidden items-center">
                                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                                            {user.role}
                                        </Badge>
                                    </div>
                                </>
                            )}

                            {/* Bouton déconnexion */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 hover:bg-red-50 hover:text-red-600"
                                onClick={() => logout()}
                            >
                                <LogOut className="h-4 w-4 sm:mr-1"/>
                                <span className="hidden sm:inline">Déconnexion</span>
                            </Button>
                        </div>
                    </header>

                    {/* CHANGEMENT 3: Contenu principal avec scroll naturel */}
                    <main className="flex-1 bg-gray-50/50">
                        <div className="p-4 lg:p-6">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
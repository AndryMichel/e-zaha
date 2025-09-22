'use client'

import * as React from "react"
import {usePathname, useRouter} from "next/navigation"
import {
    Activity,
    AlertTriangle,
    BarChart2,
    Building2,
    Camera,
    ChevronRight,
    Database,
    FileText,
    FolderOpen,
    Layers,
    Mail,
    Map,
    MapPin,
    PieChart,
    Settings,
    Shield,
    Target,
    TrendingUp,
    User,
    Users
} from "lucide-react"
import {AnimatePresence, motion} from "framer-motion"
import {useAuth} from "@/feature/auth/context/AuthProvider"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/molécules/sidebar"
import Image from "next/image";

// Définir les types pour les rôles
type Role = 'administrateur' | 'ODDL' | 'regional' | 'district' | 'communal' | 'ODDLo';

// Interface pour les éléments de menu et sous-menus
interface MenuItem {
    title: string;
    icon: React.ElementType;
    url: string;
    minRole: Role;
    items: SubMenuItem[];
    iconColor?: string;
}

interface SubMenuItem {
    title: string;
    icon: React.ElementType;
    url: string;
    minRole: Role;
    iconColor?: string;
}

const menuItemVariants = {
    hidden: {
        opacity: 0,
        height: 0,
        y: -10,
        transition: {
            duration: 0.2,
            ease: "easeOut" as const
        }
    },
    visible: {
        opacity: 1,
        height: "auto",
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut" as const
        }
    }
}

const staggerChildren = {
    visible: {
        transition: {
            staggerChildren: 0.05
        }
    }
}

const childVariants = {
    hidden: {opacity: 0, x: -20},
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: [0.04, 0.62, 0.23, 0.98]
        }
    }
}

// Helper function to determine if a user can access certain content based on role hierarchy
const canAccess = (userRole: Role, requiredRole: Role): boolean => {
    const roleHierarchy: Record<Role, number> = {
        'administrateur': 6,
        'ODDLo': 5,
        'ODDL': 4,
        'regional': 3,
        'district': 2,
        'communal': 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Navigation data with role requirements and specific colors
export const navData: MenuItem[] = [
    {
        title: "Indicateur",
        icon: BarChart2,
        url: "#",
        minRole: 'communal',
        iconColor: "text-blue-500",
        items: [
            {
                title: "Communes",
                icon: Building2,
                url: "/dashboard/commune",
                minRole: 'communal',
                iconColor: "text-green-500"
            },
            {title: "Region", icon: Map, url: "/dashboard/region", minRole: 'regional', iconColor: "text-purple-500"},
            {
                title: "ODDL",
                icon: TrendingUp,
                url: "/dashboard/oddl",
                minRole: 'ODDL',
                iconColor: "text-orange-500"
            },
        ],
    },
    {
        title: "base de données",
        icon: Database,
        url: "#",
        minRole: 'communal',
        iconColor: "text-indigo-500",
        items: [
            {
                title: "commune",
                icon: MapPin,
                url: "/dashboard/dbcommune",
                minRole: 'communal',
                iconColor: "text-emerald-500"
            },
            {
                title: "listes",
                icon: Layers,
                url: "/dashboard/dbdistrict",
                minRole: 'district',
                iconColor: "text-cyan-500"
            },
            {
                title: "region",
                icon: Target,
                url: "/dashboard/dbregion",
                minRole: 'regional',
                iconColor: "text-violet-500"
            },
            {
                title: "ODDL Base",
                icon: PieChart,
                url: "/dashboard/dboddlo",
                minRole: 'ODDL',
                iconColor: "text-amber-500"
            },
            {
                title: "ODD 16",
                icon: Activity,
                url: "/dashboard/dboddseize",
                minRole: 'ODDL',
                iconColor: "text-rose-500"
            },
        ],
    },
    {
        title: "Administration",
        icon: Settings,
        url: "#",
        minRole: 'administrateur',
        iconColor: "text-red-500",
        items: [
            {
                title: "Utilisateurs",
                icon: Users,
                url: "/dashboard/users",
                minRole: 'administrateur',
                iconColor: "text-blue-600"
            },
            {
                title: "Rôles",
                icon: Shield,
                url: "/dashboard/role",
                minRole: 'administrateur',
                iconColor: "text-yellow-600"
            },
            {
                title: "Actualités",
                icon: FileText,
                url: "/dashboard/actualites",
                minRole: 'administrateur',
                iconColor: "text-green-600"
            },
            {
                title: "Galerie",
                icon: Camera,
                url: "/dashboard/galerie",
                minRole: 'administrateur',
                iconColor: "text-purple-600"
            },
            {
                title: "Directeur",
                icon: User,
                url: "/dashboard/directeur",
                minRole: 'administrateur',
                iconColor: "text-orange-600"
            },
            {
                title: "Messages",
                icon: Mail,
                url: "/dashboard/messages",
                minRole: 'administrateur',
                iconColor: "text-red-600"
            },
            {
                title: "document",
                icon: FolderOpen,
                url: "/dashboard/document",
                minRole: 'administrateur',
                iconColor: "text-red-600"
            },
        ],
    },
    // {
    //     title: "Site public",
    //     icon: Globe,
    //     url: "/login",
    //     minRole: 'communal',
    //     iconColor: "text-teal-500",
    //     items: [],
    // }
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const {user} = useAuth();
    const userRole = (user?.role as Role) || 'communal';
    const pathname = usePathname();

    // ✅ MENUS OUVERTS PAR DÉFAUT (Indicateur, base de données, Administration)
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
        "Indicateur": true,
        "base de données": true, // ✅ Corrigé le nom exact
        "Administration": true
    });

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // ✅ FONCTION CORRIGÉE - Navigation sans paramètre title
    const handleMenuItemClick = (e: React.MouseEvent, url: string, minRole: Role) => {
        if (!canAccess(userRole, minRole)) {
            e.preventDefault();
            alert("Accès restreint. Seul un utilisateur avec un rôle supérieur ou égal à " + minRole + " peut accéder à cette page.");
            return;
        }

        if (url !== "#") {
            e.preventDefault();
            router.push(url);
        }
    };

    // ✅ FONCTION POUR AFFICHER LE RÔLE OU LA LOCALISATION
    const getCurrentUserDisplay = () => {
        if (!user) return 'Non défini';

        // Pour administrateur et ODDL : afficher le rôle
        if (user.role === 'administrateur' || user.role === 'ODDL' || user.role === 'ODDLo') {
            return user.role;
        }

        // Pour les autres rôles : afficher la localisation
        if (user.location) {
            switch (user.role) {
                case 'regional':
                    return user.location.region || user.role;
                case 'district':
                    return user.location.district || user.role;
                case 'communal':
                    return user.location.commune || user.role;
                default:
                    return user.role;
            }
        }

        return user.role;
    };

    return (
        <Sidebar
            {...props}
            // CHANGEMENT 1: Ajout d'une classe pour permettre le scroll si nécessaire
            className="font-['Inter'] border-r border-border/5 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl flex flex-col"
        >
            <SidebarHeader
                className="border-b border-border/10 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm shrink-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard"
                               className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                                <div
                                    className="flex aspect-square size-12 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/20 group-hover:ring-primary/20 transition-all duration-300">
                                    <Image
                                        src="/assets/bb.png"
                                        alt="logo"
                                        width={32}
                                        height={32}
                                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span
                                        className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                                    e-Zaha
                                                </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* CHANGEMENT 2: SidebarContent avec scroll auto si nécessaire */}
            <SidebarContent className="px-2 py-4 flex-1 overflow-y-auto">
                <SidebarGroup>
                    <SidebarMenu>
                        {/* ✅ AFFICHAGE AMÉLIORÉ DU RÔLE/LOCALISATION */}
                        <div
                            className="mx-2 mb-6 p-3 rounded-lg bg-gradient-to-r from-accent/50 to-accent/30 border border-border/20 backdrop-blur-sm">
                            <div className="text-xs font-medium text-muted-foreground mb-1">
                                {user?.role === 'administrateur' || user?.role === 'ODDL' || user?.role === 'ODDLo'
                                    ? 'Rôle actuel'
                                    : 'Localisation'
                                }
                            </div>
                            <div className="text-sm font-semibold text-foreground/90">
                                {getCurrentUserDisplay()}
                            </div>
                        </div>

                        <motion.div
                            variants={staggerChildren}
                            initial="hidden"
                            animate="visible"
                            className="space-y-1"
                        >
                            {navData.map((item) => (
                                <motion.div
                                    key={item.title}
                                    variants={childVariants}
                                    className="group"
                                >
                                    <SidebarMenuItem>
                                        {item.items.length === 0 ? (
                                            <div
                                                className="w-full cursor-pointer"
                                                onClick={(e) => handleMenuItemClick(e, item.url, item.minRole)}
                                            >
                                                <SidebarMenuButton
                                                    className="hover:bg-gradient-to-r hover:from-accent/60 hover:to-accent/40 transition-all duration-300 w-full flex items-center gap-3 justify-between cursor-pointer rounded-lg border border-transparent hover:border-border/20 hover:shadow-sm backdrop-blur-sm group-hover:scale-[1.01]"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                                                            <item.icon
                                                                className={`size-4 ${item.iconColor || 'text-primary/70'} group-hover:brightness-110 transition-all duration-300`}/>
                                                        </div>
                                                        <span
                                                            className="font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-200">
                                                            {item.title}
                                                        </span>
                                                        {!canAccess(userRole, item.minRole) && (
                                                            <AlertTriangle className="size-3 text-amber-500/70"/>
                                                        )}
                                                    </div>
                                                </SidebarMenuButton>
                                            </div>
                                        ) : (
                                            <SidebarMenuButton
                                                onClick={() => toggleSection(item.title)}
                                                className="hover:bg-gradient-to-r hover:from-accent/60 hover:to-accent/40 transition-all duration-300 w-full flex items-center justify-between cursor-pointer rounded-lg border border-transparent hover:border-border/20 hover:shadow-sm backdrop-blur-sm group-hover:scale-[1.01]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                                                        <item.icon
                                                            className={`size-4 ${item.iconColor || 'text-primary/70'} group-hover:brightness-110 transition-all duration-300`}/>
                                                    </div>
                                                    <span
                                                        className="font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-200">
                                                        {item.title}
                                                    </span>
                                                    {!canAccess(userRole, item.minRole) && (
                                                        <AlertTriangle className="size-3 text-amber-500/70"/>
                                                    )}
                                                </div>
                                                {item.items && item.items.length > 0 && (
                                                    <ChevronRight
                                                        className={`size-4 text-muted-foreground transition-all duration-300 ${
                                                            openSections[item.title] ? 'rotate-90 text-primary/70' : 'group-hover:text-foreground/60'
                                                        }`}
                                                    />
                                                )}
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>

                                    <AnimatePresence initial={false}>
                                        {item.items.length > 0 && openSections[item.title] && (
                                            <motion.div
                                                variants={menuItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                className="overflow-hidden ml-4 mt-1"
                                            >
                                                <SidebarMenuSub className="border-l border-border/20 ml-4 pl-0">
                                                    {item.items.map((subItem, subIndex) => (
                                                        <motion.div
                                                            key={subItem.title}
                                                            initial={{opacity: 0, x: -10}}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                                transition: {
                                                                    delay: subIndex * 0.05,
                                                                    duration: 0.2
                                                                }
                                                            }}
                                                        >
                                                            <SidebarMenuSubItem>
                                                                <div
                                                                    className="w-full cursor-pointer group/sub"
                                                                    onClick={(e) => handleMenuItemClick(e, subItem.url, subItem.minRole)}
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        className={`transition-all duration-300 flex items-center justify-between cursor-pointer rounded-md border border-transparent hover:border-border/20 backdrop-blur-sm group-hover/sub:scale-[1.01]
                                                                            ${pathname === subItem.url
                                                                            ? 'bg-gradient-to-r from-primary/15 to-primary/10 border-primary/20 shadow-sm'
                                                                            : 'hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div
                                                                                className={`p-1 rounded-sm transition-all duration-300 ${
                                                                                    pathname === subItem.url
                                                                                        ? 'bg-primary/20'
                                                                                        : 'bg-accent/30 group-hover/sub:bg-accent/50'
                                                                                }`}>
                                                                                <subItem.icon
                                                                                    className={`size-3 transition-all duration-300 ${
                                                                                        pathname === subItem.url
                                                                                            ? subItem.iconColor || 'text-primary'
                                                                                            : subItem.iconColor || 'text-muted-foreground'
                                                                                    } group-hover/sub:brightness-110`}/>
                                                                            </div>
                                                                            <span
                                                                                className={`text-sm font-medium transition-colors duration-200 ${
                                                                                    pathname === subItem.url
                                                                                        ? 'text-foreground'
                                                                                        : 'text-foreground/70 group-hover/sub:text-foreground/90'
                                                                                }`}>
                                                                                {subItem.title}
                                                                            </span>
                                                                            {!canAccess(userRole, subItem.minRole) && (
                                                                                <AlertTriangle
                                                                                    className="size-3 text-amber-500/70"/>
                                                                            )}
                                                                        </div>
                                                                    </SidebarMenuSubButton>
                                                                </div>
                                                            </SidebarMenuSubItem>
                                                        </motion.div>
                                                    ))}
                                                </SidebarMenuSub>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail className="bg-gradient-to-b from-border/10 to-transparent"/>
        </Sidebar>
    )
}

export default AppSidebar;
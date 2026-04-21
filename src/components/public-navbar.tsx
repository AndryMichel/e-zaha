"use client"

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    BarChart3,
    Building,
    Calendar,
    ChevronDown,
    Clock,
    DollarSign,
    FileText,
    FolderOpen,
    Gavel,
    Globe,
    Home,
    Image as ImageIcon,
    Library,
    MessageCircle,
    Network,
    Newspaper,
    Phone,
    Scale,
    Target,
    User,
    Users
} from 'lucide-react';
import {cn} from "@/lib/utils";
import {usePathname} from 'next/navigation';
import MobileMenu from './MobileMenu';

const menuData = {
    navItems: [
        {
            title: "Accueil",
            url: "#", // Non-cliquable
            icon: Home,
            items: [
                [
                    {title: "Actualités", url: "/", icon: Newspaper}, // Nouveau sous-menu
                    {title: "Mot du Directeur", url: "/directeur", icon: User},
                    {title: "Historique", url: "/historique", icon: Clock},
                    {title: "Missions et Activités", url: "/mission", icon: Target},
                ],
                [
                    {title: "Cadre juridique", url: "/juridique", icon: Scale},
                    {title: "Organigramme", url: "/organigramme", icon: Network},
                    {title: "Partenaires", url: "/partenaires", icon: Users},
                ],
            ]
        },
        {
            title: "Indicateurs",
            url: "#", // Non-cliquable
            icon: BarChart3,
            items: [
                [
                    {title: "Gouvernance locale", url: "/igl", icon: Building},
                    {title: "Finance locale", url: "/finance", icon: DollarSign},
                ],
                [
                    {title: "Structure de concertation", url: "/structure", icon: MessageCircle},
                    {title: "Planification", url: "/planification", icon: Calendar},
                ],
            ]
        },
        {
            title: "ODD",
            url: "/odd",
            icon: Globe,
        },
        {
            title: "Ressources",
            url: "#", // Non-cliquable
            icon: FileText,
            items: [
                [
                    {title: "Documents", url: "/ressources", icon: Library}, // Ressources cliquable dans le sous-menu
                    {title: "Textes et Lois", url: "/textes", icon: Gavel},
                    {title: "Document de travail", url: "/document", icon: FolderOpen},
                ],
            ]
        },
        {
            title: "Galérie",
            url: "/galerie",
            icon: ImageIcon,
        },
        {
            title: "Contact",
            url: "/contact",
            icon: Phone
        }
    ]
};

export function PublicNavbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [hideTopNav, setHideTopNav] = useState(false);

    // Fonction de throttling optimisée avec useCallback et types spécifiques
    const throttle = useCallback(<T extends unknown[]>(
        func: (...args: T) => void,
        delay: number
    ) => {
        let timeoutId: NodeJS.Timeout | null = null;
        let lastExecTime = 0;

        return (...args: T) => {
            const currentTime = Date.now();

            if (currentTime - lastExecTime > delay) {
                func(...args);
                lastExecTime = currentTime;
            } else {
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func(...args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }, []);

    // Gestionnaire de scroll optimisé
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Utilisation de requestAnimationFrame pour les animations fluides
        requestAnimationFrame(() => {
            // État scrolled pour les effets visuels
            setScrolled(currentScrollY > 20);

            // Logique de masquage/affichage simplifiée et plus réactive
            setHideTopNav(currentScrollY > 120);
        });
    }, []);

    // Throttled scroll handler
    const throttledHandleScroll = useMemo(
        () => throttle(handleScroll, 10), // Réduction du délai pour plus de fluidité
        [throttle, handleScroll]
    );

    useEffect(() => {
        // Ajout de l'event listener avec options optimisées
        window.addEventListener('scroll', throttledHandleScroll, {
            passive: true, // Améliore les performances
            capture: false
        });

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [throttledHandleScroll]);

    // Fonction isActive mémorisée pour éviter les recalculs
    const isActive = useCallback((url: string) => {
        if (url === "/" && pathname === "/") return true;
        if (url !== "/" && pathname.startsWith(url)) return true;
        return false;
    }, [pathname]);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50",
            // Transitions CSS optimisées avec GPU acceleration
            "transform-gpu will-change-transform",
            scrolled ? "shadow-2xl backdrop-blur-xl" : ""
        )}>
            {/* Top Navbar - Animation optimisée */}
            <div
                className={cn(
                    "bg-gradient-to-r from-white via-slate-50 to-white border-b border-gray-100/50",
                    "transform-gpu will-change-transform transition-all duration-300 ease-out",
                    "overflow-hidden"
                )}
                style={{
                    height: hideTopNav ? '0px' : '128px', // 128px = h-32
                    opacity: hideTopNav ? 0 : 1,
                    transform: hideTopNav ? 'translateY(-10px)' : 'translateY(0px)',
                }}
            >
                {/* Background pattern optimisé */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10"/>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex justify-between items-center h-32">
                        {/* Left Logo Section */}
                        <div className="flex items-center space-x-6 group">
                            <div className="relative transform transition-transform duration-200 hover:scale-105">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                                <Image
                                    src="/assets/mdat.jpeg"
                                    alt="MDAT Logo"
                                    width={110}
                                    height={120}
                                    className="object-contain rounded-xl shadow-lg relative z-10 border border-white/20"
                                    priority // Optimisation du chargement
                                />
                            </div>
                        </div>

                        {/* Center Logo */}
                        <div className="hidden md:flex flex-col items-center -mt-8 group">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-white to-purple-500/5 rounded-full blur-md group-hover:blur-lg transition-all duration-200"/>
                                <Image
                                    src="/assets/mada.jpeg"
                                    alt="Madagascar Logo"
                                    width={140}
                                    height={150}
                                    className="object-contain rounded-2xl shadow-2xl relative z-10 transform transition-transform duration-200 hover:scale-105 border-2 border-white/30"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex items-center space-x-4 group">
                                <div className="relative transform transition-transform duration-200 hover:scale-105">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                                    <Image
                                        src="/assets/oddl.jpeg"
                                        alt="ODDL Logo"
                                        width={85}
                                        height={85}
                                        className="object-contain rounded-xl shadow-lg relative z-10 border border-white/20"
                                        priority
                                    />
                                </div>
                            </div>
                            <MobileMenu menuData={menuData} isActive={isActive}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation - Animation optimisée */}
            <div className={cn(
                "hidden lg:block",
                "bg-white/80 backdrop-blur-xl border-b border-gray-200/50",
                "transform-gpu will-change-transform transition-all duration-200 ease-out",
                scrolled ? "py-2 shadow-lg" : "py-4",
                hideTopNav ? "border-t border-gray-200/50 shadow-xl bg-white/90" : ""
            )}>
                {/* Gradient overlay simplifié */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent opacity-50"/>

                <div className="container mx-auto px-6 relative z-10">
                    <nav className="flex justify-center">
                        <ul className="flex space-x-2">
                            {menuData.navItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <li key={item.title} className="relative group">
                                        {/* Condition pour rendre cliquable ou non */}
                                        {item.url === "#" ? (
                                            // Non-cliquable - juste pour afficher le sous-menu
                                            <div
                                                className={cn(
                                                    "relative block px-6 py-3 font-medium text-sm tracking-wide cursor-pointer",
                                                    "transition-all duration-150 flex items-center rounded-xl",
                                                    "transform-gpu will-change-transform",
                                                    "text-gray-700 hover:scale-105"
                                                )}
                                            >
                                                <IconComponent className="w-4 h-4 mr-2"/>
                                                <span className="relative z-10">{item.title}</span>

                                                {item.items && (
                                                    <ChevronDown
                                                        className="ml-2 h-4 w-4 transition-transform duration-150 group-hover:rotate-180"/>
                                                )}

                                                {/* Hover effect optimisé */}
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"/>
                                            </div>
                                        ) : (
                                            // Cliquable - lien normal
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "relative block px-6 py-3 font-medium text-sm tracking-wide",
                                                    "transition-all duration-150 flex items-center rounded-xl",
                                                    "transform-gpu will-change-transform",
                                                    isActive(item.url)
                                                        ? "text-blue-700 bg-blue-50/80 shadow-md"
                                                        : "text-gray-700 hover:scale-105"
                                                )}
                                            >
                                                {/* Active indicator optimisé */}
                                                {isActive(item.url) && (
                                                    <div
                                                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"/>
                                                )}

                                                <IconComponent className="w-4 h-4 mr-2"/>
                                                <span className="relative z-10">{item.title}</span>

                                                {item.items && (
                                                    <ChevronDown
                                                        className="ml-2 h-4 w-4 transition-transform duration-150 group-hover:rotate-180"/>
                                                )}

                                                {/* Hover effect optimisé */}
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"/>
                                            </Link>
                                        )}

                                        {/* Dropdown Menu optimisé */}
                                        {item.items && (
                                            <div className={cn(
                                                "absolute top-full left-1/2 transform -translate-x-1/2 mt-2",
                                                "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                                                "transition-all duration-200 ease-out",
                                                "group-hover:translate-y-0 translate-y-1",
                                                "transform-gpu will-change-transform"
                                            )}>
                                                <div
                                                    className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-8 grid grid-cols-2 gap-8 min-w-max border border-gray-200/50">
                                                    {/* Border animé simplifié */}
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl opacity-50"/>

                                                    {item.items.map((column, idx) => (
                                                        <div key={idx} className="space-y-4 relative z-10">
                                                            {column.map((subItem) => {
                                                                const SubIconComponent = subItem.icon;
                                                                return (
                                                                    <Link
                                                                        key={subItem.title}
                                                                        href={subItem.url}
                                                                        className={cn(
                                                                            "block transition-all duration-150 px-4 py-3 rounded-xl text-sm font-medium",
                                                                            "transform-gpu will-change-transform",
                                                                            isActive(subItem.url)
                                                                                ? "text-blue-700 bg-blue-50/80 shadow-sm scale-105"
                                                                                : "text-gray-600 hover:scale-105"
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center space-x-3">
                                                                            <SubIconComponent
                                                                                className="w-4 h-4 text-blue-500"/>
                                                                            <span>{subItem.title}</span>
                                                                        </div>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
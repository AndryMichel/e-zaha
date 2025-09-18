"use client"

import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ChevronDown, Menu, X} from 'lucide-react';
import {cn} from "@/lib/utils";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/organismes/sheet";


interface MobileMenuProps {
    menuData: {
        navItems: {
            title: string;
            url: string;
            icon: React.ComponentType<{ className?: string }>;
            items?: {
                title: string;
                url: string;
                icon: React.ComponentType<{ className?: string }>;
            }[][];
        }[];
    };
    isActive: (url: string) => boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({menuData, isActive}) => {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleItem = (title: string) => {
        setOpenItems(prev =>
            prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]
        );
    };

    return (
        <>
            {/* Overlay avec blur quand le menu est ouvert */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <button
                        className="lg:hidden text-black p-2 focus:outline-none hover:bg-gray-100/50 rounded-lg transition-colors duration-200">
                        <Menu className="h-6 w-6"/>
                    </button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    className="w-[85vw] max-w-sm p-0 shadow-2xl border-r border-gray-200/50 z-50 [&>button]:hidden"
                    style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <SheetHeader className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 shadow-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <Image
                                        src="/assets/mdat.jpeg"
                                        alt="MDAT Logo"
                                        width={45}
                                        height={45}
                                        className="object-contain rounded-lg shadow-md"
                                    />
                                    <div className="absolute inset-0 rounded-lg bg-white/10"></div>
                                </div>
                                <SheetTitle className="text-white font-semibold text-lg tracking-wide">
                                    MDAT
                                </SheetTitle>
                            </div>
                            <SheetClose asChild>
                                <button
                                    className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
                                    <X className="h-5 w-5"/>
                                </button>
                            </SheetClose>
                        </div>
                    </SheetHeader>

                    <div
                        className="p-6 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {menuData.navItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={item.title} className="mb-2">
                                    {item.items ? (
                                        // Pour les éléments avec sous-menus
                                        <div className="group">
                                            <button
                                                onClick={() => toggleItem(item.title)}
                                                className={cn(
                                                    "w-full py-3 px-4 font-medium text-left flex items-center justify-between rounded-xl transition-all duration-300 hover:bg-blue-50/80 hover:scale-105",
                                                    isActive(item.url)
                                                        ? "text-blue-700 bg-blue-50/80 shadow-sm"
                                                        : "text-gray-800"
                                                )}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <IconComponent className="w-5 h-5"/>
                                                    <span className="flex-grow">{item.title}</span>
                                                </div>
                                                <ChevronDown className={cn(
                                                    "h-4 w-4 transition-transform duration-300 text-gray-500",
                                                    openItems.includes(item.title) && "transform rotate-180 text-blue-600"
                                                )}/>
                                            </button>
                                        </div>
                                    ) : (
                                        // Pour les éléments sans sous-menus
                                        <SheetClose asChild>
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "block py-3 px-4 font-medium rounded-xl transition-all duration-300 hover:bg-blue-50/80 hover:scale-105",
                                                    isActive(item.url)
                                                        ? "text-blue-700 bg-blue-50/80 shadow-sm"
                                                        : "text-gray-800"
                                                )}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <IconComponent className="w-5 h-5"/>
                                                    <span>{item.title}</span>
                                                </div>
                                            </Link>
                                        </SheetClose>
                                    )}

                                    {item.items && openItems.includes(item.title) && (
                                        <div
                                            className="ml-4 mt-2 space-y-1 bg-gray-50/50 rounded-xl p-3 border border-gray-100/50">
                                            {item.items.flat().map((subItem) => {
                                                const SubIconComponent = subItem.icon;
                                                return (
                                                    <SheetClose key={subItem.title} asChild>
                                                        <Link
                                                            href={subItem.url}
                                                            className={cn(
                                                                "block py-2 px-3 text-sm rounded-lg transition-all duration-200 hover:bg-white/80 hover:scale-105",
                                                                isActive(subItem.url)
                                                                    ? "text-blue-700 font-medium bg-white/80 shadow-sm"
                                                                    : "text-gray-600"
                                                            )}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <SubIconComponent className="w-4 h-4"/>
                                                                <span>{subItem.title}</span>
                                                            </div>
                                                        </Link>
                                                    </SheetClose>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Séparateur plus élégant */}
                                    {index < menuData.navItems.length - 1 && (
                                        <div
                                            className="my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer du menu avec effet décoratif */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50/80 to-transparent pointer-events-none"></div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default MobileMenu;
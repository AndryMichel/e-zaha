import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import Image from "next/image";

interface PageHeaderMenuProps {
    title: string;
    subtitle?: string;
}

const PageHeaderMenu: React.FC<PageHeaderMenuProps> = ({title, subtitle}) => {
    const backgroundImage = "/assets/aceuiloddl.png";

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white relative pt-36">
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src={backgroundImage}
                    alt={`${title} Background`}
                    fill
                    className="object-cover opacity-20"
                />

            </div>
            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <motion.div
                    initial={{opacity: 0, y: -30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    className="text-center"
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default PageHeaderMenu;
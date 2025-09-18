import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import Image from "next/image";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backgroundFrom?: string;
    backgroundTo?: string;
    textColor?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          backgroundFrom = 'from-gray-100',
                                                          backgroundTo = 'to-gray-300',
                                                          textColor = 'text-gray-900',
                                                      }) => {
    const backgroundImage = "/assets/aceuiloddl.png";

    return (
        <section
            className={`relative h-[300px] flex flex-col items-center justify-center bg-gradient-to-r pt-36 ${backgroundFrom} ${backgroundTo} ${textColor} text-center p-6`}
        >
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src={backgroundImage}
                    alt={`${title} Background`}
                    fill
                    className="object-cover opacity-20"
                />

            </div>
            <motion.h1
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                className="text-5xl font-bold drop-shadow-lg"
            >
                {title}
            </motion.h1>
            <motion.p
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                className="mt-4 text-xl text-gray-700 max-w-2xl"
            >
                {subtitle}
            </motion.p>
        </section>
    );
};

export default PageHeader;
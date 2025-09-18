import React from 'react';
import {motion} from '@/components/ui/templates/motion';

interface SectionHeaderProps {
    title: string;
    description?: string;
    alignment?: 'left' | 'center' | 'right';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
                                                                title,
                                                                description,
                                                                alignment = 'center'
                                                            }) => {
    const alignmentClasses = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    };

    return (
        <div className={`${alignmentClasses[alignment]} mb-12`}>
            <motion.h2
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                className="text-4xl font-bold text-gray-900 mb-4"
            >
                {title}
            </motion.h2>
            {description && (
                <motion.p
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                    className="text-lg text-gray-700 max-w-3xl mx-auto"
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeader;
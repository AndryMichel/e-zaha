import React from 'react';
import {motion} from '@/components/ui/templates/motion';

interface Category {
    id: string;
    name: string;
}

interface CategoryFilterProps {
    categories: Category[];
    activeFilter: string;
    onFilterChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
                                                                  categories,
                                                                  activeFilter,
                                                                  onFilterChange
                                                              }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => onFilterChange(category.id)}
                    className={`px-6 py-2 rounded-full text-lg transition-colors ${
                        activeFilter === category.id
                            ? 'bg-gray-800 text-white'
                            : 'bg-white text-gray-800 hover:bg-gray-200'
                    }`}
                >
                    {category.name}
                </motion.button>
            ))}
        </div>
    );
};

export default CategoryFilter;
import React from 'react';
import {motion} from '@/components/ui/templates/motion';
import {ArrowLeft, ArrowRight, X} from 'lucide-react';
import {Button} from '@/components/ui/atomes/button';
import Image from 'next/image';

interface ImageItem {
    id: number;
    image: string;
    category: string;
    date: string;
}

interface ImageModalProps {
    selectedImage: ImageItem;
    images: ImageItem[];
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
                                                          selectedImage,
                                                          onClose,
                                                          onPrev,
                                                          onNext
                                                      }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
                <motion.div
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    className="bg-white rounded-lg overflow-hidden"
                >
                    <div className="relative h-[70vh]">
                        <Image
                            src={selectedImage.image}
                            alt={`Image de galerie - ${selectedImage.category}`}
                            fill
                            className="object-contain"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10"
                        >
                            <X className="h-6 w-6"/>
                        </button>
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">Galerie - {selectedImage.category}</h2>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500"> {selectedImage.date}</span>
                            <span
                                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              </span>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation buttons */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-16 hidden md:block">
                    <Button
                        variant="outline"
                        className="rounded-full p-3 bg-white"
                        onClick={onPrev}
                    >
                        <ArrowLeft className="h-6 w-6"/>
                    </Button>
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-16 hidden md:block">
                    <Button
                        variant="outline"
                        className="rounded-full p-3 bg-white"
                        onClick={onNext}
                    >
                        <ArrowRight className="h-6 w-6"/>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
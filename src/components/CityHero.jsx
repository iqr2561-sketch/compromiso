import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useNews } from '../context/NewsContext';

const CityHero = () => {
    const { cityHeroImages } = useNews();

    // Fallback if no images are loaded yet
    const displayImages = cityHeroImages.length > 0
        ? cityHeroImages.map(img => img.url)
        : ['/dolores-panoramic.png'];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Only set interval if > 1 image
    useEffect(() => {
        if (displayImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    return (
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[400px] md:h-[500px] -mt-6 mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={displayImages[currentIndex]}
                        alt="Dolores Panoramic"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-background-dark"></div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-center pb-20 md:pb-24">
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl text-center">
                    Dolores <span className="text-primary">Hoy</span>
                </h1>
            </div>
        </div>
    );
};

export default CityHero;

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SingleImageViewProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const cursorLeft = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><polygon points="14,8 8,12 14,16" fill="black" stroke="white" stroke-width="1"/></svg>') 16 16, w-resize`;
const cursorRight = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><polygon points="10,8 16,12 10,16" fill="black" stroke="white" stroke-width="1"/></svg>') 16 16, e-resize`;
const cursorUp = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><polygon points="8,14 12,8 16,14" fill="black" stroke="white" stroke-width="1"/></svg>') 16 16, n-resize`;

export function SingleImageView({ images, initialIndex, onClose }: SingleImageViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent scrolling behind lightbox
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, handleNext, handlePrev]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-white flex flex-col"
      >
        <div className="relative flex-1 w-full h-full flex items-center justify-center p-4 md:p-12 select-none">
          {/* Main Image */}
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain pointer-events-none"
          />

          {/* Navigation Zones */}
          <div 
            className="absolute top-0 left-0 right-0 h-[15%] z-10" 
            style={{ cursor: cursorUp }} 
            onClick={onClose} 
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-[15%] z-10" 
            style={{ cursor: cursorUp }} 
            onClick={onClose} 
          />
          <div 
            className="absolute top-[15%] bottom-[15%] left-0 w-1/2 z-10" 
            style={{ cursor: cursorLeft }} 
            onClick={handlePrev} 
          />
          <div 
            className="absolute top-[15%] bottom-[15%] right-0 w-1/2 z-10" 
            style={{ cursor: cursorRight }} 
            onClick={handleNext} 
          />
        </div>

        {/* Bottom UI Controls */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex flex-col items-end gap-2 text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium">
          <div className="flex gap-4">
            <button onClick={handlePrev} className="hover:text-black transition-colors">PREV</button>
            <span>/</span>
            <button onClick={handleNext} className="hover:text-black transition-colors">NEXT</button>
          </div>
          <button onClick={onClose} className="hover:text-black transition-colors mt-2">
            SHOW THUMBNAILS
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

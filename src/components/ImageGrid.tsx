"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SingleImageView } from "./SingleImageView";
import { SkeletonImage } from "./SkeletonImage";

interface ImageGridProps {
  images: string[];
}

export function ImageGrid({ images }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-400 py-12 text-sm tracking-widest uppercase">No images found.</div>;
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-8 space-y-4 md:space-y-8">
        {images.map((src, i) => (
          <motion.div 
            key={src} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="break-inside-avoid relative group cursor-pointer"
            onClick={() => setSelectedIndex(i)}
          >
            <SkeletonImage 
              src={src} 
              alt={`Gallery image ${i + 1}`} 
              wrapperClassName="block"
              className="group-hover:opacity-90"
            />
          </motion.div>
        ))}
      </div>

      {selectedIndex !== null && (
        <SingleImageView 
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}

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
      <div className="columns-1 gap-x-[22px] sm:columns-2 md:columns-3 lg:columns-4">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative cursor-pointer break-inside-avoid mb-[34px]"
            onClick={() => setSelectedIndex(i)}
          >
            <SkeletonImage
              src={src}
              alt={`Gallery image ${i + 1}`}
              wrapperClassName="min-h-0"
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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SingleImageView } from "./SingleImageView";
import { SkeletonImage } from "./SkeletonImage";
import type { PortfolioImage } from "@/lib/images";

interface ImageGridProps {
  images: PortfolioImage[];
}

export function ImageGrid({ images }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-400 py-12 text-sm tracking-widest uppercase">No images found.</div>;
  }

  return (
    <>
      <div className="columns-1 gap-x-[22px] sm:columns-2 md:columns-3 lg:columns-4">
        {images.map((image, i) => (
          <motion.button
            type="button"
            key={image.relativePath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative mb-[34px] block w-full cursor-pointer break-inside-avoid appearance-none border-0 bg-transparent p-0 text-left"
            onClick={() => setSelectedIndex(i)}
            aria-label={`Open gallery image ${i + 1}`}
          >
            <SkeletonImage
              image={image}
              alt={`Gallery image ${i + 1}`}
              wrapperClassName="min-h-0"
              className="group-hover:opacity-90"
              eager={i < 4}
            />
          </motion.button>
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

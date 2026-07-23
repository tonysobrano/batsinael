"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SkeletonImage } from "./SkeletonImage";
import type { PortfolioImage } from "@/lib/images";

const SingleImageView = dynamic(
  () => import("./SingleImageView").then((module) => module.SingleImageView),
  { ssr: false },
);

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
          <button
            type="button"
            key={image.relativePath}
            className="gallery-item-enter group relative mb-[34px] block w-full cursor-pointer break-inside-avoid appearance-none border-0 bg-transparent p-0 text-left"
            style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            onClick={() => setSelectedIndex(i)}
            aria-label={`Open gallery image ${i + 1}`}
          >
            <SkeletonImage
              image={image}
              alt={`Gallery image ${i + 1}`}
              wrapperClassName="min-h-0"
              className="group-hover:opacity-90"
              eager={i < 2}
            />
          </button>
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

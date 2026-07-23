"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import type { PortfolioImage } from "@/lib/images";

interface SkeletonImageProps {
  image: PortfolioImage;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  eager?: boolean;
  quality?: 90 | 92;
  sizes?: string;
}

const gridSizes =
  "(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc(50vw - 35px), (max-width: 1023px) calc((100vw - 276px) / 3), calc((100vw - 298px) / 4)";

export function SkeletonImage({
  image,
  alt,
  className,
  wrapperClassName,
  eager = false,
  quality = 90,
  sizes = gridSizes,
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden bg-gray-100",
        !isLoaded && "animate-pulse min-h-[100px]",
        wrapperClassName
      )}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image
        src={image.url}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        quality={quality}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className={clsx(
          "w-full h-auto block transition-all duration-700",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
}

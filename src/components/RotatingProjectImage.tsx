import Image from "next/image";
import type { CSSProperties } from "react";
import type { PortfolioImage } from "@/lib/images";

interface RotatingProjectImageProps {
  images: PortfolioImage[];
  name: string;
  preload?: boolean;
  seed: string;
  sizes: string;
}

function rotationDelay(seed: string): number {
  let hash = 0;

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return 700 + (hash % 1400);
}

export function RotatingProjectImage({
  images,
  name,
  preload = false,
  seed,
  sizes,
}: RotatingProjectImageProps) {
  const slides = images.slice(0, 3);
  const rotationStyle = {
    "--rotation-delay": `${rotationDelay(seed)}ms`,
  } as CSSProperties;

  return (
    <div className="rotating-project-image" style={rotationStyle}>
      {slides.map((image, imageIndex) => (
        <Image
          key={image.relativePath}
          src={image.url}
          alt={imageIndex === 0 ? name : ""}
          fill
          quality={75}
          preload={preload && imageIndex === 0}
          sizes={sizes}
          className="rotating-project-image__slide object-cover"
        />
      ))}
    </div>
  );
}

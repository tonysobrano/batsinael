"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PortfolioImage } from "@/lib/images";

interface RotatingProjectImageProps {
  images: PortfolioImage[];
  mobile?: boolean;
  name: string;
  preload?: boolean;
  sizes: string;
}

export function RotatingProjectImage({
  images,
  mobile = false,
  name,
  preload = false,
  sizes,
}: RotatingProjectImageProps) {
  const slides = images.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const viewportQuery = window.matchMedia("(max-width: 767px)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let rotationTimer: number | undefined;

    const syncRotation = () => {
      window.clearInterval(rotationTimer);
      rotationTimer = undefined;
      setActiveIndex(0);

      const isVisibleLayout = mobile
        ? viewportQuery.matches
        : !viewportQuery.matches;

      if (!isVisibleLayout || reducedMotionQuery.matches) {
        return;
      }

      rotationTimer = window.setInterval(() => {
        setActiveIndex((value) => (value + 1) % slides.length);
      }, 3000);
    };

    syncRotation();
    viewportQuery.addEventListener("change", syncRotation);
    reducedMotionQuery.addEventListener("change", syncRotation);

    return () => {
      window.clearInterval(rotationTimer);
      viewportQuery.removeEventListener("change", syncRotation);
      reducedMotionQuery.removeEventListener("change", syncRotation);
    };
  }, [mobile, slides.length]);

  return (
    <div className="rotating-project-image">
      {slides.map((image, imageIndex) => (
        <Image
          key={image.relativePath}
          src={image.url}
          alt={imageIndex === 0 ? name : ""}
          width={image.width}
          height={image.height}
          quality={90}
          preload={preload && imageIndex === 0}
          sizes={sizes}
          className={`rotating-project-image__slide${
            imageIndex === activeIndex ? " is-active" : ""
          }`}
        />
      ))}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { PortfolioImage } from "@/lib/images";

function pickRandomIndex(current: number, length: number): number {
  if (length <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

interface ProjectGridImageProps {
  images: PortfolioImage[];
  alt: string;
  eager?: boolean;
  autoRotate?: boolean;
}

export function ProjectGridImage({
  images,
  alt,
  eager,
  autoRotate,
}: ProjectGridImageProps) {
  const [activeLayer, setActiveLayer] = useState<"a" | "b">("a");
  const [layerAIndex, setLayerAIndex] = useState(0);
  const [layerBIndex, setLayerBIndex] = useState<number | null>(null);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isInViewRef = useRef(false);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);
  const pendingLayerRef = useRef<{ layer: "a" | "b"; index: number } | null>(null);

  const hasMultiple = images.length > 1;

  const handleLayerLoaded = useCallback((layer: "a" | "b", index: number) => {
    if (index === 0) {
      setCoverLoaded(true);
    }

    const pending = pendingLayerRef.current;
    if (pending?.layer === layer && pending.index === index) {
      pendingLayerRef.current = null;
      setActiveLayer(layer);
    }
  }, []);

  const swapTo = useCallback(
    (nextIndex: number | ((prev: number) => number)) => {
      const resolvedIndex =
        typeof nextIndex === "function" ? nextIndex(currentIndexRef.current) : nextIndex;

      if (resolvedIndex === currentIndexRef.current) return;

      currentIndexRef.current = resolvedIndex;
      if (activeLayer === "a") {
        pendingLayerRef.current = { layer: "b", index: resolvedIndex };
        setLayerBIndex(resolvedIndex);
      } else {
        pendingLayerRef.current = { layer: "a", index: resolvedIndex };
        setLayerAIndex(resolvedIndex);
      }
    },
    [activeLayer]
  );

  const advance = useCallback(() => {
    if (!hasMultiple) return;
    swapTo((prev) => pickRandomIndex(prev, images.length));
  }, [hasMultiple, images.length, swapTo]);

  const clearAutoRotate = useCallback(() => {
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }
  }, []);

  const scheduleAutoRotate = useCallback(function scheduleNextRotation() {
    clearAutoRotate();
    if (!autoRotate || !hasMultiple || isHoveredRef.current || !isInViewRef.current) {
      return;
    }

    const delay = 4500 + Math.random() * 5500;
    autoTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current && isInViewRef.current) {
        advance();
      }
      scheduleNextRotation();
    }, delay);
  }, [advance, autoRotate, clearAutoRotate, hasMultiple]);

  useEffect(() => {
    if (!autoRotate || !hasMultiple) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          scheduleAutoRotate();
        } else {
          clearAutoRotate();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearAutoRotate();
    };
  }, [autoRotate, clearAutoRotate, hasMultiple, scheduleAutoRotate]);

  useEffect(() => {
    return () => {
      clearAutoRotate();
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
      }
    };
  }, [clearAutoRotate]);

  const handleMouseEnter = () => {
    if (!hasMultiple) return;
    isHoveredRef.current = true;
    clearAutoRotate();
    advance();
    hoverIntervalRef.current = setInterval(advance, 1600);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
    swapTo(0);
    scheduleAutoRotate();
  };

  const layerClass = (layer: "a" | "b") =>
    clsx(
      "object-cover transition-opacity duration-500 ease-out",
      activeLayer === layer && coverLoaded ? "opacity-100 z-10" : "opacity-0 z-0"
    );

  const gridSizes =
    "(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc(50vw - 35px), (max-width: 1023px) calc((100vw - 276px) / 3), calc((100vw - 298px) / 4)";

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative w-full overflow-hidden bg-gray-100 mb-[10px]",
        !coverLoaded && "animate-pulse min-h-[100px]"
      )}
      style={{ aspectRatio: `${images[0].width} / ${images[0].height}` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.015]">
        <Image
          src={images[layerAIndex].url}
          alt={activeLayer === "a" ? alt : ""}
          aria-hidden={activeLayer !== "a"}
          fill
          sizes={gridSizes}
          quality={90}
          loading={eager && layerAIndex === 0 ? "eager" : "lazy"}
          fetchPriority={eager && layerAIndex === 0 ? "high" : "auto"}
          onLoad={() => handleLayerLoaded("a", layerAIndex)}
          className={layerClass("a")}
        />
        {layerBIndex !== null && (
          <Image
            src={images[layerBIndex].url}
            alt={activeLayer === "b" ? alt : ""}
            aria-hidden={activeLayer !== "b"}
            fill
            sizes={gridSizes}
            quality={90}
            loading="lazy"
            onLoad={() => handleLayerLoaded("b", layerBIndex)}
            className={layerClass("b")}
          />
        )}
      </div>
    </div>
  );
}

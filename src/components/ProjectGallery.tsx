"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PortfolioImage } from "@/lib/images";

interface ProjectGalleryProps {
  name: string;
  images: PortfolioImage[];
  backPath: string;
}

export function ProjectGallery({
  name,
  images,
  backPath,
}: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const step = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
      ? 1
      : 2;

  const next = useCallback(() => {
    setIndex((value) => (value + step()) % images.length);
  }, [images.length]);

  const previous = useCallback(() => {
    setIndex((value) => (value - step() + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        previous();
      } else if (event.key === "Escape" && overview) {
        setOverview(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, overview, previous]);

  const current = images[index];
  const secondary = images[(index + 1) % images.length];
  const desktopEnd = Math.min(index + 2, images.length);

  if (!current) {
    return null;
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 40) return;
    if (distance > 0) {
      previous();
    } else {
      next();
    }
  };

  return (
    <section
      className="project-gallery"
      aria-label={`${name} gallery`}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
    >
      <header className="project-gallery-header">
        <Link href="/" className="project-gallery-brand">
          Batsinael
        </Link>
        <p className="project-gallery-name">{name}</p>
        <button
          type="button"
          className="project-gallery-overview"
          onClick={() => setOverview((value) => !value)}
          aria-expanded={overview}
        >
          {overview ? "GALLERY" : "OVERVIEW"}
        </button>
        <p className="project-gallery-counter">
          <span className="desktop-only">
            {index + 1}-{desktopEnd} | {images.length}
          </span>
          <span className="mobile-only">
            {index + 1} | {images.length}
          </span>
        </p>
        <Link href={backPath} className="project-gallery-close">
          <span className="desktop-only">[ Close ]</span>
          <span className="mobile-only">Back</span>
        </Link>
      </header>

      {overview ? (
        <div className="project-overview-grid" aria-label="Project overview">
          {images.map((image, imageIndex) => (
            <button
              type="button"
              key={image.relativePath}
              onClick={() => {
                setIndex(imageIndex);
                setOverview(false);
              }}
              aria-label={`Open image ${imageIndex + 1}`}
            >
              <Image
                src={image.url}
                alt=""
                width={image.width}
                height={image.height}
                sizes="(max-width: 767px) calc(50vw - 23px), 24vw"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="project-gallery-stage">
          <div
            key={`primary-${current.relativePath}`}
            className="project-gallery-image project-gallery-image--primary"
          >
            <Image
              src={current.url}
              alt={`${name}, image ${index + 1}`}
              width={current.width}
              height={current.height}
              loading="eager"
              fetchPriority="high"
              quality={90}
              sizes="(max-width: 767px) calc(100vw - 30px), 28vw"
            />
          </div>
          {images.length > 1 && (
            <div
              key={`secondary-${secondary.relativePath}`}
              className="project-gallery-image project-gallery-image--secondary"
            >
              <Image
                src={secondary.url}
                alt={`${name}, image ${(index + 1) % images.length + 1}`}
                width={secondary.width}
                height={secondary.height}
                loading="eager"
                quality={90}
                sizes="28vw"
              />
            </div>
          )}
          <button
            type="button"
            className="project-gallery-zone project-gallery-zone--previous"
            onClick={previous}
            aria-label="Previous image"
          />
          <button
            type="button"
            className="project-gallery-zone project-gallery-zone--next"
            onClick={next}
            aria-label="Next image"
          />
        </div>
      )}
    </section>
  );
}

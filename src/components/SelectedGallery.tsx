"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SelectedGalleryItem } from "@/lib/images";

interface SelectedGalleryProps {
  items: SelectedGalleryItem[];
}

type IntroPhase = "visible" | "exiting" | "hidden";

export function SelectedGallery({ items }: SelectedGalleryProps) {
  const [index, setIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("visible");
  const touchStartX = useRef<number | null>(null);
  const current = items[index];

  const next = useCallback(() => {
    setImageIndex(0);
    setIndex((value) => (value + 1) % items.length);
  }, [items.length]);

  const previous = useCallback(() => {
    setImageIndex(0);
    setIndex((value) => (value - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = document.documentElement;
    root.classList.add("is-preloading");

    const exitTimer = window.setTimeout(
      () => setIntroPhase("exiting"),
      reduceMotion ? 20 : 1650,
    );
    const completeTimer = window.setTimeout(
      () => {
        setIntroPhase("hidden");
        root.classList.remove("is-preloading");
      },
      reduceMotion ? 80 : 2370,
    );

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
      root.classList.remove("is-preloading");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        previous();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, previous]);

  const selectedImages = current?.images.slice(0, 3) ?? [];

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || introPhase !== "hidden" || selectedImages.length < 2) {
      return;
    }

    const rotationTimer = window.setInterval(() => {
      setImageIndex((value) => (value + 1) % selectedImages.length);
    }, 3200);

    return () => window.clearInterval(rotationTimer);
  }, [current?.path, introPhase, selectedImages.length]);

  if (!current) {
    return null;
  }

  const selectedImage = selectedImages[imageIndex] ?? selectedImages[0];

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
      className="selected-gallery"
      aria-label="Selected photography"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
    >
      <div className="selected-desktop-meta" aria-live="polite">
        <p>
          <strong>{current.name}</strong>
          <span>{current.category}</span>
        </p>
        <p className="selected-counter">
          {index + 1} <span>|</span> {items.length}
        </p>
      </div>

      <div className="selected-media">
        {selectedImage ? (
          <div
            key={selectedImage.relativePath}
            className="selected-media-frame"
          >
            <Image
              src={selectedImage.url}
              alt={current.name}
              width={selectedImage.width}
              height={selectedImage.height}
              preload={index === 0 && imageIndex === 0}
              quality={90}
              sizes="(max-width: 767px) calc(100vw - 30px), 64vw"
            />
          </div>
        ) : null}
        <button
          type="button"
          className="selected-zone selected-zone--previous"
          onClick={previous}
          aria-label="Previous selected image"
        />
        <button
          type="button"
          className="selected-zone selected-zone--next"
          onClick={next}
          aria-label="Next selected image"
        />
      </div>

      <div className="selected-mobile-meta" aria-live="polite">
        <p>
          <strong>{current.name}</strong>
          <span>{current.category}</span>
        </p>
        <p>
          {index + 1} <span>|</span> {items.length}
        </p>
      </div>

      <div
        className={`portfolio-intro is-${introPhase}`}
        aria-hidden={introPhase === "hidden"}
      >
        <h1>
          <span>Batsinael</span>
          <span>Photographer &amp; Director</span>
        </h1>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SelectedGalleryItem } from "@/lib/images";

interface SelectedGalleryProps {
  items: SelectedGalleryItem[];
}

export function SelectedGallery({ items }: SelectedGalleryProps) {
  const [index, setIndex] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const current = items[index];

  const next = useCallback(() => {
    setIndex((value) => (value + 1) % items.length);
  }, [items.length]);

  const previous = useCallback(() => {
    setIndex((value) => (value - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = document.documentElement;
    root.classList.add("is-preloading");

    const hideTimer = window.setTimeout(
      () => setIntroVisible(false),
      reduceMotion ? 120 : 2350,
    );
    const unlockTimer = window.setTimeout(
      () => root.classList.remove("is-preloading"),
      reduceMotion ? 180 : 2950,
    );

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(unlockTimer);
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
        <div key={current.image.relativePath} className="selected-media-frame">
          <Image
            src={current.image.url}
            alt={current.name}
            width={current.image.width}
            height={current.image.height}
            priority={index === 0}
            quality={90}
            sizes="(max-width: 767px) calc(100vw - 30px), 64vw"
          />
        </div>
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
        className={`portfolio-intro ${introVisible ? "is-visible" : ""}`}
        aria-hidden={!introVisible}
      >
        <h1>
          <span>Batsinael</span>
          <span>Photographer &amp; Director</span>
        </h1>
      </div>
    </section>
  );
}

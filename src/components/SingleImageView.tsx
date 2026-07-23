"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PortfolioImage } from "@/lib/images";

interface SingleImageViewProps {
  images: PortfolioImage[];
  initialIndex: number;
  onClose: () => void;
}

const cursorLeft = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><polygon points="14,8 8,12 14,16" fill="black" stroke="white" stroke-width="1"/></svg>') 16 16, w-resize`;
const cursorRight = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><polygon points="10,8 16,12 10,16" fill="black" stroke="white" stroke-width="1"/></svg>') 16 16, e-resize`;
const cursorUp = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><polygon points="8,14 12,8 16,14" fill="black" stroke="white" stroke-width="1"/></svg>') 16 16, n-resize`;

export function SingleImageView({ images, initialIndex, onClose }: SingleImageViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const currentImage = images[currentIndex];

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        handleNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
        return;
      }
      if (e.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([tabindex="-1"]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const backgroundElements = [...document.body.children]
      .filter((element): element is HTMLElement => (
        element instanceof HTMLElement && element !== dialogRef.current
      ))
      .map((element) => ({ element, wasInert: element.inert }));

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    for (const { element } of backgroundElements) {
      element.inert = true;
    }
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      for (const { element, wasInert } of backgroundElements) {
        element.inert = wasInert;
      }
      previouslyFocusedElement?.focus();
    };
  }, [onClose, handleNext, handlePrev]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="lightbox-enter fixed inset-0 z-50 flex flex-col bg-white"
    >
        <div className="relative flex-1 w-full h-full flex items-center justify-center p-4 md:p-12 select-none">
          {/* Main Image */}
          <div
            key={currentIndex}
            className="lightbox-image-enter pointer-events-none absolute inset-4 md:inset-12"
          >
            <Image
              src={currentImage.url}
              alt={`Image ${currentIndex + 1}`}
              fill
              quality={92}
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Navigation Zones */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute top-0 left-0 right-0 h-[15%] z-10"
            style={{ cursor: cursorUp }}
            onClick={onClose}
          />
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute bottom-0 left-0 right-0 h-[15%] z-10"
            style={{ cursor: cursorUp }}
            onClick={onClose}
          />
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute top-[15%] bottom-[15%] left-0 w-1/2 z-10"
            style={{ cursor: cursorLeft }}
            onClick={handlePrev}
          />
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute top-[15%] bottom-[15%] right-0 w-1/2 z-10"
            style={{ cursor: cursorRight }}
            onClick={handleNext}
          />
        </div>

        {/* Bottom UI Controls */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex flex-col items-end gap-2 text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium">
          <div className="flex gap-4">
            <button type="button" onClick={handlePrev} className="min-h-6 hover:text-black transition-colors">PREV</button>
            <span>/</span>
            <button type="button" onClick={handleNext} className="min-h-6 hover:text-black transition-colors">NEXT</button>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="mt-2 min-h-6 hover:text-black transition-colors"
          >
            SHOW THUMBNAILS
          </button>
        </div>
    </div>,
    document.body,
  );
}

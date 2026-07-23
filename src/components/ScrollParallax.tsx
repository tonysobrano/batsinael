"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const mediaSelector = ".work-card-image, .project-overview-grid button";

export function ScrollParallax() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const media = document.querySelectorAll<HTMLElement>(mediaSelector);

      media.forEach((container) => {
        if (container.offsetParent === null) {
          return;
        }

        const image = container.querySelector<HTMLElement>("img");
        if (!image) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const travel = rect.height * 0.115;
        const offset = Math.max(
          -travel / 2,
          Math.min(travel / 2, (0.5 - center / viewportHeight) * travel),
        );

        container.style.setProperty(
          "--scroll-parallax-y",
          `${offset.toFixed(2)}px`,
        );
      });
    };

    const scheduleUpdate = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    const observer = new MutationObserver(scheduleUpdate);
    const startTimer = window.setTimeout(() => {
      const main = document.querySelector("main");

      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
      if (main) {
        observer.observe(main, { childList: true, subtree: true });
      }
      scheduleUpdate();
    }, 500);

    return () => {
      window.clearTimeout(startTimer);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname]);

  return null;
}

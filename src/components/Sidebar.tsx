"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface SidebarProps {
  projects: { name: string; path: string }[];
  brands: { name: string; path: string }[];
  portraits: { name: string; path: string }[];
}

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const MenuIcon = () => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

const MailIcon = () => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export function Sidebar({ projects, brands, portraits }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const projectsActive = pathname.startsWith("/projects");
  const brandsActive = pathname.startsWith("/brands");
  const portraitsActive = pathname.startsWith("/portraits");

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const mainContent = document.querySelector<HTMLElement>("main");
    const mainWasInert = mainContent?.inert ?? false;
    const focusFrame = requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    if (mainContent) {
      mainContent.inert = true;
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      if (mainContent) {
        mainContent.inert = mainWasInert;
      }
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  const handleNavigate = () => {
    setIsOpen(false);
  };

  const navLinkClasses = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return clsx(
      "flex min-h-11 items-center text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:min-h-6 md:text-[10px]",
      isActive ? "opacity-100" : "opacity-65 hover:opacity-100"
    );
  };

  const renderSidebarContent = () => (
    <div className="flex min-h-full flex-col">
      <div>
        <nav className="flex flex-col">
          <Link href="/" onClick={handleNavigate} className={navLinkClasses("/", true)}>Home</Link>

          {/* Projects Accordion */}
          <div>
            <Link
              href="/projects"
              onClick={handleNavigate}
              className={clsx(
                "flex min-h-11 w-full items-center text-left text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:min-h-6 md:text-[10px]",
                projectsActive ? "opacity-100" : "opacity-65 hover:opacity-100"
              )}
            >
              Projects
            </Link>
            {projectsActive && (
              <div className="sidebar-subnav-enter ml-1 flex flex-col overflow-hidden border-l border-gray-100 pl-2">
                {projects.map(p => (
                  <Link key={p.path} href={p.path} onClick={handleNavigate} className={navLinkClasses(p.path, true)}>
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Brands Accordion */}
          <div>
            <Link
              href="/brands"
              onClick={handleNavigate}
              className={clsx(
                "flex min-h-11 w-full items-center text-left text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:min-h-6 md:text-[10px]",
                brandsActive ? "opacity-100" : "opacity-65 hover:opacity-100"
              )}
            >
              Brands
            </Link>
            {brandsActive && (
              <div className="sidebar-subnav-enter ml-1 flex flex-col overflow-hidden border-l border-gray-100 pl-2">
                {brands.map(p => (
                  <Link key={p.path} href={p.path} onClick={handleNavigate} className={navLinkClasses(p.path, true)}>
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Portraits Accordion */}
          <div>
            <Link
              href="/portraits"
              onClick={handleNavigate}
              className={clsx(
                "flex min-h-11 w-full items-center text-left text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:min-h-6 md:text-[10px]",
                portraitsActive ? "opacity-100" : "opacity-65 hover:opacity-100"
              )}
            >
              Portraits
            </Link>
            {portraitsActive && (
              <div className="sidebar-subnav-enter ml-1 flex flex-col overflow-hidden border-l border-gray-100 pl-2">
                {portraits.map(p => (
                  <Link key={p.path} href={p.path} onClick={handleNavigate} className={navLinkClasses(p.path, true)}>
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" onClick={handleNavigate} className={navLinkClasses("/about")}>About</Link>
        </nav>
      </div>

      <a href="mailto:contact@batsinael.com" className="mt-[14px] flex min-h-11 items-center text-[12px] leading-[1.35] text-black opacity-80 transition-opacity duration-200 hover:opacity-100 md:min-h-6 md:text-[10px]">
        Contact
      </a>

      {/* Social Icons */}
      <div className="mt-[9px] flex items-center text-black">
        <a href="https://instagram.com/batsinael" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex size-11 items-center justify-center opacity-90 transition-opacity duration-200 hover:opacity-100 md:size-6 [&_svg]:size-[14px] md:[&_svg]:size-[11px]"><InstagramIcon /></a>
        <a href="mailto:contact@batsinael.com" aria-label="Email" className="inline-flex size-11 items-center justify-center opacity-90 transition-opacity duration-200 hover:opacity-100 md:size-6 [&_svg]:size-[14px] md:[&_svg]:size-[11px]"><MailIcon /></a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-end border-b border-gray-100 bg-white/90 px-[14px] py-[14px] backdrop-blur-md md:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex size-11 items-center justify-center text-black"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        ref={mobileMenuRef}
        id="mobile-navigation"
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Site navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={clsx(
          "fixed inset-0 z-30 overflow-y-auto bg-white px-6 pb-8 pt-24 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none md:hidden",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0",
        )}
      >
        {renderSidebarContent()}
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-[140px] overflow-y-auto bg-white pb-10 pl-[53px] pr-4 pt-[143px] md:block">
        {renderSidebarContent()}
      </aside>
    </>
  );
}

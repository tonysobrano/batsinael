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
  const [expandedSection, setExpandedSection] = useState<
    "projects" | "brands" | "portraits" | null
  >(null);
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

  const toggleSection = (section: "projects" | "brands" | "portraits") => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  const navLinkClasses = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return clsx(
      "flex min-h-11 items-center text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:min-h-6 md:text-[10px]",
      isActive ? "opacity-100" : "opacity-65 hover:opacity-100"
    );
  };

  const renderContactLinks = (mobile = false) => (
    <div className={mobile ? "mt-auto pt-12" : "mt-auto pt-8"}>
      <a
        href="mailto:contact@batsinael.com"
        className={clsx(
          "flex items-center text-black opacity-80 transition-opacity duration-200 hover:opacity-100",
          mobile ? "min-h-11 text-[12px]" : "min-h-6 text-[10px]",
        )}
      >
        Contact
      </a>
      <div className={clsx("mt-2 flex items-center text-black", mobile ? "gap-1" : "-ml-2") }>
        <a href="https://instagram.com/batsinael" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={clsx("inline-flex items-center justify-center opacity-90 transition-opacity duration-200 hover:opacity-100", mobile ? "size-11" : "size-6 [&_svg]:size-[11px]")}><InstagramIcon /></a>
        <a href="mailto:contact@batsinael.com" aria-label="Email" className={clsx("inline-flex items-center justify-center opacity-90 transition-opacity duration-200 hover:opacity-100", mobile ? "size-11" : "size-6 [&_svg]:size-[11px]")}><MailIcon /></a>
      </div>
    </div>
  );

  const renderDesktopSidebarContent = () => (
    <div className="flex h-full flex-col">
      <nav className="flex flex-col" aria-label="Primary navigation">
        <Link href="/" className={navLinkClasses("/", true)}>Home</Link>
        <div>
          <Link href="/projects" className={navLinkClasses("/projects")}>Projects</Link>
          {projectsActive && (
            <div className="sidebar-subnav-enter ml-1 flex flex-col overflow-hidden border-l border-gray-100 pl-2">
              {projects.map((project) => <Link key={project.path} href={project.path} className={navLinkClasses(project.path, true)}>{project.name}</Link>)}
            </div>
          )}
        </div>
        <div>
          <Link href="/brands" className={navLinkClasses("/brands")}>Brands</Link>
          {brandsActive && (
            <div className="sidebar-subnav-enter ml-1 flex flex-col overflow-hidden border-l border-gray-100 pl-2">
              {brands.map((brand) => <Link key={brand.path} href={brand.path} className={navLinkClasses(brand.path, true)}>{brand.name}</Link>)}
            </div>
          )}
        </div>
        <div>
          <Link href="/portraits" className={navLinkClasses("/portraits")}>Portraits</Link>
          {portraitsActive && (
            <div className="sidebar-subnav-enter ml-1 flex flex-col overflow-hidden border-l border-gray-100 pl-2">
              {portraits.map((portrait) => <Link key={portrait.path} href={portrait.path} className={navLinkClasses(portrait.path, true)}>{portrait.name}</Link>)}
            </div>
          )}
        </div>
        <Link href="/about" className={navLinkClasses("/about")}>About</Link>
      </nav>
      {renderContactLinks()}
    </div>
  );

  const renderMobileSection = (
    section: "projects" | "brands" | "portraits",
    label: string,
    path: string,
    items: { name: string; path: string }[],
  ) => {
    const isExpanded = expandedSection === section;
    return (
      <div className="border-b border-black/10">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link href={path} onClick={handleNavigate} className="flex flex-1 items-center py-3 text-[22px] font-medium tracking-[-0.05em] text-black">{label}</Link>
          <button type="button" onClick={() => toggleSection(section)} aria-expanded={isExpanded} aria-controls={`${section}-mobile-links`} className="inline-flex size-11 items-center justify-center text-[11px] font-medium uppercase tracking-[0.08em] text-black" aria-label={`${isExpanded ? "Hide" : "Show"} ${label.toLowerCase()}`}>{isExpanded ? "Hide" : "Show"}</button>
        </div>
        {isExpanded && (
          <div id={`${section}-mobile-links`} className="sidebar-subnav-enter grid gap-1 pb-4 pl-1">
            {items.map((item) => <Link key={item.path} href={item.path} onClick={handleNavigate} className={clsx("flex min-h-11 items-center text-[13px] text-black/65 transition-colors hover:text-black", pathname === item.path && "text-black")}>{item.name}</Link>)}
          </div>
        )}
      </div>
    );
  };

  const renderMobileMenu = () => (
    <div className="flex min-h-full flex-col">
      <nav className="flex flex-col" aria-label="Primary navigation">
        <Link href="/" onClick={handleNavigate} className="flex min-h-16 items-center border-b border-black/10 text-[22px] font-medium tracking-[-0.05em] text-black">Home</Link>
        {renderMobileSection("projects", "Projects", "/projects", projects)}
        {renderMobileSection("brands", "Brands", "/brands", brands)}
        {renderMobileSection("portraits", "Portraits", "/portraits", portraits)}
        <Link href="/about" onClick={handleNavigate} className="flex min-h-16 items-center border-b border-black/10 text-[22px] font-medium tracking-[-0.05em] text-black">About</Link>
      </nav>
      {renderContactLinks(true)}
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/90 px-[18px] py-[14px] backdrop-blur-md md:hidden">
        <Link href="/" onClick={handleNavigate} className="text-[21px] font-medium leading-none tracking-[-0.09em] text-black" aria-label="Batsinael home">batsinael</Link>
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
        {renderMobileMenu()}
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-[140px] overflow-y-auto bg-white pb-10 pl-[53px] pr-4 pt-[143px] md:block">
        <Link href="/" className="absolute left-[53px] top-[52px] text-[21px] font-medium leading-none tracking-[-0.09em] text-black" aria-label="Batsinael home">batsinael</Link>
        {renderDesktopSidebarContent()}
      </aside>
    </>
  );
}

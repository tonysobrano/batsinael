"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Mail } from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  projects: { name: string; path: string }[];
  brands: { name: string; path: string }[];
  portraits: { name: string; path: string }[];
}

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

export function Sidebar({ projects, brands, portraits }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [portraitsOpen, setPortraitsOpen] = useState(false);
  const projectsActive = pathname.startsWith("/projects");
  const brandsActive = pathname.startsWith("/brands");
  const portraitsActive = pathname.startsWith("/portraits");

  const handleNavigate = () => {
    setIsOpen(false);
  };

  const navLinkClasses = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return clsx(
      "block py-px text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:text-[10px]",
      isActive ? "opacity-100" : "opacity-65 hover:opacity-100"
    );
  };

  const renderSidebarContent = () => (
    <div className="flex min-h-full flex-col">
      <div>
        <nav className="flex flex-col gap-[5px]">
          <Link href="/" onClick={handleNavigate} className={navLinkClasses("/", true)}>Home</Link>

          {/* Projects Accordion */}
          <div>
            <Link
              href="/projects"
              onClick={() => {
                if (projectsActive) {
                  setProjectsOpen((open) => !open);
                }
                handleNavigate();
              }}
              className={clsx(
                "block w-full py-px text-left text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:text-[10px]",
                projectsActive ? "opacity-100" : "opacity-65 hover:opacity-100"
              )}
            >
              Projects
            </Link>
            <AnimatePresence>
              {(projectsOpen || projectsActive) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-1 mt-1 flex flex-col gap-[3px] overflow-hidden border-l border-gray-100 pl-2"
                >
                  {projects.map(p => (
                    <Link key={p.path} href={p.path} onClick={handleNavigate} className={navLinkClasses(p.path, true)}>
                      {p.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Brands Accordion */}
          <div>
            <Link
              href="/brands"
              onClick={() => {
                if (brandsActive) {
                  setBrandsOpen((open) => !open);
                }
                handleNavigate();
              }}
              className={clsx(
                "block w-full py-px text-left text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:text-[10px]",
                brandsActive ? "opacity-100" : "opacity-65 hover:opacity-100"
              )}
            >
              Brands
            </Link>
            <AnimatePresence>
              {(brandsOpen || brandsActive) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-1 mt-1 flex flex-col gap-[3px] overflow-hidden border-l border-gray-100 pl-2"
                >
                  {brands.map(p => (
                    <Link key={p.path} href={p.path} onClick={handleNavigate} className={navLinkClasses(p.path, true)}>
                      {p.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Portraits Accordion */}
          <div>
            <Link
              href="/portraits"
              onClick={() => {
                if (portraitsActive) {
                  setPortraitsOpen((open) => !open);
                }
                handleNavigate();
              }}
              className={clsx(
                "block w-full py-px text-left text-[12px] leading-[1.35] text-black transition-opacity duration-200 md:text-[10px]",
                portraitsActive ? "opacity-100" : "opacity-65 hover:opacity-100"
              )}
            >
              Portraits
            </Link>
            <AnimatePresence>
              {(portraitsOpen || portraitsActive) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-1 mt-1 flex flex-col gap-[3px] overflow-hidden border-l border-gray-100 pl-2"
                >
                  {portraits.map(p => (
                    <Link key={p.path} href={p.path} onClick={handleNavigate} className={navLinkClasses(p.path, true)}>
                      {p.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about" onClick={handleNavigate} className={navLinkClasses("/about")}>About</Link>
        </nav>
      </div>

      <Link href="/" onClick={handleNavigate} className="mt-[22px] text-[12px] leading-[1.35] text-black opacity-80 transition-opacity duration-200 hover:opacity-100 md:text-[10px]">
        Shop
      </Link>

      {/* Social Icons */}
      <div className="mt-[17px] flex items-center gap-[9px] text-black">
        <a href="#" aria-label="Instagram" className="opacity-90 transition-opacity duration-200 hover:opacity-100 [&_svg]:size-[14px] md:[&_svg]:size-[11px]"><InstagramIcon /></a>
        <a href="mailto:contact@batsinael.com" aria-label="Email" className="opacity-90 transition-opacity duration-200 hover:opacity-100"><Mail className="size-[14px] md:size-[11px]" strokeWidth={2.2} /></a>
        <a href="#" aria-label="LinkedIn" className="opacity-90 transition-opacity duration-200 hover:opacity-100 [&_svg]:size-[14px] md:[&_svg]:size-[11px]"><LinkedinIcon /></a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-end border-b border-gray-100 bg-white/90 px-6 py-6 backdrop-blur-md md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-black">
          {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-30 overflow-y-auto bg-white px-6 pt-24 md:hidden"
          >
            {renderSidebarContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-[140px] overflow-y-auto bg-white pb-10 pl-[53px] pr-4 pt-[143px] md:block">
        {renderSidebarContent()}
      </aside>
    </>
  );
}

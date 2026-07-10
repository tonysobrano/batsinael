"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

  // Accordion state
  const [projectsOpen, setProjectsOpen] = useState(pathname.startsWith("/projects"));
  const [brandsOpen, setBrandsOpen] = useState(pathname.startsWith("/brands"));
  const [portraitsOpen, setPortraitsOpen] = useState(pathname.startsWith("/portraits"));

  useEffect(() => {
    setIsOpen(false);
    
    if (pathname === "/") {
      setProjectsOpen(false);
      setBrandsOpen(false);
      setPortraitsOpen(false);
    }
    
    // Auto-open accordion if we navigate to a child route
    if (pathname.startsWith("/projects")) setProjectsOpen(true);
    if (pathname.startsWith("/brands")) setBrandsOpen(true);
    if (pathname.startsWith("/portraits")) setPortraitsOpen(true);
  }, [pathname]);

  const navLinkClasses = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return clsx(
      "text-[11px] md:text-xs tracking-[0.15em] transition-colors duration-300 capitalize block py-[2px]",
      isActive ? "text-black font-medium" : "text-gray-400 hover:text-black"
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between pb-8">
      <div>
        <nav className="flex flex-col gap-2 mt-16">
          <Link href="/" className={navLinkClasses("/", true)}>Home</Link>
          
          {/* Projects Accordion */}
          <div>
            <Link 
              href="/projects"
              onClick={(e) => {
                if (pathname.startsWith("/projects")) {
                  setProjectsOpen(!projectsOpen);
                }
              }}
              className={clsx(
                "text-[11px] md:text-xs tracking-[0.15em] transition-colors duration-300 capitalize w-full text-left py-[2px] block",
                pathname.startsWith("/projects") ? "text-black font-medium" : "text-gray-400 hover:text-black"
              )}
            >
              Projects
            </Link>
            <AnimatePresence>
              {projectsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col pl-4 mt-1 gap-0.5 border-l border-gray-100 ml-1"
                >
                  {projects.map(p => (
                    <Link key={p.path} href={p.path} className={navLinkClasses(p.path, true)}>
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
              onClick={(e) => {
                if (pathname.startsWith("/brands")) {
                  setBrandsOpen(!brandsOpen);
                }
              }}
              className={clsx(
                "text-[11px] md:text-xs tracking-[0.15em] transition-colors duration-300 capitalize w-full text-left py-[2px] block",
                pathname.startsWith("/brands") ? "text-black font-medium" : "text-gray-400 hover:text-black"
              )}
            >
              Brands
            </Link>
            <AnimatePresence>
              {brandsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col pl-4 mt-1 gap-0.5 border-l border-gray-100 ml-1"
                >
                  {brands.map(p => (
                    <Link key={p.path} href={p.path} className={navLinkClasses(p.path, true)}>
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
              onClick={(e) => {
                if (pathname.startsWith("/portraits")) {
                  setPortraitsOpen(!portraitsOpen);
                }
              }}
              className={clsx(
                "text-[11px] md:text-xs tracking-[0.15em] transition-colors duration-300 capitalize w-full text-left py-[2px] block",
                pathname.startsWith("/portraits") ? "text-black font-medium" : "text-gray-400 hover:text-black"
              )}
            >
              Portraits
            </Link>
            <AnimatePresence>
              {portraitsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col pl-4 mt-1 gap-0.5 border-l border-gray-100 ml-1"
                >
                  {portraits.map(p => (
                    <Link key={p.path} href={p.path} className={navLinkClasses(p.path, true)}>
                      {p.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about" className={navLinkClasses("/about")}>About</Link>
        </nav>
      </div>

      {/* Social Icons */}
      <div className="flex gap-4 items-center text-gray-400">
        <a href="#" className="hover:text-black transition-colors"><InstagramIcon /></a>
        <a href="mailto:contact@batsinael.com" className="hover:text-black transition-colors"><Mail size={16} /></a>
        <a href="#" className="hover:text-black transition-colors"><LinkedinIcon /></a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md flex items-center justify-end px-6 py-6 border-b border-gray-100">
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
            className="md:hidden fixed inset-0 z-30 bg-white pt-24 px-6 overflow-y-auto"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 w-[250px] p-12 border-r border-gray-50 overflow-y-auto bg-white z-40">
        <SidebarContent />
      </aside>
    </>
  );
}

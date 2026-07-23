"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Selected", match: (path: string) => path === "/" },
  {
    href: "/projects",
    label: "Works",
    match: (path: string) =>
      path.startsWith("/projects") ||
      path.startsWith("/brands") ||
      path.startsWith("/portraits"),
  },
  {
    href: "/about",
    label: "About",
    match: (path: string) => path.startsWith("/about"),
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isDetail = /^\/(projects|brands|portraits)\/[^/]+/.test(pathname);

  if (isDetail) {
    return null;
  }

  return (
    <header
      className={`site-header ${pathname === "/" ? "site-header--selected" : ""}`}
    >
      <Link href="/" className="site-brand" aria-label="Batsinael selected work">
        Batsinael
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {links.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "is-active" : undefined}
              aria-current={active ? "page" : undefined}
            >
              <span aria-hidden="true">[ </span>
              {link.label}
              <span aria-hidden="true"> ]</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

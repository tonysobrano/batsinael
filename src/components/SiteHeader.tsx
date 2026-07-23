"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const router = useRouter();
  const isDetail = /^\/(projects|brands|portraits)\/[^/]+/.test(pathname);

  useEffect(() => {
    const root = document.documentElement;
    const isWorksIndex =
      pathname === "/projects" ||
      pathname === "/brands" ||
      pathname === "/portraits";

    if (
      !isWorksIndex ||
      !root.classList.contains("is-transitioning-to-works")
    ) {
      root.classList.remove("is-transitioning-to-works");
      root.classList.remove("is-revealing-works");
      return;
    }

    const settleTimer = window.setTimeout(() => {
      root.classList.remove("is-transitioning-to-works");
    }, 820);

    return () => {
      window.clearTimeout(settleTimer);
    };
  }, [pathname]);

  if (isDetail) {
    return null;
  }

  const handleWorksNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (
      pathname !== "/" ||
      href !== "/projects" ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const root = document.documentElement;
    if (root.classList.contains("is-transitioning-to-works")) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    root.classList.add("is-transitioning-to-works");
    window.setTimeout(() => router.push(href), 220);
  };

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
              onClick={(event) => handleWorksNavigation(event, link.href)}
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

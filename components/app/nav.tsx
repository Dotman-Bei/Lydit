"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NAV = [
  { href: "/gauge", label: "Gauge" },
  { href: "/proof", label: "Proof" },
  { href: "/sources", label: "Sources" },
  { href: "/#how-it-works", label: "How it works" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppNavLinks() {
  const pathname = usePathname();
  return (
    <ul className="appbar__links">
      {NAV.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className="appbar__link"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Phone only: the links fold into a full-screen sheet (app chapter §12). */
export function AppMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="appbar__menu"
        aria-expanded={open}
        aria-controls="app-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={18} aria-hidden /> : <List size={18} aria-hidden />}
        <span>Menu</span>
      </button>
      {open && (
        <div id="app-menu" className="menu-sheet" role="dialog" aria-label="Menu">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="menu-sheet__link"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

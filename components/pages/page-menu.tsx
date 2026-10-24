"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/gauge", label: "Gauge" },
  { href: "/proof", label: "Proof" },
  { href: "/sources", label: "Sources" },
  { href: "/#how-it-works", label: "How it works" },
];

/** Phone only: one menu word that opens a full-screen sheet (layout.md §7). */
export function PageMenu() {
  const [open, setOpen] = useState(false);

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
        className="corner-nav__menu"
        aria-expanded={open}
        aria-controls="page-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <div id="page-menu" className="page-sheet" role="dialog" aria-label="Menu">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

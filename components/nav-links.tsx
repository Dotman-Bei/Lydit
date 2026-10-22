"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

export function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150 ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
              {active && <span aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 rounded-md bg-accent" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Page motion (motion.md §6, base.js): reveal each part once as it enters, and let the fixed corner
// navigation take the ink of the chapter beneath it. Content is visible without script (html.js gate).
export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => reveal.observe(el));
    const safety = window.setTimeout(() => {
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 2500);

    const chapters = document.querySelectorAll<HTMLElement>("[data-ink]");
    const ink = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            document.documentElement.style.setProperty("--header-ink", (entry.target as HTMLElement).dataset.ink ?? "");
            document.documentElement.style.setProperty(
              "--header-ground",
              (entry.target as HTMLElement).dataset.ground ?? "",
            );
          }
        }
      },
      { rootMargin: "0px 0px -92% 0px", threshold: 0 },
    );
    chapters.forEach((el) => ink.observe(el));

    return () => {
      reveal.disconnect();
      ink.disconnect();
      window.clearTimeout(safety);
      document.documentElement.style.removeProperty("--header-ink");
      document.documentElement.style.removeProperty("--header-ground");
    };
  }, [pathname]);

  return null;
}

"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * A line fitted to its container by measurement (layout.md §5), never by a size guessed for one face.
 * `fallback` is the CSS size used before fonts load and without script.
 */
export function FitText({
  children,
  className = "",
  fallback,
  max = 640,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  fallback: string;
  max?: number;
  as?: "span" | "p";
}) {
  const box = useRef<HTMLElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = box.current;
    const text = line.current;
    if (!el || !text) return;
    const fit = () => {
      text.style.fontSize = "100px";
      const natural = text.getBoundingClientRect().width;
      const width = el.getBoundingClientRect().width;
      if (natural > 0 && width > 0) text.style.fontSize = `${Math.min((width / natural) * 100 * 0.995, max)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [max]);

  return (
    <Tag ref={box as React.Ref<never>} className={`fit ${className}`}>
      <span ref={line} className="fit__line" style={{ fontSize: fallback }}>
        {children}
      </span>
    </Tag>
  );
}

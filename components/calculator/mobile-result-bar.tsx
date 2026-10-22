"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Calculation } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";

// Below lg the result panel sits after the form. This bar keeps the answer in view while editing.
// It carries no test ids: the panel owns them.
export function MobileResultBar({
  calc,
  panelRef,
}: {
  calc: Calculation;
  panelRef: React.RefObject<HTMLElement | null>;
}) {
  const [panelVisible, setPanelVisible] = useState(true);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setPanelVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [panelRef]);

  const liq = calc.status === "ready" ? calc.liq : undefined;
  if (!liq) return null;

  return (
    <div
      aria-hidden={panelVisible}
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface transition-transform duration-200 ease-out-expo lg:hidden ${
        panelVisible ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4">
        <p className="flex min-w-0 flex-col">
          <span className="text-[12px] leading-4 text-muted">Liquidation price</span>
          <span className="num truncate text-lg font-medium leading-6">
            {liq.kind === "price" ? `${formatFixed(liq.price)} USDT` : "None"}
          </span>
        </p>
        <button
          type="button"
          tabIndex={panelVisible ? -1 : 0}
          onClick={() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium active:translate-y-px"
        >
          <ArrowUp size={14} aria-hidden />
          See result
        </button>
      </div>
    </div>
  );
}

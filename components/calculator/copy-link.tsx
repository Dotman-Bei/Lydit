"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

// PRD C-5: copies the current scenario URL. The URL is kept in sync with every input change.
export function CopyLinkButton({ disabled = false }: { disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const [href, setHref] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const manualRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (state === "manual") manualRef.current?.select();
  }, [state]);

  const copy = async () => {
    const url = window.location.href;
    setHref(url);
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("manual");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={copy}
        disabled={disabled}
        data-testid="copy-link"
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent-solid px-5 text-sm font-semibold text-on-accent transition-transform duration-150 hover:opacity-95 active:translate-y-px disabled:cursor-not-allowed disabled:bg-raised disabled:text-muted disabled:active:translate-y-0"
      >
        {state === "copied" ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} aria-hidden />}
        <span aria-live="polite">{state === "copied" ? "Copied" : "Copy link"}</span>
      </button>
      {state === "manual" && (
        <label className="flex flex-col gap-1.5 text-[13px] text-muted">
          Copying was blocked. Select the link and copy it yourself:
          <input
            ref={manualRef}
            readOnly
            value={href}
            className="num h-10 w-full rounded-md border border-line bg-surface px-3 text-[13px] text-ink"
          />
        </label>
      )}
    </div>
  );
}

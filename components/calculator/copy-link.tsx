"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

// PRD C-5: copies the current scenario URL, which every input change keeps up to date.
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
    <div className="copy-link">
      <button type="button" onClick={copy} disabled={disabled} data-testid="copy-link" className="btn btn--primary">
        {state === "copied" ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} aria-hidden />}
        <span aria-live="polite">{state === "copied" ? "Copied" : "Copy link"}</span>
      </button>
      {state === "manual" && (
        <label className="copy-link__manual">
          Copying was blocked. Select the link and copy it:
          <input ref={manualRef} readOnly value={href} className="field__input" />
        </label>
      )}
    </div>
  );
}

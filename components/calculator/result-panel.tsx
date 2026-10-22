"use client";

import { Warning } from "@phosphor-icons/react";
import type { Calculation } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";
import { CopyLinkButton } from "./copy-link";

export function joinList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function partialMessage(calc: Calculation) {
  if (calc.missing.length > 0) return `Add ${joinList(calc.missing)} to get a liquidation price.`;
  if (calc.incompleteOthers.length > 0) {
    const which = joinList(calc.incompleteOthers.map(String));
    return `Finish other position ${which}, or remove it, to get a liquidation price.`;
  }
  return "";
}

const NO_LIQ_REASON = {
  "non-positive": "The formula lands at zero or below: this balance covers the position at any price.",
  "denominator-zero": "The formula's denominator is zero for these inputs.",
} as const;

export function ResultPanel({ calc, ref }: { calc: Calculation; ref?: React.Ref<HTMLElement> }) {
  const { status, liq, mm, distance } = calc;
  const showFigures = status === "partial" || status === "ready";

  return (
    <section
      ref={ref}
      id="result"
      aria-labelledby="result-heading"
      aria-live="polite"
      className="scroll-mt-6 rounded-md border border-line bg-surface"
      data-testid="result"
    >
      <div className="px-5 pb-6 pt-5 sm:px-6">
        <h2 id="result-heading" className="text-sm font-medium text-muted">
          Liquidation price
        </h2>

        {status === "empty" && (
          <p className="mt-3 max-w-[34ch] text-[15px] leading-6 text-muted" data-testid="result-empty">
            Enter a position, or load an example above, to see where it liquidates.
          </p>
        )}

        {status === "invalid" && (
          <p className="mt-3 flex items-start gap-2 text-[15px] leading-6 text-fail" data-testid="result-invalid">
            <Warning size={18} className="mt-[3px] shrink-0" aria-hidden />
            Fix the highlighted fields to get a result.
          </p>
        )}

        {status === "partial" && (
          <p className="mt-3 max-w-[34ch] text-[15px] leading-6 text-muted" data-testid="result-partial">
            {partialMessage(calc)}
          </p>
        )}

        {status === "ready" && liq?.kind === "price" && (
          <div className="mt-2">
            <p className="flex flex-wrap items-baseline gap-x-2 leading-none">
              <span className="num text-[40px] font-medium tracking-tight lg:text-[52px]" data-testid="liq-price">
                {formatFixed(liq.price)}
              </span>
              <span className="text-sm text-muted">USDT</span>
            </p>
            <span
              key={formatFixed(liq.price)}
              aria-hidden
              className="streak mt-4 block h-1 w-16 rounded-md bg-accent"
            />
            {distance?.past && (
              <p className="mt-4 flex items-start gap-2 text-sm leading-5 text-fail" data-testid="already-past">
                <Warning size={16} className="mt-0.5 shrink-0" aria-hidden />
                Mark price is already past this liquidation price.
              </p>
            )}
          </div>
        )}

        {status === "ready" && liq?.kind === "none" && (
          <div className="mt-3">
            <p className="text-2xl font-semibold tracking-tight" data-testid="no-liq">
              No liquidation price
            </p>
            <p className="mt-2 max-w-[38ch] text-sm leading-6 text-muted" data-testid="no-liq-reason">
              {NO_LIQ_REASON[liq.reason]}
            </p>
          </div>
        )}
      </div>

      {showFigures && (
        <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 px-5 py-4 sm:px-6">
            <dt className="text-[13px] text-muted">Maintenance margin</dt>
            <dd className="text-[15px] leading-6">
              {mm ? (
                <>
                  <span className="num text-xl font-medium" data-testid="maint-margin">
                    {formatFixed(mm)}
                  </span>{" "}
                  <span className="text-[13px] text-muted">USDT</span>
                </>
              ) : (
                <span className="text-sm text-muted">Needs size, mark price, rate and amount</span>
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-line px-5 py-4 sm:border-l sm:border-t-0 sm:px-6">
            <dt className="text-[13px] text-muted">Distance from mark</dt>
            <dd className="text-[15px] leading-6">
              {distance ? (
                <>
                  <span className="num text-xl font-medium" data-testid="distance-abs">
                    {formatFixed(distance.abs)}
                  </span>{" "}
                  <span className="text-[13px] text-muted">USDT</span>
                  <span className="mt-0.5 block text-sm text-muted">
                    <span className="num text-ink" data-testid="distance-pct">
                      {formatFixed(distance.pct)}
                    </span>
                    % {distance.direction} mark
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted">
                  {liq?.kind === "none"
                    ? "Not applicable"
                    : status === "ready"
                      ? "Needs mark price"
                      : "Needs a liquidation price"}
                </span>
              )}
            </dd>
          </div>
        </dl>
      )}

      <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:px-6">
        <CopyLinkButton disabled={status === "empty"} />
        <p className="text-[13px] leading-5 text-muted">
          Decimal math, shown to 2 places. Binance notes its engine can differ slightly in the last decimal.
        </p>
      </div>
    </section>
  );
}

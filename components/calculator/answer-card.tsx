"use client";

import { Warning } from "@phosphor-icons/react";
import type { Calculation } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";
import { PriceStrip } from "./price-strip";

export function joinList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function partialMessage(calc: Calculation) {
  if (calc.missing.length > 0) return `Add ${joinList(calc.missing)} to get a liquidation price.`;
  if (calc.incompleteOthers.length > 0) {
    return `Finish other position ${joinList(calc.incompleteOthers.map(String))}, or remove it, to get a liquidation price.`;
  }
  return "";
}

const NO_LIQ_REASON = {
  "non-positive": "The formula lands at zero or below: this balance covers the position at any price.",
  "denominator-zero": "The formula's denominator is zero for these inputs.",
} as const;

/** The screen's question, answered by its biggest block (app chapter §2.2). */
export function AnswerCard({ calc }: { calc: Calculation }) {
  const { status, liq, mm, distance, alone, values } = calc;
  const showPair = status === "partial" || status === "ready";

  return (
    <section className="card answer" aria-labelledby="answer-title" aria-live="polite" data-testid="result">
      <h2 id="answer-title" className="answer__label">
        Liquidation price
      </h2>

      {status === "empty" && (
        <p className="answer__state" data-testid="result-empty">
          Enter a position, or load one of Binance&apos;s examples.
        </p>
      )}

      {status === "invalid" && (
        <p className="answer__state is-error" data-testid="result-invalid">
          <Warning size={16} aria-hidden />
          Fix the highlighted fields to get a result.
        </p>
      )}

      {status === "partial" && (
        <p className="answer__state" data-testid="result-partial">
          {partialMessage(calc)}
        </p>
      )}

      {status === "ready" && liq?.kind === "price" && (
        <>
          <p className="answer__figure">
            <span className="answer__value num" data-testid="liq-price">
              {formatFixed(liq.price)}
            </span>
            <span className="unit">USDT</span>
          </p>
          <PriceStrip
            liq={liq.price}
            mark={values.mp}
            entry={values.ep}
            alone={alone?.kind === "price" ? alone.price : undefined}
          />
          {distance?.past && (
            <p className="answer__state is-error" data-testid="already-past">
              <Warning size={16} aria-hidden />
              Mark price is already past this liquidation price.
            </p>
          )}
        </>
      )}

      {status === "ready" && liq?.kind === "none" && (
        <div className="answer__none">
          <p className="answer__none-title" data-testid="no-liq">
            No liquidation price
          </p>
          <p className="answer__state" data-testid="no-liq-reason">
            {NO_LIQ_REASON[liq.reason]}
          </p>
        </div>
      )}

      {showPair && (
        <dl className="answer__pair">
          <div>
            <dt>Maintenance margin</dt>
            <dd>
              {mm ? (
                <>
                  <span className="kpi num" data-testid="maint-margin">
                    {formatFixed(mm)}
                  </span>
                  <span className="unit">USDT</span>
                </>
              ) : (
                <span className="dash" title="Needs size, mark price, rate and amount">
                  -
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt>Distance from mark</dt>
            <dd>
              {distance ? (
                <>
                  <span className="kpi num" data-testid="distance-abs">
                    {formatFixed(distance.abs)}
                  </span>
                  <span className="unit">USDT</span>
                  <span className="answer__sub num">
                    <span data-testid="distance-pct">{formatFixed(distance.pct)}</span>% {distance.direction} mark
                  </span>
                </>
              ) : (
                <span
                  className="dash"
                  title={liq?.kind === "none" ? "Not applicable" : "Needs a liquidation price and mark price"}
                >
                  -
                </span>
              )}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}

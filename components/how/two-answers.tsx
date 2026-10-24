"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculate, othersShift } from "@/lib/calculate";
import { D } from "@/lib/engine";
import { formatFixed } from "@/lib/format";
import { getPreset } from "@/lib/presets";
import { scenarioHref, type Scenario } from "@/lib/scenario";

// The page's live thing: Binance's Example 2 computed by this build, with the BTC position counted and
// with it ignored. Moving BTC's mark price moves the first number; the second never moves.

const BASE = getPreset("eth-cross").scenario;
const BINANCE_BTC_MARK = Number(BASE.others[0].mp);

function withBtcMark(mark: number): Scenario {
  return { ...BASE, others: [{ ...BASE.others[0], mp: mark.toFixed(2) }] };
}

export function TwoAnswers() {
  const [btcMark, setBtcMark] = useState(BINANCE_BTC_MARK);
  const withBtc = useMemo(() => withBtcMark(btcMark), [btcMark]);
  const alone = useMemo<Scenario>(() => ({ ...BASE, others: [] }), []);
  const a = useMemo(() => calculate(withBtc), [withBtc]);
  const b = useMemo(() => calculate(alone), [alone]);
  const shift = othersShift(a);

  const shown = (c: ReturnType<typeof calculate>) => (c.liq?.kind === "price" ? formatFixed(c.liq.price) : "None");

  return (
    <>
      <div className="specimens__text" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
        <p>
          Binance&apos;s Example 2 is one cross wallet holding an ETH long and a BTC long. The BTC position&apos;s loss
          and margin eat into the shared balance, so the ETH long liquidates sooner. A tool that reads one position at a
          time misses it. Both numbers below are computed live by this build; the rate and maintenance amount stay at
          Example 2&apos;s values.
        </p>
        <div className="slider" data-ui>
          <label htmlFor="btc-mark" className="slider__label">
            BTC mark price
            <output htmlFor="btc-mark" className="slider__value num">
              {formatFixed(new D(btcMark.toFixed(2)))}
            </output>
          </label>
          <input
            id="btc-mark"
            type="range"
            min={28000}
            max={36000}
            step={0.01}
            value={btcMark}
            onChange={(e) => setBtcMark(Number(e.target.value))}
            className="slider__input"
          />
          <div className="slider__ends num">
            <span>28,000.00</span>
            <button type="button" className="slider__reset" onClick={() => setBtcMark(BINANCE_BTC_MARK)}>
              Reset to Binance&apos;s 31,967.27
            </button>
            <span>36,000.00</span>
          </div>
        </div>
        <p className="specimens__gap" aria-live="polite">
          {shift ? (
            <>
              Read alone, the ETH long shows <strong className="num">{formatFixed(shift.amount)} USDT</strong>{" "}
              {shift.closer ? "more" : "less"} room than the account has.{" "}
              <Link href={scenarioHref(withBtc)} className="text-link">
                Open it in the gauge
              </Link>
            </>
          ) : (
            "At this BTC price the two answers agree."
          )}
        </p>
      </div>

      <div className="specimens__pair">
        <figure className="specimen" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
          <span className="specimen__figure num">{shown(a)}</span>
          <figcaption>ETH long, as Binance computes it</figcaption>
        </figure>
        <figure className="specimen" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
          <span className="specimen__figure num">{shown(b)}</span>
          <figcaption>ETH long, read alone</figcaption>
        </figure>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import type { Calculation } from "@/lib/calculate";
import { formatFixed, formatInput, term } from "@/lib/format";
import { BINANCE_FAQ_URL } from "@/lib/presets";
import type { Scenario } from "@/lib/scenario";

// PRD B-1 to B-3: the formulas with every term linked, then each step with your inputs substituted.

const MINUS = "−";

function V({ name, anchor }: { name: string; anchor: string }) {
  return (
    <Link href={`/sources#var-${anchor}`} className="term">
      {name}
    </Link>
  );
}

interface Row {
  step: string;
  substituted?: string;
  value: string;
}

export function Breakdown({ calc, scenario }: { calc: Calculation; scenario: Scenario }) {
  const { liq, mm, values, others } = calc;
  const rows: Row[] = [];

  if (liq) {
    const t = liq.terms;
    const source =
      scenario.mode === "isolated"
        ? "0 in isolated margin"
        : others.source === "positions"
          ? "summed from other positions"
          : others.source === "totals"
            ? "entered as a total"
            : "0, no other positions";
    rows.push({ step: `TMM1, ${source}`, value: formatFixed(t.tmm) });
    rows.push({ step: `UPNL1, ${source}`, value: formatFixed(t.upnl) });
    rows.push({
      step: "Numerator",
      substituted: `${formatInput(t.wb)} ${MINUS} ${term(formatFixed(t.tmm))} + ${term(formatFixed(t.upnl))} + ${formatInput(t.cum)} ${MINUS} ${term(String(t.side))} × ${formatInput(t.size)} × ${formatInput(t.ep)}`,
      value: formatFixed(liq.numerator),
    });
    rows.push({
      step: "Denominator",
      substituted: `${formatInput(t.size)} × ${formatInput(t.mmr)} ${MINUS} ${term(String(t.side))} × ${formatInput(t.size)}`,
      value: formatFixed(liq.denominator),
    });
    rows.push({
      step: "Liquidation price",
      substituted: `${formatFixed(liq.numerator)} ÷ ${term(formatFixed(liq.denominator))}`,
      value: liq.kind === "price" ? formatFixed(liq.price) : "None",
    });
  }

  if (mm && values.size && values.mp && values.mmr && values.cum) {
    rows.push({
      step: "Maintenance margin",
      substituted: `${formatInput(values.size)} × ${formatInput(values.mp)} × ${formatInput(values.mmr)} ${MINUS} ${formatInput(values.cum)}`,
      value: formatFixed(mm),
    });
  }

  return (
    <section className="card breakdown" aria-labelledby="breakdown-title" data-testid="breakdown">
      <div className="card__head">
        <h2 id="breakdown-title" className="card__title">
          How this number is built
        </h2>
        <a href={BINANCE_FAQ_URL} target="_blank" rel="noreferrer" className="card__link">
          Binance FAQ
        </a>
      </div>
      {rows.length === 0 ? (
        <p className="empty-frame" data-testid="breakdown-empty">
          The working appears here once there is a result.
        </p>
      ) : (
        <>
          <dl className="breakdown__formulas">
            <div>
              <dt>Liquidation price</dt>
              <dd>
                (<V name="WB" anchor="wb" /> {MINUS} <V name="TMM1" anchor="tmm1" /> + <V name="UPNL1" anchor="upnl1" />{" "}
                + <V name="cumB" anchor="cumb" /> {MINUS} <V name="Side" anchor="side" /> ×{" "}
                <V name="Position" anchor="position" /> × <V name="EP" anchor="ep" />) ÷ (
                <V name="Position" anchor="position" /> × <V name="MMR" anchor="mmr" /> {MINUS}{" "}
                <V name="Side" anchor="side" /> × <V name="Position" anchor="position" />)
              </dd>
            </div>
            <div>
              <dt>Maintenance margin</dt>
              <dd>
                <V name="Position" anchor="position" /> × Mark × <V name="MMR" anchor="mmr" /> {MINUS}{" "}
                <V name="cumB" anchor="cumb" />
              </dd>
            </div>
          </dl>
          <table className="table breakdown__table">
            <thead>
              <tr>
                <th scope="col">Step</th>
                <th scope="col">With your inputs</th>
                <th scope="col" className="is-num">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.step} className={r.step === "Liquidation price" ? "is-answer" : undefined}>
                  <th scope="row">{r.step}</th>
                  <td className="breakdown__sub num">{r.substituted ?? ""}</td>
                  <td className="is-num num">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <p className="card__foot">
        Decimal math, shown to 2 places; the engine keeps full precision. Binance notes its own engine can differ
        slightly in the last decimal.
      </p>
    </section>
  );
}

"use client";

import Link from "next/link";
import type { Calculation } from "@/lib/calculate";
import { D } from "@/lib/engine";
import { formatFixed, formatInput, term } from "@/lib/format";
import { BINANCE_FAQ_URL } from "@/lib/presets";
import type { Scenario } from "@/lib/scenario";
import { ExternalLink } from "../external-link";

// PRD B-1 to B-3: every variable, the substituted numerator and denominator, then the result.

const MINUS = "−";

function Var({ name, anchor }: { name: string; anchor: string }) {
  return (
    <Link href={`/sources#var-${anchor}`} className="text-accent underline-offset-4 hover:underline">
      {name}
    </Link>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8">
      <h3 className="text-sm font-semibold leading-6">{label}</h3>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Worksheet({
  expression,
  substituted,
  result,
}: {
  expression: React.ReactNode;
  substituted: string;
  result: string;
}) {
  return (
    <div className="num flex flex-col gap-1.5 text-[14px] leading-6 [overflow-wrap:anywhere]">
      <p className="text-muted">{expression}</p>
      <p className="text-ink">{substituted}</p>
      <p className="font-semibold text-ink">= {result}</p>
    </div>
  );
}

export function Breakdown({ calc, scenario }: { calc: Calculation; scenario: Scenario }) {
  const { liq, mm, values, others } = calc;
  const hasResult = calc.status === "ready" || (calc.status === "partial" && mm);

  return (
    <section
      id="breakdown"
      aria-labelledby="breakdown-heading"
      className="mt-16 border-t border-line pt-12 md:mt-24"
      data-testid="breakdown"
    >
      <h2 id="breakdown-heading" className="text-[22px] font-semibold leading-7 tracking-tight">
        How this number is built
      </h2>
      <p className="mt-2 max-w-[65ch] text-[15px] leading-6 text-muted">
        Binance&apos;s one-way formula with your inputs substituted. Shown to 2 decimals, computed at full precision.
      </p>

      {!hasResult ? (
        <p className="mt-8 rounded-md bg-raised px-4 py-3 text-sm text-muted" data-testid="breakdown-empty">
          The breakdown appears once there&apos;s a result.
        </p>
      ) : (
        <div className="mt-4">
          {liq && (
            <Row label="Inputs">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {[
                  { name: "WB", anchor: "wb", value: formatInput(liq.terms.wb) },
                  { name: "TMM1", anchor: "tmm1", value: formatFixed(liq.terms.tmm) },
                  { name: "UPNL1", anchor: "upnl1", value: formatFixed(liq.terms.upnl) },
                  { name: "cumB", anchor: "cumb", value: formatInput(liq.terms.cum) },
                  { name: "Side", anchor: "side", value: liq.terms.side === 1 ? "1 (long)" : `${MINUS}1 (short)` },
                  { name: "Position", anchor: "position", value: formatInput(liq.terms.size) },
                  { name: "EP", anchor: "ep", value: formatInput(liq.terms.ep) },
                  { name: "MMR", anchor: "mmr", value: formatInput(liq.terms.mmr) },
                ].map((t) => (
                  <div key={t.name} className="flex flex-col gap-0.5">
                    <dt className="num text-[13px]">
                      <Var name={t.name} anchor={t.anchor} />
                    </dt>
                    <dd className="num text-[14px] [overflow-wrap:anywhere]">{t.value}</dd>
                  </div>
                ))}
              </dl>
            </Row>
          )}

          {liq && (
            <Row label="Other positions">
              {scenario.mode === "isolated" ? (
                <p className="text-sm leading-6 text-muted">Isolated margin: TMM1 and UPNL1 are 0.</p>
              ) : others.source === "totals" ? (
                <p className="text-sm leading-6 text-muted">Entered directly as totals.</p>
              ) : others.source === "none" ? (
                <p className="text-sm leading-6 text-muted">None entered, so TMM1 and UPNL1 are 0.</p>
              ) : (
                <OtherRows calc={calc} scenario={scenario} />
              )}
            </Row>
          )}

          {liq && (
            <Row label="Numerator">
              <Worksheet
                expression={
                  <>
                    WB {MINUS} TMM1 + UPNL1 + cumB {MINUS} Side × Position × EP
                  </>
                }
                substituted={`${formatInput(liq.terms.wb)} ${MINUS} ${term(formatFixed(liq.terms.tmm))} + ${term(formatFixed(liq.terms.upnl))} + ${formatInput(liq.terms.cum)} ${MINUS} ${term(String(liq.terms.side))} × ${formatInput(liq.terms.size)} × ${formatInput(liq.terms.ep)}`}
                result={formatFixed(liq.numerator)}
              />
            </Row>
          )}

          {liq && (
            <Row label="Denominator">
              <Worksheet
                expression={<>Position × MMR {MINUS} Side × Position</>}
                substituted={`${formatInput(liq.terms.size)} × ${formatInput(liq.terms.mmr)} ${MINUS} ${term(String(liq.terms.side))} × ${formatInput(liq.terms.size)}`}
                result={formatFixed(liq.denominator)}
              />
            </Row>
          )}

          {liq && (
            <Row label="Liquidation price">
              <Worksheet
                expression="Numerator ÷ Denominator"
                substituted={`${formatFixed(liq.numerator)} ÷ ${term(formatFixed(liq.denominator))}`}
                result={liq.kind === "price" ? formatFixed(liq.price) : "no liquidation price"}
              />
            </Row>
          )}

          {mm && values.size && values.mp && values.mmr && values.cum && (
            <Row label="Maintenance margin">
              <Worksheet
                expression={<>Position × Mark × MMR {MINUS} cumB</>}
                substituted={`${formatInput(values.size)} × ${formatInput(values.mp)} × ${formatInput(values.mmr)} ${MINUS} ${formatInput(values.cum)}`}
                result={formatFixed(mm)}
              />
            </Row>
          )}

          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <ExternalLink href={BINANCE_FAQ_URL}>Formula source: Binance FAQ</ExternalLink>
            <Link href="/sources" className="text-accent underline-offset-4 hover:underline">
              Every term, defined
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}

function OtherRows({ calc, scenario }: { calc: Calculation; scenario: Scenario }) {
  const filled = scenario.others.filter((o) => [o.size, o.ep, o.mp, o.mmr, o.cum].some((v) => v.trim() !== ""));
  return (
    <div className="flex flex-col gap-6">
      {calc.others.rows.map((row, i) => {
        const o = filled[i];
        const sign = o.side === "long" ? "1" : `${MINUS}1`;
        const n = (raw: string) => new D(raw.replace(/[,\s_]/g, ""));
        const [size, ep, mp, cum] = [o.size, o.ep, o.mp, o.cum].map((v) => formatInput(n(v)));
        const mmr = formatInput(n(o.mmr).dividedBy(100));
        return (
          <div key={i} className="flex flex-col gap-4">
            <p className="text-[13px] font-medium text-muted">
              Position {i + 1}, {o.side}
            </p>
            <Worksheet
              expression={<>UPNL = Side × Size × (Mark {MINUS} Entry)</>}
              substituted={`${term(sign)} × ${size} × (${mp} ${MINUS} ${ep})`}
              result={formatFixed(row.upnl)}
            />
            <Worksheet
              expression={<>MM = Size × Mark × MMR {MINUS} Amount</>}
              substituted={`${size} × ${mp} × ${mmr} ${MINUS} ${cum}`}
              result={formatFixed(row.mm)}
            />
          </div>
        );
      })}
      <div className="num flex flex-col gap-1 text-[14px] leading-6">
        <p>
          <Var name="TMM1" anchor="tmm1" /> = sum of MM ={" "}
          <span className="font-semibold">{formatFixed(calc.others.tmm)}</span>
        </p>
        <p>
          <Var name="UPNL1" anchor="upnl1" /> = sum of UPNL ={" "}
          <span className="font-semibold">{formatFixed(calc.others.upnl)}</span>
        </p>
      </div>
    </div>
  );
}

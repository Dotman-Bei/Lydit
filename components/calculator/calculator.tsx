"use client";

import { useMemo, useState } from "react";
import { calculate, othersShift } from "@/lib/calculate";
import type { Mode, Side } from "@/lib/engine";
import { formatFixed } from "@/lib/format";
import { PRESETS } from "@/lib/presets";
import { scenarioToParams, type Scenario } from "@/lib/scenario";
import { AnswerCard } from "./answer-card";
import { Breakdown } from "./breakdown";
import { CopyLinkButton } from "./copy-link";
import { Field, Segmented } from "./fields";
import { OtherPositions } from "./other-positions";

const clone = (s: Scenario): Scenario => ({ ...s, others: s.others.map((o) => ({ ...o })) });

export function Calculator({ initial }: { initial: Scenario }) {
  const [scenario, setScenario] = useState(() => clone(initial));
  const [touched, setTouched] = useState<ReadonlySet<string>>(() => new Set());
  const calc = useMemo(() => calculate(scenario, touched), [scenario, touched]);

  // PRD C-4: every change rewrites the URL, so the address bar is always the shareable scenario.
  const commit = (next: Scenario, touchedKey?: string) => {
    setScenario(next);
    if (touchedKey) setTouched((prev) => new Set(prev).add(touchedKey));
    window.history.replaceState(null, "", `?${scenarioToParams(next).toString()}`);
  };
  const update = (patch: Partial<Scenario>, touchedKey?: string) => commit({ ...scenario, ...patch }, touchedKey);
  const loadPreset = (preset: Scenario) => {
    setTouched(new Set());
    commit(clone(preset));
  };

  const shift = othersShift(calc);
  const finding = shift
    ? `Other cross positions bring liquidation ${formatFixed(shift.amount)} USDT ${shift.closer ? "closer to" : "further from"} mark.`
    : "Binance USDⓈ-M, one-way mode. Computed at full precision, shown to 2 decimals.";

  return (
    <>
      <header className="title-row">
        <div>
          <h1 className="title">Liquidation gauge</h1>
          <p className="subline" data-testid="finding">
            {finding}
          </p>
        </div>
        <div className="title-row__actions">
          <div className="examples" role="group" aria-label="Binance FAQ examples">
            <span className="examples__label">Binance examples</span>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.description}
                className="btn btn--secondary"
                onClick={() => loadPreset(p.scenario)}
                data-testid={`preset-${p.id}`}
              >
                {p.short}
              </button>
            ))}
          </div>
          <CopyLinkButton disabled={calc.status === "empty"} />
        </div>
      </header>

      {/* 12 columns × 80px + 11 gutters × 16px = 1136px inside the 1152px column (8px of air each side).
          Inputs take columns 1-7; the answer and its working take 8-12, so the working updates beside the inputs. */}
      <div className="calc-grid">
        <div className="calc-grid__side">
          <AnswerCard calc={calc} />
          <Breakdown calc={calc} scenario={scenario} />
        </div>

        <form className="card calc-grid__form" onSubmit={(e) => e.preventDefault()} noValidate>
          <section className="group" aria-labelledby="g-position">
            <h2 id="g-position" className="card__title">
              Position
            </h2>
            <div className="grid-2">
              <Segmented<Mode>
                legend="Margin mode"
                name="mode"
                testId="input-mode"
                value={scenario.mode}
                options={[
                  { value: "cross", label: "Cross" },
                  { value: "isolated", label: "Isolated" },
                ]}
                onChange={(mode) => update({ mode })}
              />
              <Segmented<Side>
                legend="Side"
                name="side"
                testId="input-side"
                value={scenario.side}
                options={[
                  { value: "long", label: "Long" },
                  { value: "short", label: "Short" },
                ]}
                onChange={(side) => update({ side })}
              />
            </div>
            <div className="grid-3">
              <Field
                name="size"
                label="Size"
                help="In coins, without a sign."
                testId="input-size"
                value={scenario.size}
                error={calc.errors.size}
                onChange={(size) => update({ size }, "size")}
              />
              <Field
                name="ep"
                label="Entry price"
                unit="USDT"
                testId="input-ep"
                value={scenario.ep}
                error={calc.errors.ep}
                onChange={(ep) => update({ ep }, "ep")}
              />
              <Field
                name="mp"
                label="Mark price"
                unit="USDT"
                testId="input-mp"
                value={scenario.mp}
                error={calc.errors.mp}
                onChange={(mp) => update({ mp }, "mp")}
              />
            </div>
          </section>

          <section className="group" aria-labelledby="g-margin">
            <h2 id="g-margin" className="card__title">
              Margin
            </h2>
            <div className="grid-3">
              <Field
                name="wb"
                label="Wallet balance"
                help={scenario.mode === "cross" ? "Your cross wallet balance." : "Margin allocated to this position."}
                unit="USDT"
                testId="input-wb"
                value={scenario.wb}
                error={calc.errors.wb}
                onChange={(wb) => update({ wb }, "wb")}
              />
              <Field
                name="mmr"
                label="Maintenance rate"
                help="Your tier's rate."
                unit="%"
                testId="input-mmr"
                value={scenario.mmr}
                error={calc.errors.mmr}
                onChange={(mmr) => update({ mmr }, "mmr")}
              />
              <Field
                name="cum"
                label="Maintenance amount"
                help="Your tier's cumB."
                unit="USDT"
                testId="input-cum"
                value={scenario.cum}
                error={calc.errors.cum}
                onChange={(cum) => update({ cum }, "cum")}
              />
            </div>
          </section>

          <section className="group" aria-labelledby="g-others">
            <h2 id="g-others" className="card__title">
              Other cross positions
            </h2>
            <p className="group__intro">Their losses and margin share your cross balance, so they move this price.</p>
            <OtherPositions scenario={scenario} calc={calc} update={update} />
          </section>
        </form>
      </div>
    </>
  );
}

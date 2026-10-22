"use client";

import { useMemo, useRef, useState } from "react";
import { calculate } from "@/lib/calculate";
import type { Mode, Side } from "@/lib/engine";
import { PRESETS } from "@/lib/presets";
import { scenarioToParams, type Scenario } from "@/lib/scenario";
import { Breakdown } from "./breakdown";
import { Field, Group, Segmented } from "./fields";
import { MobileResultBar } from "./mobile-result-bar";
import { OtherPositions } from "./other-positions";
import { ResultPanel } from "./result-panel";

const clone = (s: Scenario): Scenario => ({ ...s, others: s.others.map((o) => ({ ...o })) });

export function Calculator({ initial, intro }: { initial: Scenario; intro: React.ReactNode }) {
  const [scenario, setScenario] = useState(() => clone(initial));
  const [touched, setTouched] = useState<ReadonlySet<string>>(() => new Set());
  const calc = useMemo(() => calculate(scenario, touched), [scenario, touched]);
  const panelRef = useRef<HTMLElement>(null);

  // PRD C-4: every change rewrites the URL so the address bar is always the shareable scenario.
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

  const wbHelp =
    scenario.mode === "cross"
      ? "Your cross wallet balance, in USDT."
      : "The margin allocated to this position, in USDT.";

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {intro}
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm font-medium" id="presets-label">
              Load a Binance FAQ example
            </p>
            <div
              role="group"
              aria-labelledby="presets-label"
              className="scrollbar-none -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            >
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.description}
                  onClick={() => loadPreset(p.scenario)}
                  data-testid={`preset-${p.id}`}
                  className="h-10 shrink-0 snap-start rounded-md border border-line bg-surface px-4 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent active:translate-y-px"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-[13px] leading-5 text-muted">
              Presets fill inputs only. Every output is computed by this build.
            </p>
          </div>

          <form className="mt-12 flex flex-col gap-12" onSubmit={(e) => e.preventDefault()} noValidate>
            <Group title="Position">
              <div className="grid gap-5 sm:grid-cols-2">
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
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="size"
                  label="Size"
                  help="In coins of the base asset, without a sign."
                  testId="input-size"
                  value={scenario.size}
                  error={calc.errors.size}
                  onChange={(size) => update({ size }, "size")}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="ep"
                  label="Entry price"
                  help="Your average entry, in USDT."
                  unit="USDT"
                  testId="input-ep"
                  value={scenario.ep}
                  error={calc.errors.ep}
                  onChange={(ep) => update({ ep }, "ep")}
                />
                <Field
                  name="mp"
                  label="Mark price"
                  help="Sets the maintenance margin and the distance to liquidation."
                  unit="USDT"
                  testId="input-mp"
                  value={scenario.mp}
                  error={calc.errors.mp}
                  onChange={(mp) => update({ mp }, "mp")}
                />
              </div>
            </Group>

            <Group title="Margin">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="wb"
                  label="Wallet balance"
                  help={wbHelp}
                  unit="USDT"
                  testId="input-wb"
                  value={scenario.wb}
                  error={calc.errors.wb}
                  onChange={(wb) => update({ wb }, "wb")}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="mmr"
                  label="Maintenance margin rate"
                  help="The rate for your position's tier, from Binance's margin table."
                  unit="%"
                  testId="input-mmr"
                  value={scenario.mmr}
                  error={calc.errors.mmr}
                  onChange={(mmr) => update({ mmr }, "mmr")}
                />
                <Field
                  name="cum"
                  label="Maintenance amount"
                  help="The tier's maintenance amount (cumB), in USDT."
                  unit="USDT"
                  testId="input-cum"
                  value={scenario.cum}
                  error={calc.errors.cum}
                  onChange={(cum) => update({ cum }, "cum")}
                />
              </div>
            </Group>

            <OtherPositions scenario={scenario} errors={calc.errors} update={update} />
          </form>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-6">
            <ResultPanel calc={calc} ref={panelRef} />
          </div>
        </aside>
      </div>

      <Breakdown calc={calc} scenario={scenario} />
      <MobileResultBar calc={calc} panelRef={panelRef} />
    </>
  );
}

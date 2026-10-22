"use client";

import { Plus, X } from "@phosphor-icons/react";
import type { Side } from "@/lib/engine";
import { otherFieldKey } from "@/lib/calculate";
import { MAX_OTHERS, emptyOther, type OtherDraft, type Scenario } from "@/lib/scenario";
import { Field, Group, Segmented } from "./fields";

const SIDES: { value: Side; label: string }[] = [
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
];

interface Props {
  scenario: Scenario;
  errors: Record<string, string>;
  update: (patch: Partial<Scenario>, touchedKey?: string) => void;
}

export function OtherPositions({ scenario, errors, update }: Props) {
  if (scenario.mode === "isolated") {
    return (
      <Group title="Other cross positions">
        <p className="rounded-md bg-raised px-4 py-3 text-sm leading-6 text-muted" data-testid="others-isolated">
          Isolated margin ignores other positions. Switch to cross to add them.
        </p>
      </Group>
    );
  }

  const setOther = (index: number, patch: Partial<OtherDraft>, field?: string) => {
    const others = scenario.others.map((o, i) => (i === index ? { ...o, ...patch } : o));
    update({ others }, field ? otherFieldKey(index, field) : undefined);
  };

  return (
    <Group
      title="Other cross positions"
      intro="Their losses and margin share your cross balance, so they move this price. Leave this empty if it is your only position."
    >
      <Segmented
        legend="How to enter other positions"
        hideLegend
        name="other-input"
        testId="input-others"
        value={scenario.otherInput}
        options={[
          { value: "positions", label: "Enter positions" },
          { value: "totals", label: "Enter totals" },
        ]}
        onChange={(otherInput) => update({ otherInput })}
      />

      {scenario.otherInput === "totals" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="tmm"
            label="Maintenance margin of other positions (TMM1)"
            unit="USDT"
            testId="input-tmm"
            value={scenario.tmm}
            error={errors.tmm}
            onChange={(tmm) => update({ tmm }, "tmm")}
          />
          <Field
            name="upnl"
            label="Unrealized PnL of other positions (UPNL1)"
            help="Negative for a loss."
            unit="USDT"
            testId="input-upnl"
            value={scenario.upnl}
            error={errors.upnl}
            onChange={(upnl) => update({ upnl }, "upnl")}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {scenario.others.map((o, i) => (
            <div key={i} className="rounded-md border border-line p-4 sm:p-5" data-testid={`other-${i + 1}`}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold">Other position {i + 1}</h3>
                <button
                  type="button"
                  onClick={() => update({ others: scenario.others.filter((_, j) => j !== i) })}
                  data-testid={`other-${i + 1}-remove`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-muted transition-colors duration-150 hover:bg-raised hover:text-ink active:translate-y-px"
                >
                  <X size={14} aria-hidden />
                  Remove
                </button>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <div className="sm:col-span-2 xl:col-span-3">
                  <Segmented
                    legend="Side"
                    name={`o${i}-side`}
                    testId={`other-${i + 1}-side`}
                    value={o.side}
                    options={SIDES}
                    onChange={(side) => setOther(i, { side })}
                  />
                </div>
                <Field
                  name={`o${i}-size`}
                  label="Size"
                  testId={`other-${i + 1}-size`}
                  value={o.size}
                  error={errors[otherFieldKey(i, "size")]}
                  onChange={(size) => setOther(i, { size }, "size")}
                />
                <Field
                  name={`o${i}-ep`}
                  label="Entry price"
                  unit="USDT"
                  testId={`other-${i + 1}-ep`}
                  value={o.ep}
                  error={errors[otherFieldKey(i, "ep")]}
                  onChange={(ep) => setOther(i, { ep }, "ep")}
                />
                <Field
                  name={`o${i}-mp`}
                  label="Mark price"
                  unit="USDT"
                  testId={`other-${i + 1}-mp`}
                  value={o.mp}
                  error={errors[otherFieldKey(i, "mp")]}
                  onChange={(mp) => setOther(i, { mp }, "mp")}
                />
                <Field
                  name={`o${i}-mmr`}
                  label="Maintenance margin rate"
                  unit="%"
                  testId={`other-${i + 1}-mmr`}
                  value={o.mmr}
                  error={errors[otherFieldKey(i, "mmr")]}
                  onChange={(mmr) => setOther(i, { mmr }, "mmr")}
                />
                <Field
                  name={`o${i}-cum`}
                  label="Maintenance amount"
                  unit="USDT"
                  testId={`other-${i + 1}-cum`}
                  value={o.cum}
                  error={errors[otherFieldKey(i, "cum")]}
                  onChange={(cum) => setOther(i, { cum }, "cum")}
                />
              </div>
            </div>
          ))}

          {scenario.others.length < MAX_OTHERS && (
            <button
              type="button"
              onClick={() => update({ others: [...scenario.others, emptyOther()] })}
              data-testid="add-other"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-dashed border-line-strong px-4 text-sm font-medium text-ink transition-colors duration-150 hover:border-accent hover:text-accent active:translate-y-px sm:w-max"
            >
              <Plus size={16} aria-hidden />
              Add position
            </button>
          )}
        </div>
      )}
    </Group>
  );
}

"use client";

import { Plus, X } from "@phosphor-icons/react";
import { otherFieldKey, type Calculation } from "@/lib/calculate";
import type { Side } from "@/lib/engine";
import { D } from "@/lib/engine";
import { formatFixed, formatInput, term } from "@/lib/format";
import { MAX_OTHERS, emptyOther, normalizeNumber, type OtherDraft, type Scenario } from "@/lib/scenario";
import { Field, Segmented } from "./fields";

const SIDES: { value: Side; label: string }[] = [
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
];

interface Props {
  scenario: Scenario;
  calc: Calculation;
  update: (patch: Partial<Scenario>, touchedKey?: string) => void;
}

export function OtherPositions({ scenario, calc, update }: Props) {
  if (scenario.mode === "isolated") {
    return (
      <p className="well-note" data-testid="others-isolated">
        Isolated margin ignores other positions. Switch to cross to add them.
      </p>
    );
  }

  const { errors } = calc;
  const setOther = (index: number, patch: Partial<OtherDraft>, field?: string) => {
    const others = scenario.others.map((o, i) => (i === index ? { ...o, ...patch } : o));
    update({ others }, field ? otherFieldKey(index, field) : undefined);
  };

  // The engine skips fully blank rows, so computed rows line up with the filled positions in order.
  const isFilled = (o: OtherDraft) => [o.size, o.ep, o.mp, o.mmr, o.cum].some((v) => normalizeNumber(v) !== "");
  const rowIndex = scenario.others.map((o, i) =>
    isFilled(o) ? scenario.others.slice(0, i + 1).filter(isFilled).length - 1 : -1,
  );

  return (
    <div className="others">
      <Segmented
        legend="How to enter other positions"
        hideLegend
        name="other-input"
        testId="input-others"
        value={scenario.otherInput}
        options={[
          { value: "positions", label: "Positions" },
          { value: "totals", label: "Totals" },
        ]}
        onChange={(otherInput) => update({ otherInput })}
      />

      {scenario.otherInput === "totals" ? (
        <div className="grid-2">
          <Field
            name="tmm"
            label="Their maintenance margin (TMM1)"
            unit="USDT"
            testId="input-tmm"
            value={scenario.tmm}
            error={errors.tmm}
            onChange={(tmm) => update({ tmm }, "tmm")}
          />
          <Field
            name="upnl"
            label="Their unrealized PnL (UPNL1)"
            help="Negative for a loss."
            unit="USDT"
            testId="input-upnl"
            value={scenario.upnl}
            error={errors.upnl}
            onChange={(upnl) => update({ upnl }, "upnl")}
          />
        </div>
      ) : (
        <>
          {scenario.others.length === 0 && (
            <p className="well-note">No other positions. Add one if this cross wallet holds more than this position.</p>
          )}
          {scenario.others.map((o, i) => {
            const row =
              rowIndex[i] >= 0 && calc.others.source === "positions" ? calc.others.rows[rowIndex[i]] : undefined;
            return (
              <div key={i} className="other" data-testid={`other-${i + 1}`}>
                <div className="other__head">
                  <h4 className="other__title">Position {i + 1}</h4>
                  <Segmented
                    legend={`Side of position ${i + 1}`}
                    hideLegend
                    name={`o${i}-side`}
                    testId={`other-${i + 1}-side`}
                    value={o.side}
                    options={SIDES}
                    onChange={(side) => setOther(i, { side })}
                  />
                  <button
                    type="button"
                    className="btn btn--text"
                    onClick={() => update({ others: scenario.others.filter((_, j) => j !== i) })}
                    data-testid={`other-${i + 1}-remove`}
                  >
                    <X size={14} aria-hidden />
                    Remove
                  </button>
                </div>
                <div className="grid-5">
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
                    label="Entry"
                    testId={`other-${i + 1}-ep`}
                    value={o.ep}
                    error={errors[otherFieldKey(i, "ep")]}
                    onChange={(ep) => setOther(i, { ep }, "ep")}
                  />
                  <Field
                    name={`o${i}-mp`}
                    label="Mark"
                    testId={`other-${i + 1}-mp`}
                    value={o.mp}
                    error={errors[otherFieldKey(i, "mp")]}
                    onChange={(mp) => setOther(i, { mp }, "mp")}
                  />
                  <Field
                    name={`o${i}-mmr`}
                    label="Rate"
                    unit="%"
                    testId={`other-${i + 1}-mmr`}
                    value={o.mmr}
                    error={errors[otherFieldKey(i, "mmr")]}
                    onChange={(mmr) => setOther(i, { mmr }, "mmr")}
                  />
                  <Field
                    name={`o${i}-cum`}
                    label="Amount"
                    testId={`other-${i + 1}-cum`}
                    value={o.cum}
                    error={errors[otherFieldKey(i, "cum")]}
                    onChange={(cum) => setOther(i, { cum }, "cum")}
                  />
                </div>
                {row ? (
                  <dl className="other__working num">
                    <div>
                      <dt>Unrealized PnL</dt>
                      <dd>
                        {term(o.side === "long" ? "1" : "−1")} × {formatInput(new D(normalizeNumber(o.size)))} × (
                        {formatInput(new D(normalizeNumber(o.mp)))} {"−"} {formatInput(new D(normalizeNumber(o.ep)))})
                      </dd>
                      <dd className="other__value">{formatFixed(row.upnl)}</dd>
                    </div>
                    <div>
                      <dt>Maintenance margin</dt>
                      <dd>
                        {formatInput(new D(normalizeNumber(o.size)))} × {formatInput(new D(normalizeNumber(o.mp)))} ×{" "}
                        {formatInput(new D(normalizeNumber(o.mmr)).dividedBy(100))} {"−"}{" "}
                        {formatInput(new D(normalizeNumber(o.cum)))}
                      </dd>
                      <dd className="other__value">{formatFixed(row.mm)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="other__pending">Fill every field to include this position.</p>
                )}
              </div>
            );
          })}
          {scenario.others.length < MAX_OTHERS && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => update({ others: [...scenario.others, emptyOther()] })}
              data-testid="add-other"
            >
              <Plus size={14} aria-hidden />
              Add position
            </button>
          )}
        </>
      )}
    </div>
  );
}

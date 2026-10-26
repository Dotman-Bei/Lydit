import {
  D,
  distanceFromMark,
  liquidationPrice,
  maintenanceMargin,
  summarizeOthers,
  type Dec,
  type Distance,
  type LiquidationResult,
  type OtherPosition,
  type OtherPositionResult,
} from "./engine";
import { isNumeric, normalizeNumber, type Scenario } from "./scenario";

// Validation (PRD E-4) plus the glue between raw scenario strings and the engine.

type Rule = "positive" | "nonNegative" | "rate" | "any";

const RULE_MESSAGE: Record<Rule, string> = {
  positive: "Must be greater than 0.",
  nonNegative: "Can't be negative.",
  rate: "Must be at least 0% and below 100%.",
  any: "",
};

export const FIELD_LABEL = {
  size: "size",
  ep: "entry price",
  mp: "mark price",
  wb: "wallet balance",
  mmr: "maintenance margin rate",
  cum: "maintenance amount",
} as const;

type MainField = keyof typeof FIELD_LABEL;

const MAIN_RULES: Record<MainField, Rule> = {
  size: "positive",
  ep: "positive",
  mp: "positive",
  wb: "nonNegative",
  mmr: "rate",
  cum: "nonNegative",
};

const OTHER_RULES = {
  size: "positive",
  ep: "positive",
  mp: "positive",
  mmr: "rate",
  cum: "nonNegative",
} as const satisfies Record<string, Rule>;

type OtherField = keyof typeof OTHER_RULES;

export const otherFieldKey = (index: number, field: string) => `o${index + 1}-${field}`;

function check(raw: string, rule: Rule, touched: boolean, example: string): { value?: Dec; error?: string } {
  const n = normalizeNumber(raw);
  if (n === "") return touched ? { error: "Required." } : {};
  if (!isNumeric(n)) return { error: `Enter a number, like ${example}.` };
  const value = new D(n);
  const ok =
    rule === "positive"
      ? value.greaterThan(0)
      : rule === "nonNegative"
        ? value.greaterThanOrEqualTo(0)
        : rule === "rate"
          ? value.greaterThanOrEqualTo(0) && value.lessThan(100)
          : true;
  return ok ? { value } : { error: RULE_MESSAGE[rule] };
}

export type Status = "empty" | "invalid" | "partial" | "ready";

export interface OthersSummary {
  source: "positions" | "totals" | "none";
  rows: OtherPositionResult[];
  tmm: Dec;
  upnl: Dec;
}

export interface Calculation {
  status: Status;
  errors: Record<string, string>;
  /** Main fields still needed for a liquidation price, as readable labels. */
  missing: string[];
  /** Other positions (1-based) that are partly filled. */
  incompleteOthers: number[];
  mm?: Dec;
  liq?: LiquidationResult;
  /** The same position read alone (no other cross positions), when others were entered. */
  alone?: LiquidationResult;
  distance?: Distance;
  others: OthersSummary;
  /** The values the engine used, for the breakdown. */
  values: Partial<Record<MainField, Dec>>;
}

export function calculate(s: Scenario, touched: ReadonlySet<string> = new Set()): Calculation {
  const errors: Record<string, string> = {};
  const values: Partial<Record<MainField, Dec>> = {};

  (Object.keys(MAIN_RULES) as MainField[]).forEach((field) => {
    const r = check(s[field], MAIN_RULES[field], touched.has(field), field === "size" ? "3.5" : "1456.84");
    if (r.error) errors[field] = r.error;
    if (r.value) values[field] = field === "mmr" ? r.value.dividedBy(100) : r.value;
  });

  const cross = s.mode === "cross";
  const incompleteOthers: number[] = [];
  let others: OthersSummary = { source: "none", rows: [], tmm: new D(0), upnl: new D(0) };

  if (cross && s.otherInput === "totals") {
    const tmm = check(s.tmm, "nonNegative", false, "1250.5");
    const upnl = check(s.upnl, "any", false, "-420.75");
    if (tmm.error) errors.tmm = tmm.error;
    if (upnl.error) errors.upnl = upnl.error;
    others = { source: "totals", rows: [], tmm: tmm.value ?? new D(0), upnl: upnl.value ?? new D(0) };
  } else if (cross && s.others.length > 0) {
    const parsed: OtherPosition[] = [];
    s.others.forEach((o, i) => {
      const fields = Object.keys(OTHER_RULES) as OtherField[];
      const blank = fields.every((f) => normalizeNumber(o[f]) === "");
      if (blank) return;
      const got: Partial<Record<OtherField, Dec>> = {};
      fields.forEach((f) => {
        const key = otherFieldKey(i, f);
        const r = check(o[f], OTHER_RULES[f], touched.has(key), f === "size" ? "109.488" : "32481.98");
        if (r.error) errors[key] = r.error;
        if (r.value) got[f] = f === "mmr" ? r.value.dividedBy(100) : r.value;
      });
      if (fields.every((f) => got[f])) {
        parsed.push({ side: o.side, size: got.size!, ep: got.ep!, mp: got.mp!, mmr: got.mmr!, cum: got.cum! });
      } else {
        incompleteOthers.push(i + 1);
      }
    });
    others = { source: parsed.length > 0 ? "positions" : "none", ...summarizeOthers(parsed) };
  }

  const missing = (["size", "ep", "wb", "mmr", "cum"] as MainField[])
    .filter((f) => !values[f])
    .map((f) => FIELD_LABEL[f]);

  const anyInput =
    (Object.keys(MAIN_RULES) as MainField[]).some((f) => normalizeNumber(s[f]) !== "") ||
    s.others.some((o) => Object.keys(OTHER_RULES).some((f) => normalizeNumber(o[f as OtherField]) !== ""));

  const base = { errors, missing, incompleteOthers, others, values };

  if (Object.keys(errors).length > 0) return { ...base, status: "invalid" };
  if (!anyInput) return { ...base, status: "empty" };

  const { size, ep, mp, wb, mmr, cum } = values;
  const mm = size && mp && mmr && cum ? maintenanceMargin(size, mp, mmr, cum) : undefined;

  if (!size || !ep || !wb || !mmr || !cum || incompleteOthers.length > 0) {
    return { ...base, status: "partial", mm };
  }

  // Cross positions share one balance, so the other positions' margin and PnL belong in the formula (TMM1, UPNL1).
  const liq = liquidationPrice({
    mode: s.mode,
    side: s.side,
    size,
    ep,
    wb,
    mmr,
    cum,
    tmm: others.tmm,
    upnl: others.upnl,
  });
  const distance = liq.kind === "price" && mp ? distanceFromMark(s.side, liq.price, mp) : undefined;
  const hasOthers = s.mode === "cross" && (!others.tmm.isZero() || !others.upnl.isZero());
  const alone = hasOthers
    ? liquidationPrice({ mode: s.mode, side: s.side, size, ep, wb, mmr, cum, tmm: new D(0), upnl: new D(0) })
    : undefined;
  return { ...base, status: "ready", mm, liq, alone, distance };
}

/**
 * How far other cross positions move liquidation, from the two prices as displayed (2 decimals),
 * so the figure matches what a reader subtracts by hand. Positive: closer to mark.
 */
export function othersShift(calc: Calculation): { amount: Dec; closer: boolean } | undefined {
  if (calc.liq?.kind !== "price" || calc.alone?.kind !== "price" || !calc.values.mp) return undefined;
  const mark = calc.values.mp;
  const shown = calc.liq.price.toDecimalPlaces(2);
  const shownAlone = calc.alone.price.toDecimalPlaces(2);
  const gap = mark.minus(shownAlone).abs().minus(mark.minus(shown).abs());
  if (gap.isZero()) return undefined;
  return { amount: gap.abs(), closer: gap.greaterThan(0) };
}

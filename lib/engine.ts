import Decimal from "decimal.js";

// Pure Binance USDⓈ-M liquidation math, one-way mode. No network, no I/O.
// Holdout rule: no expected outputs live in this repo. Inputs in, numbers out.

export const D = Decimal.clone({ precision: 50, rounding: Decimal.ROUND_HALF_UP });
export type Dec = InstanceType<typeof D>;

export type Side = "long" | "short";
export type Mode = "cross" | "isolated";

export function sideSign(side: Side): 1 | -1 {
  return side === "long" ? 1 : -1;
}

/** MM = size × mark × MMR − maintenance amount */
export function maintenanceMargin(size: Dec, mark: Dec, mmr: Dec, cum: Dec): Dec {
  return size.times(mark).times(mmr).minus(cum);
}

/** UPNL = side × size × (mark − entry) */
export function unrealizedPnl(side: Side, size: Dec, entry: Dec, mark: Dec): Dec {
  return size.times(mark.minus(entry)).times(sideSign(side));
}

export interface OtherPosition {
  side: Side;
  size: Dec;
  ep: Dec;
  mp: Dec;
  mmr: Dec;
  cum: Dec;
}

export interface OtherPositionResult {
  upnl: Dec;
  mm: Dec;
}

export function summarizeOthers(others: OtherPosition[]) {
  const rows: OtherPositionResult[] = others.map((o) => ({
    upnl: unrealizedPnl(o.side, o.size, o.ep, o.mp),
    mm: maintenanceMargin(o.size, o.mp, o.mmr, o.cum),
  }));
  const tmm = rows.reduce((sum, r) => sum.plus(r.mm), new D(0));
  const upnl = rows.reduce((sum, r) => sum.plus(r.upnl), new D(0));
  return { rows, tmm, upnl };
}

export interface LiquidationInputs {
  mode: Mode;
  side: Side;
  size: Dec;
  ep: Dec;
  wb: Dec;
  mmr: Dec;
  cum: Dec;
  /** Maintenance margin of all other contracts. Ignored in isolated mode. */
  tmm: Dec;
  /** Unrealized PnL of all other contracts. Ignored in isolated mode. */
  upnl: Dec;
}

export type LiquidationResult =
  | { kind: "price"; price: Dec; numerator: Dec; denominator: Dec; terms: Terms }
  | { kind: "none"; reason: "denominator-zero" | "non-positive"; numerator: Dec; denominator: Dec; terms: Terms };

export interface Terms {
  wb: Dec;
  tmm: Dec;
  upnl: Dec;
  cum: Dec;
  side: 1 | -1;
  size: Dec;
  ep: Dec;
  mmr: Dec;
}

/**
 * LP = (WB − TMM1 + UPNL1 + cumB − Side × Position × EP) / (Position × MMR − Side × Position)
 */
export function liquidationPrice(input: LiquidationInputs): LiquidationResult {
  const isolated = input.mode === "isolated";
  const terms: Terms = {
    wb: input.wb,
    tmm: isolated ? new D(0) : input.tmm,
    upnl: isolated ? new D(0) : input.upnl,
    cum: input.cum,
    side: sideSign(input.side),
    size: input.size,
    ep: input.ep,
    mmr: input.mmr,
  };

  const numerator = terms.wb
    .minus(terms.tmm)
    .plus(terms.upnl)
    .plus(terms.cum)
    .minus(terms.size.times(terms.ep).times(terms.side));
  const denominator = terms.size.times(terms.mmr).minus(terms.size.times(terms.side));

  if (denominator.isZero()) {
    return { kind: "none", reason: "denominator-zero", numerator, denominator, terms };
  }
  const price = numerator.dividedBy(denominator);
  if (price.lessThanOrEqualTo(0)) {
    return { kind: "none", reason: "non-positive", numerator, denominator, terms };
  }
  return { kind: "price", price, numerator, denominator, terms };
}

export interface Distance {
  abs: Dec;
  pct: Dec;
  direction: "below" | "above";
  /** Mark has already crossed the liquidation price. */
  past: boolean;
}

export function distanceFromMark(side: Side, price: Dec, mark: Dec): Distance {
  const abs = mark.minus(price).abs();
  const pct = abs.dividedBy(mark).times(100);
  const direction = price.lessThan(mark) ? "below" : "above";
  const past = side === "long" ? price.greaterThanOrEqualTo(mark) : price.lessThanOrEqualTo(mark);
  return { abs, pct, direction, past };
}

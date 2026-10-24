import { describe, expect, it } from "vitest";
import { D, liquidationPrice, maintenanceMargin, sideSign, summarizeOthers, type Side } from "../lib/engine";

// Holdout rule (PRD §7.5): these tests check properties of the formula, never an expected price.
// The inputs are invented; Binance's published answers live only in the TestSprite suite.

type Input = Parameters<typeof liquidationPrice>[0];

const base = (over: Partial<Input> = {}): Input => ({
  mode: "cross",
  side: "long",
  size: new D(2),
  ep: new D(500),
  wb: new D(400),
  mmr: new D("0.02"),
  cum: new D(0),
  tmm: new D(0),
  upnl: new D(0),
  ...over,
});

function price(input: Input) {
  const r = liquidationPrice(input);
  if (r.kind !== "price") throw new Error(`expected a price, got ${r.reason}`);
  return r.price;
}

describe("liquidationPrice", () => {
  it("is where equity falls to maintenance margin", () => {
    for (const side of ["long", "short"] as Side[]) {
      const input = base({ side, tmm: new D(30), upnl: new D(-45), cum: new D(5) });
      const lp = price(input);
      const s = sideSign(side);
      const equity = input.wb.minus(input.tmm).plus(input.upnl).plus(lp.minus(input.ep).times(input.size).times(s));
      const mm = maintenanceMargin(input.size, lp, input.mmr, input.cum);
      expect(equity.minus(mm).abs().lessThan("1e-30")).toBe(true);
    }
  });

  it("moves a long's price down as the wallet grows", () => {
    expect(price(base({ wb: new D(600) })).lessThan(price(base({ wb: new D(400) })))).toBe(true);
  });

  it("moves a short's price up as the wallet grows", () => {
    const short = (wb: number) => price(base({ side: "short", wb: new D(wb) }));
    expect(short(600).greaterThan(short(400))).toBe(true);
  });

  it("puts a long below entry and a short above entry when the balance is positive", () => {
    expect(price(base()).lessThan(500)).toBe(true);
    expect(price(base({ side: "short" })).greaterThan(500)).toBe(true);
  });

  it("brings a long's price closer when other positions lose money or need margin", () => {
    const alone = price(base());
    expect(price(base({ upnl: new D(-50) })).greaterThan(alone)).toBe(true);
    expect(price(base({ tmm: new D(50) })).greaterThan(alone)).toBe(true);
  });

  it("ignores other positions in isolated mode", () => {
    const isolated = base({ mode: "isolated" });
    expect(price({ ...isolated, tmm: new D(50), upnl: new D(-50) }).equals(price(isolated))).toBe(true);
  });

  it("reports no price when the denominator is zero", () => {
    const r = liquidationPrice(base({ mmr: new D(1) }));
    expect(r.kind === "none" && r.reason).toBe("denominator-zero");
  });

  it("reports no price when the balance covers the whole position", () => {
    const r = liquidationPrice(base({ wb: new D(5000) }));
    expect(r.kind === "none" && r.reason).toBe("non-positive");
  });
});

describe("summarizeOthers", () => {
  it("adds up other positions' margin and PnL with their sides", () => {
    const sum = summarizeOthers([
      { side: "long", size: new D(1), ep: new D(100), mp: new D(90), mmr: new D("0.1"), cum: new D(1) },
      { side: "short", size: new D(2), ep: new D(50), mp: new D(40), mmr: new D("0.05"), cum: new D(0) },
    ]);
    // long: (90 − 100) × 1 = −10; short: −(40 − 50) × 2 = 20
    expect(sum.upnl.equals(10)).toBe(true);
    // 1 × 90 × 0.1 − 1 = 8; 2 × 40 × 0.05 − 0 = 4
    expect(sum.tmm.equals(12)).toBe(true);
  });
});

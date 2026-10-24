import { describe, expect, it } from "vitest";
import { calculate } from "../lib/calculate";
import { PRESETS } from "../lib/presets";
import { emptyScenario, normalizeNumber, scenarioFromParams, scenarioToParams, type Scenario } from "../lib/scenario";

// Holdout rule (PRD §7.5): validation, link round trips and states only. No expected prices.

const filled = (over: Partial<Scenario> = {}): Scenario => ({
  ...emptyScenario(),
  size: "2",
  ep: "500",
  mp: "490",
  wb: "400",
  mmr: "2",
  cum: "0",
  ...over,
});

describe("scenario links", () => {
  it("restore every preset exactly", () => {
    for (const preset of PRESETS) {
      const back = scenarioFromParams(scenarioToParams(preset.scenario));
      expect(back).toEqual(preset.scenario);
    }
  });

  it("carry rates as fractions and show them as percents", () => {
    const params = scenarioToParams(filled({ mmr: "2.5" }));
    expect(params.get("mmr")).toBe("0.025");
    expect(scenarioFromParams(params).mmr).toBe("2.5");
  });

  it("read totals mode when only tmm and upnl are given", () => {
    const s = scenarioFromParams(new URLSearchParams("mode=cross&tmm=10&upnl=-5"));
    expect(s.otherInput).toBe("totals");
  });

  it("drop grouping commas and spaces", () => {
    expect(normalizeNumber("1,535 443.01")).toBe("1535443.01");
  });
});

describe("calculate", () => {
  it("is empty with no input", () => {
    expect(calculate(emptyScenario()).status).toBe("empty");
  });

  it("is ready with every field", () => {
    expect(calculate(filled()).status).toBe("ready");
  });

  it("rejects a negative size and a rate of 100% or more, with no result", () => {
    const c = calculate(filled({ size: "-1", mmr: "120" }));
    expect(c.status).toBe("invalid");
    expect(c.errors.size).toBe("Must be greater than 0.");
    expect(c.errors.mmr).toBe("Must be at least 0% and below 100%.");
    expect(c.liq).toBeUndefined();
  });

  it("asks for a cleared field and shows no price", () => {
    const c = calculate(filled({ ep: "" }), new Set(["ep"]));
    expect(c.errors.ep).toBe("Required.");
    expect(c.liq).toBeUndefined();
  });

  it("waits for a missing field without an error until it is touched", () => {
    const c = calculate(filled({ wb: "" }));
    expect(c.status).toBe("partial");
    expect(c.errors.wb).toBeUndefined();
    expect(c.liq).toBeUndefined();
  });

  it("names text that is not a number", () => {
    expect(calculate(filled({ wb: "abc" })).errors.wb).toMatch(/^Enter a number/);
  });
});

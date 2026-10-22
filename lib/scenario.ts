import { D, type Mode, type Side } from "./engine";

// A scenario is every calculator input as the raw strings the user typed.
// It round-trips through the URL query string (PRD U-1 to U-3).

export const MAX_OTHERS = 5;

export interface OtherDraft {
  side: Side;
  size: string;
  ep: string;
  mp: string;
  /** Percent, as typed. The URL stores a fraction. */
  mmr: string;
  cum: string;
}

export type OtherInput = "positions" | "totals";

export interface Scenario {
  mode: Mode;
  side: Side;
  size: string;
  ep: string;
  mp: string;
  wb: string;
  /** Percent, as typed. The URL stores a fraction. */
  mmr: string;
  cum: string;
  otherInput: OtherInput;
  others: OtherDraft[];
  tmm: string;
  upnl: string;
}

export const emptyOther = (): OtherDraft => ({ side: "long", size: "", ep: "", mp: "", mmr: "", cum: "" });

export const emptyScenario = (): Scenario => ({
  mode: "cross",
  side: "long",
  size: "",
  ep: "",
  mp: "",
  wb: "",
  mmr: "",
  cum: "",
  otherInput: "positions",
  others: [],
  tmm: "",
  upnl: "",
});

/** Drops grouping commas and spaces so "1,535,443.01" and "1535443.01" are the same input. */
export function normalizeNumber(raw: string): string {
  return raw.replace(/[,\s_]/g, "");
}

const NUMBER = /^-?(\d+\.?\d*|\.\d+)$/;

export function isNumeric(raw: string): boolean {
  return NUMBER.test(normalizeNumber(raw));
}

function percentToFraction(raw: string): string {
  const n = normalizeNumber(raw);
  return isNumeric(n) ? new D(n).dividedBy(100).toFixed() : n;
}

function fractionToPercent(raw: string): string {
  const n = normalizeNumber(raw);
  return isNumeric(n) ? new D(n).times(100).toFixed() : n;
}

type Params = Pick<URLSearchParams, "get" | "has">;

export function scenarioFromParams(params: Params): Scenario {
  const s = emptyScenario();
  const get = (key: string) => params.get(key) ?? "";

  if (get("mode") === "isolated") s.mode = "isolated";
  if (get("side") === "short") s.side = "short";
  s.size = get("size");
  s.ep = get("ep");
  s.mp = get("mp");
  s.wb = get("wb");
  s.mmr = params.has("mmr") ? fractionToPercent(get("mmr")) : "";
  s.cum = get("cum");
  s.tmm = get("tmm");
  s.upnl = get("upnl");

  for (let i = 1; i <= MAX_OTHERS; i++) {
    const keys = ["side", "size", "ep", "mp", "mmr", "cum"].map((k) => `o${i}${k}`);
    if (!keys.some((k) => params.has(k))) continue;
    s.others.push({
      side: get(`o${i}side`) === "short" ? "short" : "long",
      size: get(`o${i}size`),
      ep: get(`o${i}ep`),
      mp: get(`o${i}mp`),
      mmr: params.has(`o${i}mmr`) ? fractionToPercent(get(`o${i}mmr`)) : "",
      cum: get(`o${i}cum`),
    });
  }

  if (s.others.length === 0 && (params.has("tmm") || params.has("upnl"))) {
    s.otherInput = "totals";
  }
  return s;
}

export function scenarioToParams(s: Scenario): URLSearchParams {
  const p = new URLSearchParams();
  const put = (key: string, raw: string) => {
    const n = normalizeNumber(raw);
    if (n !== "") p.set(key, n);
  };

  p.set("venue", "binance");
  p.set("mode", s.mode);
  p.set("side", s.side);
  put("size", s.size);
  put("ep", s.ep);
  put("mp", s.mp);
  put("wb", s.wb);
  put("mmr", s.mmr === "" ? "" : percentToFraction(s.mmr));
  put("cum", s.cum);

  if (s.otherInput === "totals") {
    put("tmm", s.tmm);
    put("upnl", s.upnl);
  } else {
    s.others.slice(0, MAX_OTHERS).forEach((o, idx) => {
      const i = idx + 1;
      p.set(`o${i}side`, o.side);
      put(`o${i}size`, o.size);
      put(`o${i}ep`, o.ep);
      put(`o${i}mp`, o.mp);
      put(`o${i}mmr`, o.mmr === "" ? "" : percentToFraction(o.mmr));
      put(`o${i}cum`, o.cum);
    });
  }
  return p;
}

export function scenarioHref(s: Scenario, path = "/"): string {
  return `${path}?${scenarioToParams(s).toString()}`;
}

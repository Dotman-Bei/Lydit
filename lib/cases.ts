import { getPreset } from "./presets";
import { scenarioHref } from "./scenario";

// The golden suite as listed for humans (PRD 10.3, P-6). Names, what each checks and links only:
// expected values live in the TestSprite suite, never here.

export type CaseKind = "Tripwire" | "Published" | "Derived" | "Behaviour";

export interface GoldenCase {
  id: string;
  name: string;
  checks: string;
  kind: CaseKind;
  /** Where the case starts, when its inputs are Binance's own (or the build route). */
  href?: string;
}

const eth = scenarioHref(getPreset("eth-cross").scenario);
const btc = scenarioHref(getPreset("btc-cross").scenario);
const ex1 = scenarioHref(getPreset("mm-example-1").scenario);

export const GOLDEN_CASES: GoldenCase[] = [
  {
    id: "G-0",
    name: "Build identity",
    checks: "A real commit SHA, and the preview environment on PR runs",
    kind: "Tripwire",
    href: "/api/build",
  },
  { id: "G-1", name: "Example 1, BTCUSDT", checks: "Maintenance margin", kind: "Published", href: ex1 },
  { id: "G-2", name: "Example 2, ETHUSDT cross long", checks: "Liquidation price", kind: "Published", href: eth },
  { id: "G-3", name: "Example 2, ETHUSDT cross long", checks: "Maintenance margin", kind: "Published", href: eth },
  { id: "G-4", name: "Example 2, BTCUSDT cross long", checks: "Liquidation price", kind: "Published", href: btc },
  { id: "G-5", name: "Example 2, BTCUSDT cross long", checks: "Maintenance margin", kind: "Published", href: btc },
  { id: "D-1", name: "Isolated long", checks: "Liquidation price", kind: "Derived" },
  { id: "D-2", name: "Isolated short", checks: "Liquidation price", kind: "Derived" },
  { id: "D-3", name: "Cross short", checks: "Liquidation price", kind: "Derived" },
  { id: "D-4", name: "Cross, single position", checks: "Liquidation price", kind: "Derived" },
  { id: "D-5", name: "Tier boundary", checks: "Liquidation price after a rate and amount change", kind: "Derived" },
  { id: "D-6", name: "Invalid input", checks: "A field error and no result", kind: "Behaviour" },
  { id: "D-7", name: "Balance covers the position", checks: "The no-liquidation state", kind: "Behaviour" },
  { id: "D-8", name: "Copied link", checks: "The same inputs and outputs restored", kind: "Behaviour" },
  { id: "D-9", name: "ETH preset", checks: "Every input filled and a result computed", kind: "Behaviour" },
  { id: "D-10", name: "Proof page", checks: "The served commit and a check status", kind: "Behaviour" },
];

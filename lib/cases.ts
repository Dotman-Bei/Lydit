import { getPreset } from "./presets";
import { scenarioHref } from "./scenario";

// The golden suite as listed for humans (PRD 10.3, P-6). Names and links only:
// expected values live in the TestSprite suite, never here.

export interface PublishedScenario {
  title: string;
  summary: string;
  href: string;
  hrefLabel: string;
  fromFaq: boolean;
  checks: { id: string; what: string }[];
}

export const PUBLISHED_SCENARIOS: PublishedScenario[] = [
  {
    title: "Build identity tripwire",
    summary: "Runs first. A login wall or a stale deploy fails here in one step instead of across the suite.",
    href: "/api/build",
    hrefLabel: "Open /api/build",
    fromFaq: false,
    checks: [{ id: "G-0", what: "Real commit SHA, preview on PR runs" }],
  },
  {
    title: "Maintenance margin, Example 1",
    summary: "10 BTCUSDT at a mark of 26,000, 1% rate, 1,300 maintenance amount.",
    href: scenarioHref(getPreset("mm-example-1").scenario),
    hrefLabel: "Open scenario",
    fromFaq: true,
    checks: [{ id: "G-1", what: "Maintenance margin" }],
  },
  {
    title: "ETHUSDT cross long, Example 2",
    summary: "3,683.979 ETH long from 1,456.84, sharing a cross wallet with the account's BTC long.",
    href: scenarioHref(getPreset("eth-cross").scenario),
    hrefLabel: "Open scenario",
    fromFaq: true,
    checks: [
      { id: "G-2", what: "Liquidation price" },
      { id: "G-3", what: "Maintenance margin" },
    ],
  },
  {
    title: "BTCUSDT cross long, Example 2",
    summary: "109.488 BTC long from 32,481.98, sharing a cross wallet with the account's ETH long.",
    href: scenarioHref(getPreset("btc-cross").scenario),
    hrefLabel: "Open scenario",
    fromFaq: true,
    checks: [
      { id: "G-4", what: "Liquidation price" },
      { id: "G-5", what: "Maintenance margin" },
    ],
  },
];

export const DERIVED_CASES = [
  { id: "D-1", title: "Isolated long" },
  { id: "D-2", title: "Isolated short" },
  { id: "D-3", title: "Cross short" },
  { id: "D-4", title: "Cross, single position" },
  { id: "D-5", title: "Tier boundary, with a changed rate and maintenance amount" },
];

export const BEHAVIOUR_CASES = [
  { id: "D-6", title: "Invalid input shows a field error and no result" },
  { id: "D-7", title: "A balance that covers the position shows no liquidation price" },
  { id: "D-8", title: "A copied link restores the same inputs and outputs" },
  { id: "D-9", title: "The ETH preset fills every input and computes" },
  { id: "D-10", title: "The proof page shows the commit and a check status" },
];

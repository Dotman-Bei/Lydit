import { emptyScenario, type Scenario } from "./scenario";

// Binance FAQ inputs only (PRD C-2). Presets never carry outputs; the engine computes every number.
// Source: https://www.binance.com/en/support/faq/how-to-calculate-liquidation-price-of-usd%E2%93%A2-m-futures-contracts-b3c689c1f50a44cabb3a84e663b81d93

export const BINANCE_FAQ_URL =
  "https://www.binance.com/en/support/faq/how-to-calculate-liquidation-price-of-usd%E2%93%A2-m-futures-contracts-b3c689c1f50a44cabb3a84e663b81d93";

// Example 2 is one cross account holding both positions; each preset views it from one side.
const ETH = { size: "3683.979", ep: "1456.84", mp: "1335.18", mmr: "10", cum: "135365" };
const BTC = { size: "109.488", ep: "32481.98", mp: "31967.27", mmr: "2.5", cum: "16300" };
const CROSS_WALLET = "1535443.01";

export interface Preset {
  id: "eth-cross" | "btc-cross" | "mm-example-1";
  label: string;
  /** Button label in the calculator's examples control. */
  short: string;
  description: string;
  scenario: Scenario;
}

export const PRESETS: Preset[] = [
  {
    id: "eth-cross",
    label: "ETH long, cross",
    short: "ETH long",
    description: "Example 2, ETHUSDT, with the account's BTC position as the other cross position.",
    scenario: {
      ...emptyScenario(),
      ...ETH,
      wb: CROSS_WALLET,
      others: [{ side: "long", ...BTC }],
    },
  },
  {
    id: "btc-cross",
    label: "BTC long, cross",
    short: "BTC long",
    description: "Example 2, BTCUSDT, with the account's ETH position as the other cross position.",
    scenario: {
      ...emptyScenario(),
      ...BTC,
      wb: CROSS_WALLET,
      others: [{ side: "long", ...ETH }],
    },
  },
  {
    id: "mm-example-1",
    label: "Maintenance margin only",
    short: "Example 1",
    description: "Example 1, BTCUSDT: size, mark price, rate and maintenance amount.",
    scenario: {
      ...emptyScenario(),
      size: "10",
      mp: "26000",
      mmr: "1",
      cum: "1300",
    },
  },
];

export function getPreset(id: Preset["id"]): Preset {
  return PRESETS.find((p) => p.id === id)!;
}

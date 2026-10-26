# Lydit

**A Binance USDⓈ-M liquidation gauge that counts your other cross positions. No update goes live unless it reproduces Binance's own worked examples.**

| Case | Binance inputs | Binance's published answer | Lydit's live answer |
|---|---|---|---|
| Example 1, BTCUSDT | 10 BTC, mark 26,000, MMR 1%, maintenance amount 1,300 | MM **1,300** ([FAQ][faq]) | [Open in Lydit][ex1] |
| Example 2, ETHUSDT cross long | WB 1,535,443.01; size 3,683.979; EP 1,456.84; mark 1,335.18; MMR 10%; amount 135,365; BTC position held alongside | LP **1,153.26**, MM **356,512.51** ([FAQ][faq]) | [Open in Lydit][eth] |
| Example 2, BTCUSDT cross long | WB 1,535,443.01; size 109.488; EP 32,481.98; mark 31,967.27; MMR 2.5%; amount 16,300; ETH position held alongside | LP **26,316.89**, MM **71,200.81** ([FAQ][faq]) | [Open in Lydit][btc] |

The "Open in Lydit" links compute the answer live from the inputs in the link; nothing is stored.

- Live app: https://lydit.vercel.app
- Proof for the commit being served: https://lydit.vercel.app/proof
- The caught mistake (red, then green): https://github.com/Dotman-Bei/Lydit/pull/2
- The TestSprite run that passed the fix: https://www.testsprite.com/dashboard-v3/o/07da3028-9fb4-598c-bdf5-eea8b5e5f08b/projects/344af462-3655-49c8-847a-5ca8922987b1/execution/c757267f-ea18-4e5e-a238-6afc30add5c2

> No test file, fixture or source file in this repo holds an expected liquidation price; the answer key lives in the TestSprite suite, outside any PR.

## Why it exists

A calculator that reads each position alone tells a trader holding BTC and ETH in cross margin that the ETH long liquidates at **1,114.78**. Binance's own example for that account says **1,153.26**: the BTC position's unrealized loss and maintenance margin eat into the shared balance. That is about $38 of room the trader does not have. Lydit counts the other positions, shows its working, and is held to Binance's published numbers on every change.

## What the suite covers

The suite runs in TestSprite as frontend tests against each pull request's Vercel preview. Every check asserts one displayed number.

| ID | Kind | What it checks |
|---|---|---|
| G-0 | Tripwire | `/api/build` reports a real commit SHA, and `preview` on pull request runs |
| G-1 | Published | Example 1 maintenance margin |
| G-2, G-3 | Published | Example 2 ETHUSDT liquidation price and maintenance margin |
| G-4, G-5 | Published | Example 2 BTCUSDT liquidation price and maintenance margin |
| D-1 to D-5 | Derived | Isolated long and short, cross short with another position, cross single position, a tier with a maintenance amount |
| D-6, D-7 | Behaviour | Invalid input shows field errors and no result; a fully covered position shows "No liquidation price" |
| D-8, D-9 | Behaviour | A copied link restores the same inputs and outputs; the ETH preset fills every input |
| D-10 | Behaviour | The Proof page shows the served commit and a check status |

The portal's own generated tests (sources, navigation, validation) run alongside these.

## How the gate is wired

1. Every pull request gets a Vercel preview deployment.
2. The TestSprite GitHub App waits for that preview, runs the suite against it, posts a comment and a `TestSprite` check on the pull request.
3. "Block PR until tests pass" is on, and `main` requires the check, so a red check cannot merge.
4. Production deploys from `main`. Every page shows the commit it serves, and `/proof` reads that commit's TestSprite check from GitHub (`/api/proof`, cached for 60 seconds). It never shows "passed" unless GitHub says so.

The trigger listens for Vercel's status on commits of an open pull request. Vercel builds in under a minute, so a pull request opened after its first preview finished gets no run until its next push.

## The holdout rule

The expected numbers live only in the TestSprite suite. The repo holds the formula, Binance's inputs (as presets and links) and nothing else, so a coding agent that changes the formula cannot change the answer key in the same pull request. A wrong number fails the check instead of quietly passing.

## Formulas

One-way mode, from Binance's FAQ:

- Maintenance margin: `MM = size × mark × MMR − maintenance amount`
- Liquidation price: `LP = (WB − TMM1 + UPNL1 + cum − side × size × EP) / (size × MMR − side × size)`

`TMM1` and `UPNL1` are the other cross positions' maintenance margin and unrealized PnL; isolated margin sets both to zero. Every term is defined at https://lydit.vercel.app/sources. All money math uses exact decimals (decimal.js), never floating point.

## Run it locally

```bash
npm install
npm run dev
npm test   # formula properties, validation and link round trips; no expected prices
```

Optional environment variables:

| Name | Purpose |
|---|---|
| `GITHUB_TOKEN` | Read-only token for the check-runs API (raises the rate limit). Server only. |
| `NEXT_PUBLIC_REPO_URL` | Repository link shown on the site |
| `NEXT_PUBLIC_DEMO_PR_URL` | The red-then-green pull request |
| `NEXT_PUBLIC_TESTSPRITE_SUITE_URL` | The shared TestSprite suite |

## Sources

- Binance, How to calculate liquidation price of USDⓈ-M futures contracts: [FAQ][faq]
- TestSprite GitHub integration: https://docs.testsprite.com/web-portal/integrations/github-integration
- GitHub check runs API: https://docs.github.com/en/rest/checks/runs

Not covered: hedge mode, portfolio margin and other venues.

[faq]: https://www.binance.com/en/support/faq/how-to-calculate-liquidation-price-of-usd%E2%93%A2-m-futures-contracts-b3c689c1f50a44cabb3a84e663b81d93
[ex1]: https://lydit.vercel.app/gauge?venue=binance&mode=cross&side=long&size=10&mp=26000&mmr=0.01&cum=1300
[eth]: https://lydit.vercel.app/gauge?venue=binance&mode=cross&side=long&size=3683.979&ep=1456.84&mp=1335.18&wb=1535443.01&mmr=0.1&cum=135365&o1side=long&o1size=109.488&o1ep=32481.98&o1mp=31967.27&o1mmr=0.025&o1cum=16300
[btc]: https://lydit.vercel.app/gauge?venue=binance&mode=cross&side=long&size=109.488&ep=32481.98&mp=31967.27&wb=1535443.01&mmr=0.025&cum=16300&o1side=long&o1size=3683.979&o1ep=1456.84&o1mp=1335.18&o1mmr=0.1&o1cum=135365

# Lydit frontend spec

Companion to `prd.md`. The PRD says what must exist; this file says how it looks, reads and behaves. Built with the `design-taste-frontend` skill.

**Design read:** a single-purpose precision tool plus three explainer pages, for Binance perp traders and hackathon judges, with an assay-ledger language (exact numbers, visible provenance), leaning toward Next.js App Router + Tailwind v4 + Geist / Geist Mono + CSS-only motion.

The skill lists dense product UI as out of scope. Its typography, color, copy, layout-discipline and anti-slop rules apply to the whole site. The calculator form follows plain form patterns (label above, error below, no placeholder-as-label) instead of landing-page composition.

**Dials:** `DESIGN_VARIANCE 4` (a tool people read numbers from; offset, not artsy), `MOTION_INTENSITY 3` (motion only as feedback; numbers must never animate because TestSprite reads them), `VISUAL_DENSITY 6` (a working instrument, not a gallery).

---

## 1. Who it is for, and the one action per page

| Reader | What they came for |
|---|---|
| Binance USDⓈ-M perp trader | A liquidation price that matches Binance's engine, including other cross positions, and a link to share it. |
| Trading educator on X | A scenario link followers can open and recompute, stamped with the build it came from. |
| Hackathon judge | Evidence that the claim holds: Binance FAQ, scenario link, red-then-green PR, suite, proof line. |

| Page | The one action it drives |
|---|---|
| `/` Calculator | Enter a position (or load a Binance example) and read the liquidation price. Secondary: copy the scenario link. |
| `/proof` | Open a golden case's scenario and compare it with Binance's FAQ. |
| `/sources` | Check a formula term against Binance's FAQ. |
| `/how-it-works` | Open the demo PR. |
| 404 / error | Go back to the calculator. |

---

## 2. Visual direction

### Thesis
**Dark stone, one streak of gold.** Lydite is the touchstone: gold streaked on black stone and judged against reference needles it can't change. The interface is the stone (quiet, cool, neutral surfaces) and the only color that means "this is the number" is the gold streak. Everything else stays out of the way. The product is about exactness, so it looks like an instrument and not like a trading terminal.

### Palette
Tokens are CSS variables. Theme follows `prefers-color-scheme`, with a manual toggle stored per viewer (`data-theme` on `<html>`). One accent (gold). Pass and fail colors are semantic state, used only for check results and field errors.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0E0F10` | `#F2F3F4` | Page |
| `--surface` | `#15171A` | `#FAFAFB` | Panels (result, status) |
| `--surface-2` | `#1C1F23` | `#E9EBED` | Inputs, segmented track, code blocks |
| `--line` | `#2A2E33` | `#D5D9DD` | Dividers, input borders |
| `--line-strong` | `#3A3F45` | `#B5BBC1` | Hover borders |
| `--text` | `#ECEDEE` | `#121416` | Body, numbers |
| `--muted` | `#9CA3AB` | `#575E66` | Labels, help text, placeholders (AA on every surface) |
| `--accent` | `#D6B656` | `#7D5F10` | Gold streak, links, focus ring, active state |
| `--accent-solid` | `#D6B656` | `#7D5F10` | Primary button fill |
| `--on-accent` | `#0E0F10` | `#FAFAFB` | Text on primary button |
| `--pass` | `#4CB782` | `#1E7A4C` | Check passed |
| `--fail` | `#F2555A` | `#C0322F` | Check failed, field errors |

Why gold here: the skill bans brass/ochre as a default "premium" reach. This is not that. Gold on a touchstone is the literal mechanism the product is named after, so the accent carries meaning. It is a pale assay gold on cool stone greys, never on cream.

No pure black or white. No gradients, glows, glass, or shadows; elevation comes from surface tone and 1px lines. Focus ring: 2px `--accent`, 2px offset.

### Type (two families)
- **Geist** for all text. **Geist Mono** for every number, formula and SHA, with `tabular-nums`.
- Loaded with `next/font` (the `geist` package), self-hosted, `display: swap`.

| Role | Size / line-height | Weight |
|---|---|---|
| Page H1 | 32/38 mobile, 44/48 desktop, tracking -0.02em | 600 |
| Calculator H1 | 28/34 mobile, 36/42 desktop | 600 |
| H2 | 22/28 | 600 |
| Body | 16/26, max 65ch | 400 |
| Label | 14/20 | 500 |
| Help / meta | 13/20, `--muted` | 400 |
| Result number | Geist Mono 40/44 mobile, 52/56 desktop | 500 |
| Secondary numbers | Geist Mono 20/28 | 500 |

### Spacing
4px base. Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`. Field gap 8 (label/input/help), between fields 20, between form groups 32, between page sections 64 mobile / 96 desktop. Container `max-w-[1200px]`, side padding 16 mobile / 32 desktop. Header 64px.

### Shape
One radius: **6px** on every control, panel, chip and code block. No pills, no circles except icon glyphs.

### Motion rules
- CSS transitions only, on `transform` and `opacity`, `cubic-bezier(0.16, 1, 0.3, 1)`, 120 to 240ms.
- **Numbers never animate.** No count-ups, no tickers, no digit rolls. A number is either exact and final or absent. (TestSprite reads the DOM; an in-flight value is a wrong value.)
- When the liquidation price changes, the gold streak under it redraws (`scaleX` 0 to 1, 240ms). That is the only "something changed" signal.
- Copy link: icon swaps to a check and the label reads "Copied" for 1.6s.
- Buttons: `:active` moves down 1px.
- No scroll reveals, no page-load choreography, no marquee, no parallax.
- `prefers-reduced-motion: reduce` removes every transition.

### Icons
`@phosphor-icons/react`, regular weight, 16 or 20px. Used for: copy, check, external link, status glyphs (passed, failed, pending, unknown), theme toggle, add/remove position. Nothing decorative.

### Imagery
None. This is a tool; photography would be decoration and every external fetch breaks N-3. The one visual on `/how-it-works` is a real component: the engine computing Binance's ETH example live, with and without the other position. No fake PR screenshots; the page links the real PR.

---

## 3. Pages in build order

### 0. Shell (built with page 1)

**Header** (64px, static, not sticky)
- Left: the mark (a short horizontal gold bar, the streak, 14×4px, 6px radius) + wordmark "Lydit".
- Nav: `Calculator` · `Proof` · `Sources` · `How it works`. Active link in `--text` with a 2px gold underline; others `--muted`.
- Right: theme toggle (icon button, label "Switch to light theme" / "Switch to dark theme").

**Proof line** (every page, directly under the header, 40px, `--surface`, bottom line)
- Left: `Serving commit` + short SHA in mono (`proof-sha`), then environment: `production`, or `preview for PR #12` (`proof-env`, `proof-pr`).
- Right: status glyph + `TestSprite check:` + state (`proof-status`) + `View check` link (`proof-link`, only when a URL exists).
- States and copy:
  - passed: "passed" (`--pass`, check-circle)
  - failed: "failed" (`--fail`, x-circle)
  - pending: "running" (`--muted`, dashed circle)
  - not found: "no check for this commit" (`--muted`)
  - unavailable: "status unavailable" (`--muted`, question). Never "passed" on error (P-5).
  - loading: a skeleton bar the width of "passed" so the line doesn't shift.
  - local dev (no SHA): left reads "Local build. No commit to check." and the right side is hidden.

**Footer**
- One line: "Lydit checks Binance USDⓈ-M liquidation prices in one-way mode. It is a calculator, not advice; Binance's engine has the final word."
- Links: `Binance FAQ` (external), `Source on GitHub` (external).

### 1. `/` Calculator

**Intro** (left-aligned, compact so the form starts above the fold)
- H1: "Liquidation price, held to Binance's own answers"
- Sub: "Binance USDⓈ-M futures in one-way mode. Every release must reproduce Binance's worked examples before it ships."
- Preset row, label "Load a Binance FAQ example", buttons:
  - `ETH long, cross` (Example 2, ETHUSDT, with the BTC position as the other cross position, entered as position details)
  - `BTC long, cross` (Example 2, BTCUSDT, with the ETH position as the other)
  - `Maintenance margin only` (Example 1: size, mark, rate, amount)
- Help under presets: "Presets fill inputs only. Every output is computed by this build."

**Form** (left column on desktop)

Group "Position"
- Margin mode: segmented `Cross` / `Isolated` (`input-mode`)
- Side: segmented `Long` / `Short` (`input-side`)
- Size, help "In coins of the base asset, without a sign." (`input-size`)
- Entry price, help "Your average entry, in USDT." (`input-ep`)
- Mark price, help "Sets the maintenance margin and the distance to liquidation." (`input-mp`)

Group "Margin"
- Wallet balance, help in cross: "Your cross wallet balance, in USDT." In isolated: "The margin allocated to this position, in USDT." (`input-wb`)
- Maintenance margin rate (%), help "The rate for your position's tier, from Binance's margin table." (`input-mmr`)
- Maintenance amount, help "The tier's maintenance amount (cumB), in USDT." (`input-cum`)

Group "Other cross positions"
- Intro: "Their losses and margin share your cross balance, so they move this price. Leave this empty if it is your only position."
- Segmented: `Enter positions` / `Enter totals`
- Positions mode: one card per position (up to 5) with Side, Size, Entry price, Mark price, Maintenance margin rate (%), Maintenance amount. Buttons `Add position`, `Remove`. Test ids `other-1-size` etc.
- Totals mode: "Maintenance margin of other positions (TMM1)" (`input-tmm`), "Unrealized PnL of other positions (UPNL1)" with help "Negative for a loss." (`input-upnl`)
- In isolated mode the group collapses to: "Isolated margin ignores other positions. Switch to cross to add them." Its values are kept, not sent to the engine.

Field errors (E-4), below the input in `--fail`, input border turns `--fail`, `aria-invalid` + `aria-describedby`:
- not a number: "Enter a number, like 1456.84."
- size / entry / mark: "Must be greater than 0."
- rate: "Must be at least 0% and below 100%."
- amount, wallet balance: "Can't be negative."
- totals: "Enter a number, like -56354.57."

**Result panel** (right column, sticky on desktop)
- "Liquidation price" + `USDT`. Number alone in its element (`liq-price`). Gold streak under it.
- "Maintenance margin" (`maint-margin`), USDT.
- "Distance from mark": absolute (`distance-abs`) USDT and percent (`distance-pct`) %, then "below mark" / "above mark".
- `Copy link` button (`copy-link`), primary.
- Footnote: "Decimal math, shown to 2 places. Binance notes its engine can differ slightly in the last decimal."
- States:
  - empty: "Enter a position, or load an example above, to see where it liquidates." (`result-empty`)
  - partial: maintenance margin shows when size, mark, rate and amount are valid; the price slot reads "Add entry price and wallet balance to get a liquidation price." listing only what's missing.
  - invalid: "Fix the highlighted fields to get a result." No numbers shown (`result-invalid`).
  - no liquidation (E-3): heading "No liquidation price" (`no-liq`), reason either "The formula lands at zero or below: this balance covers the position at any price." or "The formula's denominator is zero for these inputs."
  - already past: warning under the price, "Mark price is already past this liquidation price."

**Breakdown** (full width under the form + result, `breakdown`)
- H2: "How this number is built"
- Sub: "Binance's one-way formula with your inputs substituted. Shown to 2 decimals, computed at full precision."
- Rows, each: label, expression in mono, substituted values, result right-aligned:
  - Inputs: WB, TMM1, UPNL1, cumB, Side, Position, EP, MMR (each term links to `/sources#var-…`)
  - Other positions (only when entered as positions): per position `UPNL = side × size × (mark − entry)` and `MM = size × mark × MMR − amount`, then the sums.
  - Numerator: `WB − TMM1 + UPNL1 + cumB − Side × Position × EP`
  - Denominator: `Position × MMR − Side × Position`
  - Liquidation price: numerator ÷ denominator
  - Maintenance margin: `size × mark × MMR − amount`
- Footer link: "Formula source: Binance FAQ".
- Hidden until there's a result; empty state text: "The breakdown appears once there's a result."

**Mobile result bar** (below 1024px only): fixed bottom bar, `--surface`, top line: "Liquidation price" + the number + `See result` (scrolls to the panel). No test ids (the panel owns them). Hidden when the result panel is in view.

### 2. `/proof`

- H1: "The check behind this build"
- Sub: "Which commit is serving you, and whether it passed TestSprite's golden suite."
- **Status panel** (`--surface`): Commit (full 40-char SHA, mono), Environment, Pull request (when preview), TestSprite check (glyph + state), Checked at (local time), primary button `Open the check` (external). Same states as the proof line. (`proof-page-sha`, `proof-page-status`)
- **Binance's published examples**: intro "Each case opens the inputs from Binance's FAQ. Open it, then compare with Binance's own page." Larger rows, each with name, what it asserts, and two links `Binance FAQ` and `Open scenario`:
  - Build identity tripwire: "Asserts a real commit SHA and the preview environment on PR runs." Link: `Open /api/build`.
  - Maintenance margin, Example 1: "Asserts the maintenance margin."
  - ETHUSDT cross long: "Asserts the liquidation price."
  - ETHUSDT cross long: "Asserts the maintenance margin."
  - BTCUSDT cross long: "Asserts the liquidation price."
  - BTCUSDT cross long: "Asserts the maintenance margin."
- **Derived edge cases** (compact two-column group): intro "Computed from the formula and labelled as derived in the suite. Their inputs live in the suite with their answers." Isolated long. Isolated short. Cross short. Cross, single position. Tier boundary.
- **Behaviour checks** (same compact group): Invalid input shows a field error and no result. No-liquidation state. Copied link restores the same inputs and outputs. Preset fills the ETH case. Proof page shows the commit and a check status.
- **Why the expected numbers aren't here**: "If the answers lived in this repo, one pull request could change the formula and the expected value together, and the check would stay green. They live in the TestSprite suite, which no pull request can edit. Search the repo: no source, test or fixture file holds an expected liquidation price."

### 3. `/sources`

- H1: "Formulas and sources"
- Sub: "Every term Lydit uses, where it comes from, and how a scenario link is built."
- **Maintenance margin**: `MM = position notional × MMR − maintenance amount`, `position notional = size × mark price`. Note "Binance FAQ, Example 1."
- **Liquidation price, one-way mode**: the formula as a two-line fraction in mono. Note "Hedge-mode terms are zero in one-way mode, so they're left out."
- **Variables** (each with an anchor `#var-wb` etc., two-column definition grid, not a ruled table): WB, TMM1, UPNL1, cumB, Side, Position, EP, MMR with the PRD meanings.
- **Other positions**: `UPNL = side × size × (mark − entry)`; MM as above; TMM1 and UPNL1 are the sums.
- **Scenario links**: "Every input is a query parameter. Opening the link restores the inputs and computes right away." Example URL in a code block with a copy button. Parameters grouped in three chunks (Position, Margin, Other positions), one soft divider each.
- **Not covered**: "Hedge mode, portfolio margin, fees, funding and other venues. Hyperliquid publishes formulas but no worked numbers, so there is nothing to hold it to yet."
- Primary link: `Read Binance's FAQ` (external).

### 4. `/how-it-works`

- H1: "The pull request can't grade itself"
- Sub: "Each PR preview must reproduce Binance's published answers. Those answers live in TestSprite, out of the PR's reach."
- CTAs: `Open the demo PR` (primary, external), `See the proof` (secondary, `/proof`).
- **Same account, two answers** (the live component): "Binance's ETH example shares its cross wallet with a BTC position. Drop that position, as a per-position calculator does, and the price moves." Two figures side by side: "With the BTC position, as Binance computes it" and "ETH position alone". Under them: "The single-position number puts liquidation {Δ} USDT ({pct}%) further away than it is." Caption: "Both numbers are computed live by this build from Binance's inputs." Links: `Open with BTC` / `Open without BTC` (scenario links). All numbers come from the engine at render; none are written in source.
- **From pull request to production** (vertical sequence, verb labels, no step numbers):
  - Open a pull request: "A person or a coding agent changes the math. Vercel builds a preview for that PR."
  - TestSprite tests the preview: "The GitHub App waits for the preview, then runs the golden suite against it in a browser."
  - A wrong number blocks the merge: "Each step checks one displayed number against Binance's published value. One mismatch fails the check."
  - The report drives the fix: "TestSprite's PR comment names the failing case and gives a fix prompt. The agent never holds a TestSprite key."
  - Green, then merge: "The check reruns on the fix commit. Once it passes, the PR can merge."
  - Production shows it: "The live app reads the check for the commit it serves and shows it on every page."
- **Where the answer key lives** (two columns, contrast):
  - "Tests in the repo": "The PR can edit the formula and the expected value in one diff. The check stays green."
  - "Holdout in TestSprite": "The expected values sit in the suite. The PR can only change code, so a wrong formula meets the old answer."
- **Check it yourself** (ordered trail of real links): Binance FAQ, ETH scenario on Lydit, `Open the demo PR`, TestSprite suite, search the repo, proof line on `/proof`. Links that don't exist yet (demo PR, suite) render as plain text "Linked once the PR is open." until their env var is set.
- **The name**: "Lydite is the touchstone. Assayers streaked gold on it next to reference needles of known purity, so the gold was judged against something it couldn't change."

### 5. 404 and error

- 404: H1 "No page at this address". Sub "The calculator is at the root." Button `Go to the calculator`.
- Error: H1 "This page failed to render". Sub "Lydit shows nothing rather than a wrong number. Try again, or start over from the calculator." Buttons `Try again`, `Go to the calculator`.

---

## 4. Components

| Component | Desktop (≥1024) | Mobile (<768; tablet follows mobile until 1024 unless noted) |
|---|---|---|
| Header | Logo, nav, toggle in one 64px row | Row 1: logo + toggle. Row 2: nav links in a horizontal scroll row (no hamburger; 4 links) |
| Proof line | One row, left/right split | Two short rows: commit + env, then status + link |
| Preset bar | Inline buttons after the label | Horizontal scroll-snap row |
| Segmented control | Inline, auto width | Full width, equal halves |
| Field (label, input, help, error) | Two fields per row inside a group where they pair (Entry/Mark, MMR/Amount) | One per row |
| Other-position card | Fields in a 3-column grid | Fields one per row; `Remove` in the card header |
| Result panel | Right column (5/12), `position: sticky; top: 24px` | In flow after the form; mobile result bar points to it |
| Mobile result bar | Hidden | Fixed bottom, shown when the panel is off-screen |
| Breakdown | Expression and result in a grid (label 180px, expression 1fr, result auto) | Stacked: label, expression (wraps at operators), result |
| Copy link | Button with icon + label | Full width |
| Status panel | Definition grid, 2 columns | 1 column |
| Case group | Published: rows with links right-aligned. Derived/behaviour: 2-column grid | All 1 column, links under the text |
| Flow sequence | Left: sticky heading. Right: sequence with a 1px rail | Rail on the left, heading above |
| Live comparison | Two figures side by side + delta row | Stacked |
| Code block | Mono, `--surface-2`, horizontal scroll inside the block only | Same; never widens the page |
| Theme toggle | Icon button | Same |

All interactive targets at least 40px tall on mobile. Inputs use `type="text" inputmode="decimal"` so the exact typed string round-trips through the URL.

---

## 5. Avoid

- Hero gradient blobs, glows, glassmorphism, AI purple, neon trading green/red.
- Crypto-terminal clichés: candlestick backgrounds, price tickers, "to the moon" copy.
- Animated or counting numbers anywhere.
- Three equal feature cards. The how-it-works flow is a sequence, not a card row.
- "Step 1 / Step 2" labels and numbered section eyebrows. Max one small uppercase label per three sections (the calculator uses none).
- Em-dashes and en-dashes in any visible copy. Use a period, comma, colon or parentheses.
- Fake screenshots of the PR, the TestSprite report or the app.
- Decorative status dots. Status glyphs only where they report real check state.
- "BETA", version numbers, or build strings other than the real commit in the proof line.
- Pills. One 6px radius everywhere.
- Placeholder text used as a label.
- Inter, serif display type, a third typeface.
- Filler verbs: elevate, seamless, unleash, next-gen, revolutionize.
- Any expected liquidation price or maintenance margin written in source, copy or fixtures (PRD §7). Numbers on screen come from the engine.

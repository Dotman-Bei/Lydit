# Lydit frontend spec

Companion to `prd.md`. The PRD says what must exist; this file says how it looks, reads and behaves. Built with the
`design-taste-frontend` skill (tasteskill v2): a page direction and an app style dealt by its draw script, adapted to
Lydit's subject, then checked in a real browser with its inspector.

## 0. Two kinds of screen

Lydit has two kinds of screen, built with one palette and one pair of typefaces.

| Route | Kind | Why |
|---|---|---|
| `/` Calculator | **App screen** | Worked in: inputs, a result, a breakdown. |
| `/proof` | **App screen** | The detail of one object: the build serving you. |
| `/how-it-works` | **Page** | Read and scrolled: the argument for the gate. |
| `/sources` | **Page** | Read and scrolled: formulas and references. |
| 404, error | Page | Small; follow the page rules. |

Dealt with `scripts/draw.mjs`:

- **Pages:** direction *Type and nothing else* (seed 751373261), sector finance. Redraw: the showcase section took
  *Two giant words compared* instead of *Headline you can type*, because Lydit's input is a whole position (eight
  fields), not one line of text, and its point is a comparison of two numbers.
- **App screens:** style *Achromatic ledger* (seed 1037972768), kind finance, palette and type kept from the pages.
  Redraw: the shell took *No sidebar* instead of *Open plane*, because Lydit has four destinations, two of them read
  pages with their own header, and the calculator needs the 230px a sidebar would take.

## 1. Who it is for, and the one action per page

| Reader | Came for |
|---|---|
| Binance USDⓈ-M perp trader | A liquidation price that matches Binance's engine, including other cross positions, and a link to share it. |
| Trading educator on X | A scenario link followers can open and recompute. |
| Hackathon judge | Proof the claim holds: Binance FAQ, scenario link, red-then-green PR, suite, proof line. |

| Screen | Its one question or action |
|---|---|
| `/` | "Where does this position liquidate, by Binance's formula?" Action: copy the scenario link. |
| `/proof` | "Did the build serving me pass the golden suite?" Action: open the check. |
| `/how-it-works` | Open the calculator. |
| `/sources` | Read Binance's FAQ. |
| 404, error | Open the calculator. |

## 2. Visual direction

### Thesis
**A gold streak on black stone.** Lydit is named after lydite, the touchstone: gold was drawn across black stone and
its streak laid beside streaks from reference needles of known purity. The pages are typographic set pieces on paper
and stone; wherever type or a number crosses onto the stone, it turns gold. The app screens are a quiet ledger in
ink, and the one hue on them is that same gold, on the liquidation price.

**The idea:** on these pages, Binance's published example becomes the reference needle, and this build's own answer
to it is set at display size for the visitor to compare.

**The live thing (how-it-works):** a BTC mark-price slider under Binance's ETH example. The liquidation price that
counts the BTC position follows the slider; the per-position number never moves. That is the cross-margin blind spot,
shown with the engine.

### Palette
The dealt palette (*Report blocks*: white ground, flat blocks of an accent, a pale field, a bright field and black)
kept its proportions and took its colours from the subject: black stone and its gold streak.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Paper: the page ground |
| `--surface` | `#f4f4f2` | One tone step: filled panels, inputs on pages |
| `--ink` | `#141414` | Lydite black: text, the stone field |
| `--muted` | `#5c5c5a` | Secondary text (6.7:1 on white) |
| `--accent` | `#c9a54a` | Gold: the page's action button (ink text on it) |
| `--accent-ink` | `#141414` | Text on gold |
| `--field-stone` / ink | `#141414` / `#f2f0ea` | Stone chapters: hero lower field, check-it table, footer |
| `--streak` | `#d4b25a` | Gold ink on stone (8.8:1) |
| `--field-gold` / ink | `#c9a54a` / `#141414` | The held-out answers chapter |
| `--field-pale` / ink | `#e3e5e0` / `#141414` | Pale stone chapters |
| `--data-gold` | `#8a6a12` | The app's one data hue on white (5:1) |

App tokens (achromatic ledger; colour under 1% of pixels):

| Token | Value |
|---|---|
| `--ground` | `#f4f4f2` |
| `--card` | `#ffffff` |
| `--well` | `#f7f7f5` |
| `--border` | `#e6e6e3` |
| `--rule` | `#efefec` |
| `--control` | `#cfd0cc` |
| `--text` / `--muted` / `--faint` | `#141414` / `#5c5c5a` / `#6b6b69` |
| `--primary` / ink | `#141414` / `#ffffff` (near-black primary button) |
| `--hue` | `#8a6a12` (the liquidation price and its strip) |
| `--positive` / `--negative` | `#247b50` / `#c4242a`, pills `#dcfae5`/`#04250e`, `#ffedea`/`#831c1e` |

No gradients, glows, glass or shadows at rest. Pages separate surfaces by tone and colour fields, never by lines;
app screens may use 1px borders and row rules (§13 of the app chapter).

### Type (two families)
- **Bodoni Moda** 500 (display): page headlines, statements, the two specimen figures, the formulas; on app screens
  one job only, the liquidation price figure.
- **Jost** 400/500 (text): everything else, including every app label, input and table, with tabular figures.
- Loaded with `next/font/google`.

| Role | Size |
|---|---|
| Page hero | clamp(56px, 9.5vw, 150px), capitals, leading 0.86, tracking -0.02em |
| Page specimen figures | fitted to half the width by measurement |
| Page section heading | 32–64px (`--step-head`) |
| Page statement | 36px desktop, 24px phone, at most three lines (four on a phone) |
| Page lead / body / small | 20–26 / 17–19 / 13–14px |
| App h1 | 24px Jost 600 |
| App answer figure | 36px Bodoni Moda (1.5× the 24px siblings) |
| App KPI / card title / body / label | 24 / 16 / 14 / 12–13px |

### Spacing
4px base. Pages: margin clamp(16px, 2.2vw, 32px), 12-column grid, section gaps up to 120px each side on desktop and 72px on a phone (a change
of field colour lets them close up). App: one gutter of 16px, card padding 20px, canvas column 1152px, title 32px
below the bar, controls 36px, inputs 40px, table rows 44px.

### Shape
App: tight radii, cards 8px, controls 6px, chips 4px. Pages: square corners on fields and buttons.

### Motion
- **Pages:** colour by chapter is the signature (each chapter a full-bleed field; the fixed corner navigation takes the
  ink of the field beneath it, 300ms). The hero's two lines rise from their masks on load (900ms, expo out, 110ms
  stagger), settled by 1.2s. Each section's parts enter once in reading order (heading, text, figure; 70ms apart,
  rising 24px). The held-out answers light one at a time (2s each, 400ms colour change). Press and hover feedback on
  every control.
- **App screens:** no entrances. Feedback only: press (140ms), hover (180ms), the copy button's "Copied". Numbers never
  animate: TestSprite reads the DOM, and an in-flight number is a wrong number.
- `prefers-reduced-motion: reduce` shows the finished page: no travel, no cycling.

## 3. Screens and sections, in build order

### 3.0 Shared

- **Mark:** a small black stone with one gold streak across it (drawn SVG, 18px), then "Lydit".
- **Proof line** (PRD P-1, P-2) on every screen: the served short SHA, the environment and the TestSprite result,
  linking to `/proof`. App screens: in the top bar's right cluster. Pages: in the corner navigation.
  States: passed, failed, running, no check for this commit, status unavailable (never "passed" on error),
  "local build" when there is no SHA.

### 3.1 `/` Calculator (app screen)

**Top bar** (48px, page ground, centred 1152px column): mark and name on the column's left edge; links Calculator,
Proof, Sources, How it works (14px, grey; current in ink); right cluster: the proof line. Phone: mark, proof glyph and
a Menu button that opens a full-screen sheet with the links.

**Title row:** h1 "Liquidation calculator". Subline (the finding, live): with other positions, "Other cross
positions bring liquidation {gap} USDT closer to mark."; otherwise "Binance USDⓈ-M, one-way mode. Computed at full
precision, shown to 2 decimals." Right: the Binance examples control ("ETH long", "BTC long", "Example 1") and the
primary button **Copy link**.

**Grid** (12 columns, 16px gutter, 12 × 80 + 11 × 16 = 1136 + 16px of side air in a 1152 column, written in the CSS):

- **Position card** (columns 1–7; built after review: each other position prints its own working, UPNL and MM with the inputs substituted, directly under its fields): groups "Position" (margin mode, side, size, entry price, mark price), "Margin"
  (wallet balance, maintenance margin rate %, maintenance amount) and "Other cross positions". Other positions are a
  real table: Side, Size, Entry, Mark, Rate %, Amount, then the computed UPNL and MM, and a remove action; "Add
  position" under it; a switch to enter TMM1 and UPNL1 as totals. Isolated mode: "Isolated margin ignores other
  positions. Switch to cross to add them."
- **Answer card** (columns 8–12, first in the right column; not sticky, because the working sits under it): "Liquidation price", the figure in Bodoni at 36px with "USDT" in grey; the
  **price strip** (the screen's own element): one axis with the mark price (ink dot), the entry (hollow ink tick), the
  liquidation price (the gold mark, joined to the mark price by the gold distance bar) and, when other positions
  exist, the liquidation price of this position alone (hollow grey tick, labelled "Alone"). Under it, two figures at
  24px: Maintenance margin, and Distance from mark with its percent and direction.
- **Breakdown card** (columns 8–12, under the answer, so the working updates beside the inputs): "How this number is
  built". The two formulas once, with every term linking to `/sources#var-…`, then two-line rows (step and value, then
  the substitution): TMM1, UPNL1, Numerator, Denominator, Liquidation price, Maintenance margin. Link: "Binance FAQ".

**States:** empty ("Enter a position, or load one of Binance's examples."), partial (maintenance margin shown; the
price says what is missing: "Add entry price and wallet balance to get a liquidation price."), invalid ("Fix the
highlighted fields to get a result.", no figures), no liquidation ("No liquidation price" and the reason), already past
("Mark price is already past this liquidation price."). Field errors under the field (PRD E-4). Copy link: "Copied",
or a selectable field if the clipboard is blocked.

**Test ids** (PRD C-6, C-7) are kept exactly: `liq-price`, `maint-margin`, `distance-abs`, `distance-pct`, `input-*`,
`preset-*`, `copy-link`, `no-liq`, `result-*`, `other-n-*`.

**Phone:** the bar folds as above; title, examples and Copy link; the answer card comes first (it is the question),
then the position card, then the breakdown as two-line rows; the other-positions table becomes one card per position.

### 3.2 `/proof` (app screen)

Same bar. h1 "Proof". Subline: "Commit {short} {env}."

- **Status card** (columns 1–5): "TestSprite check", a short result word in Bodoni at 36px with its glyph (Passed,
  Failed, Running, No check yet, Unknown, Local build), one sentence on what it means, when it was checked, and the
  action pinned at its foot: **Open the check** (or "How the gate works" when no check exists).
- **Build card** (columns 6–12): key-value rows: Commit (full SHA, monospace as an ID), Environment, Pull request,
  Branch, Checked at.
- **Golden suite** (columns 1–12): the 16 cases as a table: ID, Case, What it checks, Kind (Published, Derived,
  Behaviour as pale pills), Open (scenario link where the inputs are Binance's own). Expected values never appear.
- **Holdout note**: "If the answers lived in this repo, one pull request could change the formula and the expected
  value together, and the check would stay green. They live in the TestSprite suite, which no pull request can edit.
  Search the repo: no source, test or fixture file holds an expected liquidation price."

Phone: status first, build rows, then the suite as two-line rows (case on line 1; ID, kind and link on line 2).

### 3.3 `/how-it-works` (page)

Corner navigation: "Lydit" top-left; top-right "Sources", the proof line, and the action **Open the calculator**.

1. **Hero, headline across two fields.** Paper above, stone below, meeting at half height. h1 in capitals:
   "HELD TO / THE ANSWER", centred across the seam: ink on paper, gold where it crosses onto the stone. Supporting
   sentence on the stone: "A Binance futures liquidation calculator. No release merges unless it reproduces Binance's
   own worked examples."
2. **Same account, two answers** (paper). Paragraph: "Binance's Example 2 is one cross wallet holding an ETH long and
   a BTC long. The BTC position's loss and margin eat into the shared balance, so the ETH long liquidates sooner. A
   calculator that reads one position at a time misses it." Two specimen figures, computed live: "ETH long, as Binance
   computes it" and "ETH long, read alone", captioned under the figures (captions above read as labels), cut only
   below the comma's tail so every character reads. The live thing: a BTC mark-price slider with its value and "Reset to
   Binance's 31,967.27"; a line "Reading the ETH long alone shows {gap} USDT more room than the account has." Rate and
   maintenance amount stay at Example 2's values.
3. **From pull request to merge** (pale stone), a call-and-response column:
   - "First, a pull request changes the math." Call: `simplify: compute liquidation per position`. Response: the
     preview's answer card showing the per-position number, and its proof line reading "failed".
   - "Then TestSprite opens Binance's example on the preview." Call: "Open the ETH cross scenario. Check that the
     liquidation price matches Binance's published value." Response: "One number disagrees, so the check fails and
     the merge is blocked. The report names the case and gives a fix prompt."
   - "Then the fix goes green, and only then can it merge." Call: `fix: restore other-position terms`. Response, wide:
     the answer card with Binance's number and the proof line reading "passed".
4. **Held out** (gold field), one sentence at statement size (36px, 30px tablet, 21px phone): "**Held out of every
   pull request:** Example 1's margin, ETHUSDT's liquidation price and margin and BTCUSDT's liquidation price and
   margin." One answer lit at a time.
5. **Check it yourself** (stone field), a table at one type size: what, where, what you will see, link. Rows:
   Binance's FAQ; the ETH scenario on Lydit; the demo pull request; the TestSprite suite; the source; this build's
   check. Links that do not exist yet read "Linked once it is public."
6. **Why Lydit** (paper), two paragraphs side by side at body size with gold highlights; the last sentence, on stone,
   links to `/proof`: "Lydit takes its name from lydite, the black stone of
   ancient Lydia that assayers called the touchstone. Around 560 BCE, under Croesus, Lydia struck some of the first
   coins of pure gold, and the stone was how a buyer told gold from a good imitation. The metal was drawn across the
   stone and its streak laid beside streaks from reference needles of known purity, so the sample was never judged
   against itself. Lydit works the same way. Binance's published examples are the needles. Every release is drawn
   against them on its pull request preview, and the needles sit where the pull request cannot reach. A number that
   does not match does not merge."
7. **Gold, and gold-coloured** (pale stone): heading and text on the left; on the right, the three coins as a list,
   name in Bodoni beside its place and date: Gold stater (Lydia, ca. 560–546 BCE), Gold stater (Lydia, ca. 560–546
   BCE), Fourrée stater (Kyzikos, ca. 600–500 BC: gold over base metal).
8. **Footer** (stone): "LYDIT" at full width; Open the calculator, See the proof, Read the sources at 32px in gold;
   small links (Binance FAQ, Source on GitHub, the demo PR); "A calculator, not advice. Binance's
   engine has the final word."

### 3.4 `/sources` (page)

1. **Hero** (paper, type only): h1 "EVERY TERM, / SOURCED". Sentence: "The formulas Lydit computes, where each term
   comes from, and how a scenario link carries every input." Action: **Read Binance's FAQ**.
2. **Two formulas** (stone): MM and the one-way liquidation formula set large in Bodoni, the result side in gold. Note:
   "Hedge-mode terms are zero in one-way mode, so they are left out." Beside them, a live worked fragment: the
   liquidation formula on Binance's ETH example, computed by this build.
3. **Every variable** (paper): a table at one size: term, what it is, where it comes from. Each row is an anchor
   (`#var-wb` …) that the calculator's breakdown links to, and lights when targeted.
4. **Scenario links** (pale stone). The live thing: "Paste a scenario link". The ETH example is prefilled; under it,
   every parameter the link carries, as a table that updates as you type, and a button to open it in the calculator.
   Then the parameter reference in three groups (Position, Margin, Other positions).
5. **Not covered** (paper), split: heading and the reason on the left ("Hyperliquid publishes its formulas but no
   worked numbers, so there is nothing yet to hold a release to."); on the right, the list set large: Hedge mode,
   Portfolio margin, Fees and funding, Other venues.
6. **Footer** as on `/how-it-works`.

### 3.5 404 and error (pages)

Two fields, as the hero. 404: "NO PAGE / HERE", sentence "Nothing lives at this address. The calculator is at the
root.", action Open the calculator. Error: "THIS PAGE / BROKE", sentence "Lydit shows nothing rather than a wrong
number. Try again, or start over from the calculator.", actions Try again and Open the calculator. Both continue with
**Where to go**: an index of the four destinations, one row each, the name in Bodoni on the left and its sentence on
the right (the calculator row quotes Binance's ETH example as this build computes it), then the footer.

## 4. Components

| Component | Desktop | Phone |
|---|---|---|
| App top bar | 48px; mark, four links, proof line on one row | Mark, proof glyph, Menu sheet |
| Corner navigation (pages) | Fixed, top corners, ink follows the field beneath | Mark and the action; links in a Menu sheet |
| Field (app) | Label 14/500 above a 40px input, error then help below | Same, full width, 44px targets |
| Segmented control | As wide as its options | Full width below 480px |
| Other-positions table | Table with computed UPNL and MM columns | One card per position |
| Answer card | Sticky right column | First block on the screen |
| Price strip | 100% of the card, labels in rows above the axis | Same, three labels at most per row |
| Breakdown table | Step, Formula, With your inputs, Value | Two-line rows: step and value, then the substitution |
| Proof table | ID, Case, Checks, Kind, Open | Two-line rows |
| Hero (two fields) | Seam at 50%, headline at 9.5vw | Seam at 46svh, headline at 15vw |
| Specimen pair | Two figures side by side, each half the width | Stacked, the second in inverse colours |
| Call and response | 560px column, the third response 760px | Full width, no indent |
| Statement (held out) | 36px, three lines | 24px, four lines |
| Line-up table | Four columns at one size | Two-line entries |
| Two-column story | `columns: 2`, highlighted words | One column |
| Footer | Wordmark full width, places, links | Stacked |

## 5. Avoid

- Eyebrow labels, pill badges above headings, index numbers (01/02), tiny tracked capitals.
- Monospace outside code and IDs (the commit SHA is an ID; figures use tabular Jost).
- Hairline dividers and 1px boxes on pages (app tables and inputs may keep theirs).
- Gradients, glows, glass, shadows at rest, decorative shapes, emoji.
- Cream with terracotta; violet or indigo; and black with saturated yellow, which would read as Binance's own brand.
- Three-up card rows, icon-topped cards, a stock "hero, logos, features, testimonial, pricing" order.
- Animated or counting numbers; any motion on app screens beyond feedback.
- Fake GitHub or TestSprite screens; invented customers, quotes or statistics.
- Any expected liquidation price or maintenance margin in source, copy or fixtures (PRD §7). Every number shown comes
  from the engine at render time.
- Photographs, archival pictures and illustrations: the site carries none, by the owner's decision. Its visuals are
  type, colour fields and real interface fragments computed by the engine.

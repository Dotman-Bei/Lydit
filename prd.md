# PRD: Lydit

Mechanism word: **Holdout**. The answer key is held out of the code's reach.

Name: **Lydit**, from *lydite*, the touchstone mineral (named after ancient Lydia). Gold was streaked on it beside reference needles of known purity, so it was judged against references it could not change, never against itself. Working name during research was "Liqproof".

Status: ready to build · Owner: solo builder · Source research: `idea-research/testsprite-hackathon-s4/00–07` and `FINAL_IDEA.md`
Design and visual requirements are **not** in this document. They live in `frontend.md`. Where this PRD names UI elements, it names what must exist and what it must do, not how it looks.

---

## 1. Summary

Lydit holds every release of a Binance futures liquidation calculator to Binance's own published answers. For perp traders who size positions on its numbers, a TestSprite check on each pull request's preview blocks the merge on any mismatch, and the answer key lives in the TestSprite suite, out of the PR's reach. The live app shows users whether the exact build serving them passed.

The claim the whole product exists to make true:

> "With Lydit, a release whose liquidation price disagrees with Binance's own published examples cannot merge, and the PR that changes the formula cannot change the expected answer."

---

## 2. Event context

| Item | Value | Source |
|---|---|---|
| Event | TestSprite Hackathon, Season 4 | https://www.testsprite.com/hackathon-s4 |
| Track | **Project awards**: $3,000, 5 winners ($1,500 / $750 / $450 / $150 / $150), scored out of 100 by human judges | same |
| Window | Oct 16–22, 2026 | same |
| Submission deadline | **Oct 22, 11:59 PM PT = Oct 23, 06:59 UTC = Fri Oct 23, 07:59 Lagos.** Final schedule is confirmed in Discord. | same |
| Other track (not targeted) | CLI Improvement Bonus: $1,000 pool, Oct 16–29, $50 floor per merged PR, up to 3 PRs per person | same |
| Creator Picks | Five guest creators (Ömer Göçmen, Uğur Keşkekçi, Astro K Joseph, Poyraz, Jan Marshal) each pick one project. No effect on prizes. Jan Marshal is a ~56.6K-subscriber full-stack web-dev YouTuber (https://developereducators.com/channel/janmarshalcoding/); the others are `UNVERIFIED`. | same |
| Official judges | Names not published (`UNVERIFIED`). They read the PR, the 3.0 portal and the commits. | same |
| Sponsors | None. TestSprite is the only prize-giver. | same |
| Winners announced | Nov 6, on X and Discord | same |

### 2.1 Judging criteria and how Lydit scores on each

| Criterion | Weight | What judges look at | How Lydit satisfies it |
|---|---|---|---|
| Project quality | 40 | Craft, polish, completeness; does the live app work well | One finished tool: Binance USDⓈ-M liquidation price in one-way mode, cross and isolated, long and short, with other-position inputs, a step-by-step breakdown, shareable scenario links and a proof line for the served commit. Small enough to finish completely. |
| Tests that run themselves | 40 | Wired up; suite worth running: coverage breadth, assertion depth, scenario design; check fires on every PR and holds the merge. Read from the PR, the 3.0 portal and the commits. | Every golden assertion is an exact number from an outside source (Binance's published values), plus labelled derived edge cases. The check fires on each PR preview and blocks the merge. The PR thread shows a real catch: red on a wrong number, green after the fix. |
| Innovation | 20 | Creativity of the project, or of how verification is wired into shipping | The maker cannot grade its own work: the answer key sits in TestSprite, never in the PR diff, and users see the verification status of the exact build they use. |
| Engagement | open-ended bonus | Discord polls, X shares, long-form write-ups | An X thread ("your calculator ignores your other positions"), the red PR, a write-up. The builder already posts trading explainers on X (builder edge, `ASSUMED`). |

Top-weighted criteria are tied: Project quality (40) and Tests that run themselves (40). Event type is `mixed` (craft and test depth weigh equally).

### 2.2 Mandatory submission items (all required unless marked)

1. Public GitHub repo with source, a `.gitignore` that keeps secrets out, and a README covering the app, the live URL and what the suite covers. Commit history is the proof of authorship.
2. A live public URL (localhost not accepted), kept live for the whole build and judging.
3. A test suite built in the **TestSprite 3.0 portal** against the live app. It must exist before the PR check, because the check runs existing tests.
4. The **TestSprite GitHub App** installed on the repo.
5. At least one PR carrying a TestSprite comment or status check, with tests passing. The best version is a run that caught something first and went green after the fix.
6. A post in Discord `#hackathon-submissions` with the PR link, live URL, and TestSprite account email and name (same email as the account).
7. Optional: demo video link. Not scored, but judges watch them. No length limit stated.
8. No chain, mainnet or testnet requirement.

---

## 3. Builder constraints

| Constraint | Value |
|---|---|
| Team | Solo |
| Skills | TypeScript and web apps. Not Solidity. |
| Time | 20+ focused hours before the deadline (about 42 hours of wall-clock left at research delivery) |
| Starting point | Fresh build, nothing reused |
| TestSprite state | Account created; no live app, no suite, no GitHub App yet |
| Stack (`ASSUMED`) | Next.js (App Router) + TypeScript on Vercel, which gives per-PR preview URLs. No database, no auth, no contracts. |
| Builder edge (`ASSUMED`) | Web3 builder and active trader; publishes trading-platform education on X. |

---

## 4. Problem

### 4.1 The person and the moment

A Binance USDⓈ-M trader in cross margin is long BTC and is about to size an ETH long. They check the ETH liquidation price in a calculator that treats each position alone. It says **1,114.78**. Binance's own worked example for that account puts it at **1,153.26**, because the BTC position's unrealized loss and maintenance margin eat into the shared balance. The trader believes they have about **$38 (3.3%)** more room than they do, sets leverage and stops on that, and loses the margin when price touches a level the tool called safe.

Evidence:
- Binance's example and inputs: https://www.binance.com/en/support/faq/how-to-calculate-liquidation-price-of-usd%E2%93%A2-m-futures-contracts-b3c689c1f50a44cabb3a84e663b81d93. Both published answers were recomputed to the cent; 1,114.78 is the same inputs with the other position removed.
- Recurring complaints about displayed vs actual liquidation: a Bybit trader liquidated at 0.136 while 0.139 was displayed (https://www.sikayetvar.com/en/bybit-us/incorrect-liquidation-price-on-bybit-requesting-compensation-for-loss); a MEXC trader out 147.39 USDT who could not check the platform's math (https://www.sikayetvar.com/en/mexc-exchange-us/mexc-liquidated-my-rave-usdt-short-before-the-price-hit-my-liquidation-level).
- One wrong number in a UI is enough to lose money: four Inverse Finance users lost about 23,698 DOLA (one wallet about 19,001) when the interface showed a wrong `minAmount` during deleverage (https://forum.inverse.finance/t/reimbursement-for-four-users-affected-by-a-ale-ui-bug/520).
- `INFERRED`: no named incident was found of a third-party calculator ignoring a second cross position; the scenario is reconstructed from Binance's example. If the builder has seen this first-hand, put it in the README.

### 4.2 The developer's problem

A calculator that is right today breaks quietly tomorrow. A coding agent asked to "clean up the margin math" can simplify it to one position at a time.
- With in-repo tests, the same PR can change the formula **and** the expected value; the check stays green. METR documented a model stubbing out the evaluator and reward hacking in 30.4% of RE-Bench runs (https://metr.org/blog/2025-06-05-recent-reward-hacking). CodeRabbit found AI-co-authored PRs carry ~1.7x more issues and 75% more logic and correctness issues (https://coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report).
- Generated smoke suites assert a number appears, not that it is right; the host's own feedback wall reports 40 generated tests where 3 mattered (https://www.testsprite.com/hackathon-s4). Unit tests on the formula miss UI wiring errors, the failure behind the Inverse loss.

### 4.3 Why existing tools don't solve it

| Prior art | What it lacks | Link |
|---|---|---|
| otomato Hyperliquid liquidation calculator | Calls its output exact; flat maintenance rate; says it skips per-tier deductions; no tests or verification shown | https://otomato.xyz/tools/hyperliquid-liquidation-calculator |
| LiquiScope (HackQuest) | Aave/Compound risk monitor; checked only against live positions; no suite | https://www.hackquest.io/projects/LiquiScope |
| Aave Calculator (ETHGlobal HackMoney 2022) | No stated check against protocol answers | https://ethglobal.com/showcase/aave-calculator-42p9y |
| Vigor Crypto Liquidation Calculator (Devpost 2023) | No tests, no comparison with exchange data | https://devpost.com/software/vigor-crypto-liquidation-calculator |
| supa.is Hyperliquid guide (2026) | Worked example whose formula and arithmetic use different units | https://supa.is/article/hyperliquid-liquidation-price-calculator-maintenance-margin-2026 |
| LiqPass (HackQuest) | Liquidation insurance product, different job | https://www.hackquest.io/es/projects/liqpass |
| Season 4 neighbours | Solace uses an authoritative answer key (DASS-21 cutoffs) in health; Meerkat, Loopline, AgentPulse are meta tools about the loop. No trading entrant found. | https://github.com/lidxgoesgiri/solace, https://github.com/farhank15/meerkat, https://github.com/hemanthreddykoduru/Loopline, https://github.com/naufalfx805-source/agentpulse |

The gap: none proves at release time that its outputs reproduce the venue's own published answers, none keeps the answer key out of the reach of the PR that changes the math, and none shows users whether their build passed.

---

## 5. Users and use cases

| User | Use case |
|---|---|
| Perp trader (primary) | Enter a Binance USDⓈ-M position (and other cross positions) and get a liquidation price that matches Binance's engine; see how the number is built; share the exact scenario as a link. |
| Trading educator on X | Post a scenario link instead of a screenshot so followers recompute the same number and see the build it came from. |
| Hackathon judge | Verify the claim themselves: Binance FAQ → scenario link → red-then-green PR → portal suite → repo search → production proof line. |
| The builder (and their coding agent) | Ship changes through PRs; the gate blocks any release that breaks the published answers; the agent fixes from TestSprite's PR comment and fix prompt without ever holding a TestSprite key. |

---

## 6. Scope

### 6.1 In scope

- Binance USDⓈ-M liquidation price, **one-way mode**, **cross** and **isolated**, **long** and **short**.
- Inputs for **other cross positions** (their maintenance margin and unrealized PnL, or the position details that produce them), because Binance's example depends on them.
- Maintenance margin rate and maintenance amount as inputs, with Binance FAQ values as presets.
- Scenario URLs that encode **every** input.
- A step-by-step breakdown of how each number is built.
- A production **proof line**: the served commit and that commit's TestSprite check result, with a link.
- The golden TestSprite suite (published cases + labelled derived edge cases).
- GitHub App PR trigger with blocking, against public Vercel previews.
- One real agent PR that goes red, then green.

### 6.2 Out of scope (do not let these creep back in)

- Hyperliquid and other venues (they publish formulas but no numeric example, so the claim cannot stand on them). First addition after the event.
- Live prices, exchange API keys, wallet connect, accounts, sign-in.
- Hedge mode, portfolio margin.
- Fees and funding (weak answer key; see runner-up notes, section 17).
- Mobile-specific test coverage: TestSprite's runner uses a fixed desktop viewport (https://github.com/TestSprite/testsprite-cli/issues/174). Layout behaviour is owned by `frontend.md`.
- Slack, Jira and Linear wiring.
- An automatic agent-fix relay (ruled `DEAD` in prior art: https://github.com/anthropics/claude-code-action/blob/main/examples/ci-failure-auto-fix.yml, https://nx.dev/ci/features/self-healing-ci).
- A CLI-based gate, unless a kill criterion forces it (section 14).
- A database or any server-side storage of user inputs.

---

## 7. The holdout rule (non-negotiable)

1. **No expected output values** (liquidation prices, maintenance margins) may appear in application code, in-repo tests, fixtures, config, or seed data.
2. Expected values live **only** in the TestSprite suite (assertion steps). The README may show Binance's published numbers for humans, as documentation; it is never read by code or tests.
3. Scenario inputs for the golden cases also live in the TestSprite suite (in the URL each case opens). The repo holds only code and links to sources.
4. The coding agent never receives a TestSprite API key. The gate runs through the GitHub App, which adds nothing to the repo.
5. In-repo tests are allowed only for things that carry no published answer: input validation, URL encode/decode round trips, error states, and property checks (for example: with all else fixed, more wallet balance lowers a long's liquidation price; a short's liquidation price sits above entry when the balance is positive).
6. Judge check this must survive: "search the repo; no test file, fixture or source file holds an expected liquidation price."

---

## 8. Functional requirements

### 8.1 Calculation engine

**Maintenance margin** (Binance FAQ):
`MM = position_notional × MMR_for_tier − maintenance_amount_for_tier`, where `position_notional = size × mark_price`.

**Liquidation price, one-way mode** (Binance variables; hedge-mode terms are zero and out of scope):

```
LP = ( WB − TMM1 + UPNL1 + cumB − Side × Position × EP )
     / ( Position × MMR − Side × Position )
```

| Variable | Meaning |
|---|---|
| `WB` | Wallet balance. Cross: cross wallet balance. Isolated: isolated wallet balance (the margin allocated to the position). |
| `TMM1` | Maintenance margin of all other contracts. Isolated: 0. |
| `UPNL1` | Unrealized PnL of all other contracts. Isolated: 0. |
| `cumB` | Maintenance amount for the position's tier. |
| `Side` | 1 for long, −1 for short. |
| `Position` | Absolute position size in coins. |
| `EP` | Entry price. |
| `MMR` | Maintenance margin rate for the position's tier. |

Requirements:
- E-1 Compute `TMM1` and `UPNL1` from other-position details when the user enters them (size, entry, mark, side, MMR, maintenance amount): `UPNL = side × size × (mark − entry)`; `MM` as above. Also accept `TMM1` and `UPNL1` entered directly.
- E-2 Use decimal arithmetic (not raw floating point) for all money math. Display prices to 2 decimals and margins to 2 decimals; keep full precision internally. Binance notes slight decimal variation; the published examples must still match at 2 decimals.
- E-3 When the denominator is 0, or the computed price is ≤ 0, show a clear "no liquidation price" state with the reason instead of a number.
- E-4 Validation: size > 0; entry > 0; mark > 0; 0 ≤ MMR < 1; maintenance amount ≥ 0; wallet balance ≥ 0; side ∈ {long, short}; mode ∈ {cross, isolated}. Invalid input shows a field-level error and no result.
- E-5 The engine is a pure function with no network calls.

Reference values (for building and manual checks only; **never committed into code or tests**, per section 7):

| Case | Inputs | Published answer |
|---|---|---|
| FAQ Example 1 (maintenance margin) | 10 BTCUSDT, mark 26,000, notional 260,000, MMR 1%, maintenance amount 1,300 | MM **1,300** |
| FAQ Example 2, ETHUSDT (cross, one-way, long) | WB 1,535,443.01; size 3,683.979; EP 1,456.84; mark 1,335.18; MMR 10%; cumB 135,365.00; TMM1 71,200.81144; UPNL1 −56,354.57 | MM **356,512.51**; LP **1,153.26** |
| FAQ Example 2, BTCUSDT (cross, one-way, long) | WB 1,535,443.01; size 109.488; EP 32,481.98; mark 31,967.27; MMR 2.5%; cumB 16,300.00; TMM1 356,512.508; UPNL1 −448,192.89 | MM **71,200.81**; LP **26,316.89** |

Known wrong answers the gate must catch (recomputed from the ETH inputs):

| Regression | Shows | Direction |
|---|---|---|
| Ignore the other cross position (single-position simplification) | **1,114.78** | Dangerous: shows more room than exists. Use this in the demo PR. |
| Use mark price instead of entry price | **1,018.08** | Dangerous |
| Drop the maintenance amount | **1,194.08** | Conservative but wrong |

### 8.2 Calculator page

- C-1 Inputs: mode (cross/isolated), side, size, entry price, mark price, wallet balance, MMR, maintenance amount, and an "other cross positions" section (hidden or disabled in isolated mode) supporting at least one other position, entered either as details or as direct `TMM1`/`UPNL1`.
- C-2 Presets that fill the Binance FAQ inputs (ETH case, BTC case, Example 1 maintenance case). Presets fill inputs only; they never contain outputs.
- C-3 Outputs: liquidation price, maintenance margin of this position, distance from mark to liquidation (absolute and %).
- C-4 Every input change updates the URL (section 8.3) and the outputs.
- C-5 "Copy link" action copies the current scenario URL.
- C-6 Each output and each input carries a stable `data-testid` (for example `liq-price`, `maint-margin`, `distance-pct`, `input-wb`). Register the attribute with TestSprite (`project create/update --test-id-attributes data-testid`, CLI v0.10.0) or rely on its built-in `data-testid` fallback.
- C-7 Each number is in its own element containing only the formatted number, so one assertion checks one number (avoids the "blocked on verbose assertions" pattern, https://github.com/TestSprite/testsprite-cli/issues/175).

### 8.3 Scenario URLs

- U-1 All inputs are encoded as query parameters, for example `/?venue=binance&mode=cross&side=long&size=3683.979&ep=1456.84&mp=1335.18&wb=1535443.01&mmr=0.10&cum=135365&tmm=71200.81144&upnl=-56354.57`.
- U-2 Loading a URL restores every input exactly and computes immediately.
- U-3 Missing parameters fall back to empty fields with no result; malformed values show the field error from E-4.
- U-4 Parameter names are documented on the Sources page.

### 8.4 Breakdown ("how this number is built")

- B-1 Shows each variable's value, the substituted numerator and denominator, and the result, in order.
- B-2 Shows how `TMM1` and `UPNL1` were derived from other positions when they were.
- B-3 Links each term to its definition on the Sources page and to the Binance FAQ.

### 8.5 Proof line and proof page

- P-1 Every page shows the served commit (short SHA from `VERCEL_GIT_COMMIT_SHA`) and, on previews, the PR number (`VERCEL_GIT_PULL_REQUEST_ID`) and environment (`VERCEL_ENV`). Requires "Enable access to System Environment Variables" in Vercel (https://vercel.com/docs/environment-variables/system-environment-variables).
- P-2 The proof line shows the TestSprite check result for that commit (passed / failed / pending / not found) with a link to the check.
- P-3 Result comes from `GET /repos/{owner}/{repo}/commits/{sha}/check-runs` (unauthenticated works for public repos; https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#list-check-runs-for-a-git-reference), filtered to the TestSprite app/check name, via the server route `/api/proof`.
- P-4 Rate limits: 60 requests/hour per IP unauthenticated, 5,000/hour with a token (https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api). Cache the response server-side (for example 60 seconds) and optionally use a read-only fine-grained token from a Vercel env var. Never expose the token to the browser.
- P-5 If GitHub is unreachable or rate-limited, show "status unavailable", never "passed".
- P-6 The Proof page lists the golden cases by name with: the source link (Binance FAQ), the scenario link, and the check status of the served commit. It does **not** print expected values (section 7).

### 8.6 Build identity route (login-wall tripwire)

- I-1 `/api/build` returns JSON `{ sha, shortSha, pr, ref, env }` from Vercel system env vars.
- I-2 The first, highest-priority TestSprite case opens `/api/build` (or a page showing it) and asserts the commit is a real 40-character SHA and the environment is `preview` on PR runs. A Vercel login wall or stale deploy then fails in one step instead of burning credits across the suite (failure mode: https://github.com/TestSprite/testsprite-cli/issues/620). This also helps tell which PR a run belongs to (https://github.com/TestSprite/testsprite-cli/issues/597).

### 8.7 Health

- H-1 `/api/health` returns `{ ok: true }` and the short SHA.

---

## 9. Pages and routes

| Route | Type | Purpose | Key elements |
|---|---|---|---|
| `/` | Page | Calculator | Inputs, presets, outputs, breakdown, copy link, proof line. Reads and writes scenario query params. |
| `/proof` | Page | Verification status | Golden case list (names, source links, scenario links), served commit, TestSprite check result with link, one paragraph explaining the holdout rule. |
| `/sources` | Page | Formulas and references | Maintenance margin and liquidation formulas, variable table, URL parameter reference, links to the Binance FAQ, note that hedge mode and other venues are out of scope. |
| `/how-it-works` | Page | The mechanism for judges and users | PR → preview → TestSprite → block → fix → green flow; why the answer key sits outside the repo; link to the demo PR and the portal suite. |
| `/api/proof` | API (GET) | Check result for the served commit | `{ sha, status, conclusion, url, checkedAt }`, cached. |
| `/api/build` | API (GET) | Build identity | `{ sha, shortSha, pr, ref, env }`. |
| `/api/health` | API (GET) | Liveness | `{ ok, sha }`. |
| `not-found` | Page | 404 | Link back to `/`. |
| `error` | Page | Runtime error boundary | Message and link back to `/`. |

All pages show the proof line (P-1, P-2).

---

## 10. TestSprite verification requirements

### 10.1 Platform facts this relies on

| Fact | Source |
|---|---|
| GitHub App waits for a GitHub deployment event, resolves the target URL from a pattern with `{pr}`, `{branch}`, `{branch-slug}`, `{sha}`, `{short-sha}`, runs the tests, posts a PR comment and a check; option "Block PR until tests pass"; option to include drafts. Docs advise leaving blocking off until the suite is stable. | https://docs.testsprite.com/web-portal/integrations/github-integration |
| 3.2.0 (Oct 8, 2026) rebuilt the GitHub integration: tests the PR's preview URL, PR comment plus TestSprite check, merge held until green. | https://www.testsprite.com/changelog |
| The GitHub App adds nothing to the repository. | https://www.testsprite.com/hackathon-s4 |
| Frontend tests follow the preview URL; backend tests use the URL in their own code. **All golden cases must be frontend (UI) tests.** | CLI source `src/commands/ci.ts` L1485, commit d61e6dfc (https://github.com/TestSprite/testsprite-cli/blob/d61e6dfc400f5e88ee34ac799c5496ac5c5a7751/src/commands/ci.ts#L1485) |
| Plan steps are plain-language `action` / `assertion` steps (1–200 per test). | https://github.com/TestSprite/testsprite-cli/blob/d61e6dfc400f5e88ee34ac799c5496ac5c5a7751/schemas/plan.schema.json |
| Portal plans can be edited, cases added with "+ More Test Case", priorities set (higher runs earlier). | https://docs.testsprite.com/web-portal/core/ui/ui-plan-gen.md |
| Auto-heal absorbs UI drift and is said not to make tests pass; whether it adapts a changed *value* is undocumented. Free plan does not list auto-heal. | https://docs.testsprite.com/web-portal/core/ui/auto-heal.md, https://www.testsprite.com/pricing |
| Reports include a narrative, grouped issues and a copy-paste fix prompt for a coding agent. | https://docs.testsprite.com/web-portal/results/test-report.md |
| Free plan: 150 credits/month, 1 environment, 1 test list, PR auto-test on 1 repo. Starter: $0 first month then $19/mo, 400 credits, 3 repos. Frontend run 0.5 credits. Block PR plan availability not stated (`UNVERIFIED`). | https://www.testsprite.com/pricing, CLI README |

### 10.2 Setup requirements

- T-1 Vercel: production deploy from `main`; preview deploy per PR; **Vercel Authentication disabled for previews** (per project, allowed on Hobby: https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication); system env vars enabled.
- T-2 TestSprite: frontend project against the production URL, using the same email as the submission.
- T-3 Generate the suite in the 3.0 portal (agents explore the live app), then keep the useful generated cases and add the golden cases by hand.
- T-4 Connect GitHub in Workspace Settings → Connections → Integrations; add a PR trigger on the project; paste an existing PR with a working preview; Detect Events; pick the event fired after the preview is live; set the Target URL pattern (Vercel branch URL form, for example `https://<project>-git-{branch-slug}-<team>.vercel.app`); Send Test Event; Create Trigger.
- T-5 Turn on "Block PR until tests pass" once the suite is stable. Also make the TestSprite check required in GitHub branch protection as a backstop.
- T-6 Use non-draft PRs for the demo (drafts are skipped unless "Include draft PRs" is on).
- T-7 Before building features, prove the gate fails a wrong number: point one case at a preview showing a deliberately wrong value and confirm the run fails (kill criterion 1).

### 10.3 Golden suite (the answer key)

Rules: one displayed number per assertion step; inputs carried in the case's URL; the published value and the Binance FAQ link written into the step text; priority High for golden cases.

| ID | Kind | Opens | Asserts |
|---|---|---|---|
| G-0 | Tripwire | `/api/build` | Real commit SHA; `preview` on PR runs |
| G-1 | Published | Example 1 scenario | Maintenance margin = published value |
| G-2 | Published | ETH cross scenario | Liquidation price = published value |
| G-3 | Published | ETH cross scenario | Maintenance margin = published value |
| G-4 | Published | BTC cross scenario | Liquidation price = published value |
| G-5 | Published | BTC cross scenario | Maintenance margin = published value |
| D-1 | Derived (labelled) | Isolated long | Computed value from the formula |
| D-2 | Derived | Isolated short | Computed value |
| D-3 | Derived | Cross short | Computed value |
| D-4 | Derived | Cross single position (no others) | Computed value |
| D-5 | Derived | Tier boundary (MMR and maintenance amount changed) | Computed value |
| D-6 | Behaviour | Invalid input (negative size, MMR ≥ 1, empty) | Field error shown, no result |
| D-7 | Behaviour | No-liquidation case (price ≤ 0) | "No liquidation price" state |
| D-8 | Behaviour | Copy link → open link | Same inputs and same outputs restored |
| D-9 | Behaviour | Preset fills ETH case | All inputs filled; result computed |
| D-10 | Behaviour | Proof page | Shows served commit and a check status |

Target 12–20 tests. Budget: ~16 frontend tests per PR run ≈ 8 credits.

### 10.4 Demo PR (required evidence)

1. A coding-agent branch titled like a refactor, for example `simplify: compute liquidation per position`, that drops the other-position terms.
2. The preview shows **1,114.78**; G-2 fails; the check is red; merge blocked; the PR comment names the failing case and gives a fix prompt.
3. The fix commit restores the terms; the check reruns and goes green; merge.
4. Production proof line updates to the new commit with a passing check.
5. Keep the PR and its history visible; link it in the README and the Discord post.

### 10.5 Fallback gate (only if kill criteria force it)

GitHub Actions on `deployment_status` running `testsprite test run --all --project <id> --target-url <preview> --no-auto-heal --wait` (`--no-auto-heal` requests a strict replay for regression gates: https://github.com/TestSprite/testsprite-cli/blob/d61e6dfc400f5e88ee34ac799c5496ac5c5a7751/src/commands/test.ts#L15129), or `testsprite ci run --project <id> --env <name> --target-url <preview>` (one-execution gate, PR-aware: https://github.com/TestSprite/testsprite-cli/blob/d61e6dfc400f5e88ee34ac799c5496ac5c5a7751/src/commands/ci.ts#L1308). Cost: `TESTSPRITE_API_KEY` becomes a repo secret, which weakens rule 7.4. API keys carry scopes (`read:tests`, `write:tests`, `run:tests`, …) but new keys get the full set and the portal shows no way to narrow them (https://github.com/TestSprite/testsprite-cli/blob/main/DOCUMENTATION.md, https://docs.testsprite.com/web-portal/admin/api-keys.md).

---

## 11. Non-functional requirements

- N-1 No user data stored or sent anywhere; all calculation runs in the browser or a pure server function.
- N-2 No secrets in the repo. Optional GitHub token only as a Vercel env var.
- N-3 Pages load and compute without any external call except `/api/proof`.
- N-4 Deterministic output: same inputs give the same displayed numbers on every build.
- N-5 Accessibility and layout behaviour follow `frontend.md`.

---

## 12. README requirements (submission)

First screen must show:
- One line: what it is and the claim.
- A table: Binance inputs, Binance's published answer, Lydit's live answer, with each case linked to the FAQ and its scenario URL.
- Links: live app, the red-then-green PR, the TestSprite suite (account email).
- The line: "No test file, fixture or source file in this repo holds an expected liquidation price; the answer key lives in the TestSprite suite, outside any PR."

Then: what the suite covers (section 10.3), how the gate is wired (section 10.2), the holdout rule (section 7), sources.

---

## 13. Demo video (optional, recommended)

Under 30 seconds for the core moment:
- 0–6 s: Binance FAQ example, published ETH answer 1,153.26.
- 6–12 s: Lydit scenario link with the same inputs shows 1,153.26 and "TestSprite: passed on commit `abc1234`".
- 12–22 s: the agent PR; preview shows 1,114.78; check red; merge blocked; PR comment names the case.
- 22–30 s: fix commit; green; merge; production proof line updates.

---

## 14. Risks and kill criteria

| # | Condition | Action |
|---|---|---|
| 1 | A preview showing a deliberately wrong number passes an App-triggered run (healed or judged acceptable). | Switch to the fallback gate with `--no-auto-heal` (10.5). If that also passes, **drop the claim**. Test this first. |
| 2 | Exact-value assertions return "blocked" on a correct page (https://github.com/TestSprite/testsprite-cli/issues/175). | One number per step on a dedicated element; if still blocked, cut cases rather than loosen assertions. |
| 3 | Block PR not available on the plan. | Required status check via branch protection, or Starter's free first month. Otherwise narrow "cannot merge" to "is marked failed". |
| 4 | Vercel previews cannot be made public. | Push trigger on a public branch deploy. Loses the per-PR claim: major narrowing. |
| 5 | The App cannot resolve the preview URL pattern. | Fallback gate (10.5); accept the repo-secret cost. |
| 6 | Credits run out. | Fewer cases per PR, or Starter. |
| 7 | Deadline in Discord differs from the page. | Re-check scope against the new time. |

Other known TestSprite gotchas to watch: EPIPE guard forcing exit 0 when piping CLI output (https://github.com/TestSprite/testsprite-cli/issues/489); batch attaching to another environment's run (https://github.com/TestSprite/testsprite-cli/issues/387); failing batches that can't stop early (https://github.com/TestSprite/testsprite-cli/issues/435); older `ci init` gates testing staging instead of the preview (https://github.com/TestSprite/testsprite-cli/issues/457); `test code put` disabling healing (https://github.com/TestSprite/testsprite-cli/issues/443); workflows for different projects cancelling each other (https://github.com/TestSprite/testsprite-cli/issues/583).

---

## 15. Needs the user

- Confirm the final deadline pinned in Discord `#hackathon-info` (https://discord.com/invite/GXWFjCe4an).
- Season 1–3 winner announcements and the official judges' names (X: https://x.com/test_sprite, Discord).
- Whether Season 4 has a promo code or credit grant (Season 3 did: https://www.testsprite.com/hackathon-s3).
- Whether Block PR is on your plan (dashboard).
- Whether App-triggered PR runs fail a changed number (ask with the message below, and test it per T-7).
- Only if using the fallback gate: whether API-key scopes can be narrowed.

## 16. Host validation message

Post in the TestSprite Discord. Status: `PENDING USER`.

> I'm building Lydit for Season 4: a Binance futures liquidation calculator where every PR's Vercel preview must reproduce Binance's own published examples (ETH 1,153.26, BTC 26,316.89) before the TestSprite check lets it merge, and the live app shows the check result for the exact commit it serves. The expected numbers live only in my TestSprite suite, so a coding agent's PR cannot edit the answer key along with the formula. Does this match what you want to see for "tests that run themselves", and do GitHub App PR runs fail a changed number, or can auto-heal adapt to it?

## 17. After the event (not in this build)

- Hyperliquid support: formula from https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations; tiers from `POST https://api.hyperliquid.xyz/info` `{"type":"meta"}` → `marginTables`; exchange-reported `liquidationPx` from `{"type":"clearinghouseState","user":…}` for frozen snapshot cases (https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/perpetuals).
- Runner-up idea, **Margin Lab**: interactive margin lessons for educators where every worked number is checked against venue examples before a content PR merges, with commit-stamped share links. Lost on specificity and defensible claim.
- Third place, **Fee-true Sizer**: fee- and funding-aware sizing. Weak answer key: Hyperliquid fees publish tiers only (https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees); funding's worked example stops at the rate, quoted on an 8-hour basis but paid hourly (https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding).

## 18. Git Commit Rules

Git commits are a required part of the development process.
During the build, commit changes continuously instead of waiting until the entire project is finished.

### Commit Frequency
For a normal build, aim for 50+ meaningful commits across the development process.
Do NOT create 50 meaningless commits just to reach the number. Every commit should represent a real, completed development step.
Make a commit whenever you complete a logical unit of work, such as:

* Creating a new page
* Creating or modifying a component
* Adding a feature
* Implementing an API endpoint
* Adding database functionality
* Adding authentication logic
* Adding validation
* Adding error handling
* Connecting frontend to backend
* Adding a utility/helper
* Adding a configuration
* Refactoring a specific section
* Fixing a bug
* Improving an existing feature
* Adding tests
* Fixing failing tests
* Improving responsiveness
* Fixing accessibility issues
* Updating documentation
* Completing a route
* Completing a major UI section
* Integrating an external service

### Commit Process
After completing each logical development unit:

1. Check the current changes.
2. Verify that the changes work.
3. Stage only the relevant files.
4. Create a descriptive commit.
5. Continue building from the committed state.

Use conventional commit messages where appropriate:

* `feat: add dashboard`
* `feat: add wallet connection`
* `feat: implement transaction history`
* `fix: resolve wallet connection error`
* `refactor: simplify auth middleware`
* `test: add dashboard tests`
* `style: improve mobile layout`
* `docs: update setup instructions`

### Important Rules

* Do NOT wait until the end of the project to commit everything.
* Do NOT make one giant commit containing the entire project.
* Do NOT create fake changes solely to increase the commit count.
* Do NOT repeatedly modify and commit the same thing without a meaningful reason.
* Keep commits small, focused, and logically separated.
* Before moving to the next major feature, make sure the previous feature has been committed.
* If a task contains several independent steps, commit each completed step separately.
* If you encounter and fix a bug during development, commit the fix separately.
* If you make a meaningful refactor, commit it separately.

### Target
For a substantial project, aim for 50+ meaningful commits by the time the build is complete, distributed naturally throughout development.
The commit history should clearly show the progression of the project from initial setup → individual features → integrations → fixes → testing → polish → final state.
At the end of the build, run `git log` and verify that the history accurately reflects the development process.

### Project-specific additions

* Never commit an expected liquidation price or maintenance margin into code, tests, fixtures or config (section 7).
* Never commit secrets; the TestSprite key is never in the repo on the App path.
* The demo regression and its fix are separate commits on the demo PR branch, so the red-then-green story reads in the history.

---

## Appendix A. Research trail

| File | What it holds |
|---|---|
| `00-constraints.md` | Deadline conversion, team, skills, fixed event requirements, builder edge |
| `01-event-intel.md` | Tracks, criteria, submission rules, judges, recent TestSprite shipments (3.2.0, 3.1.0, CLI 0.7–0.15), past showcased projects, event type `mixed`, host goal |
| `02-wants-and-overlap.md` | Host differentiator, sponsor-slot primitives S1–S6, known TestSprite gaps, overlap zones |
| `03-pain-bank.md` | 28 pains (22 externally sourced) and the drop log |
| `04-candidates.md` | 14 candidates with port/delete tests and red flags |
| `05-prior-art.md` | Prior art per survivor and the Season 4 field |
| `06-scorecard.md` | Source-level feasibility and the scorecard (Lydit 22, Margin Lab 18, Fee-true Sizer 16) |
| `07-final-checks.md` | Obvious-fix analysis, judge's first 30 seconds, kill criteria, final checklist |
| `FINAL_IDEA.md` | The chosen idea and all sources |

## Appendix B. Recent TestSprite shipments (the host's hidden wishlist)

- 3.2.0, Oct 8 2026: rebuilt GitHub PR gate, Slack summaries, Jira/Linear filing, SSO sign-in beta, live run map.
- 3.1.0, Jul 28 2026: team workspaces and roles, per-workspace API keys, activity log, AI Chat, Environments with variables, OTP login.
- CLI 0.15.0, Oct 17 2026: `ci run`, `testsprite-ci` skill, execution report with fix prompts as the job summary.
- CLI 0.14.0 (Oct 6), 0.13.0 (Sep 25), 0.12.0 (Sep 17), 0.8.0 (Aug 31), 0.7.0 (Aug 19): tunnels, environments and sign-in modes, `ci init github`, `test plan generate`, schedules and test lists.
Sources: https://www.testsprite.com/changelog, https://github.com/TestSprite/testsprite-cli/blob/main/CHANGELOG.md

## Appendix C. Sources

All URLs used in the research are listed in `FINAL_IDEA.md` → Sources. The ones this PRD relies on directly are linked inline above.

import type { Metadata } from "next";
import { PageFooter } from "@/components/pages/page-footer";
import { LinkReader } from "@/components/sources/link-reader";
import { calculate } from "@/lib/calculate";
import { formatFixed, formatInput } from "@/lib/format";
import { BINANCE_FAQ_URL, getPreset } from "@/lib/presets";
import { scenarioHref } from "@/lib/scenario";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Binance's maintenance margin and liquidation price formulas, every variable, and the scenario URL format.",
};

const MINUS = "−";

const VARIABLES = [
  {
    id: "wb",
    name: "WB",
    meaning:
      "Wallet balance. In cross margin, the cross wallet balance; in isolated, the margin allocated to the position.",
    from: "Your account",
  },
  {
    id: "tmm1",
    name: "TMM1",
    meaning: "Maintenance margin of all other contracts in the cross wallet. Zero in isolated margin.",
    from: "Summed from your other positions",
  },
  {
    id: "upnl1",
    name: "UPNL1",
    meaning: "Unrealized profit and loss of all other contracts. Zero in isolated margin.",
    from: "Summed from your other positions",
  },
  { id: "cumb", name: "cumB", meaning: "Maintenance amount for the position's tier.", from: "Binance's margin tiers" },
  { id: "side", name: "Side", meaning: `1 for a long, ${MINUS}1 for a short.`, from: "Your position" },
  { id: "position", name: "Position", meaning: "Absolute position size, in coins.", from: "Your position" },
  { id: "ep", name: "EP", meaning: "Entry price.", from: "Your position" },
  {
    id: "mmr",
    name: "MMR",
    meaning: "Maintenance margin rate for the position's tier, as a fraction: 10% is 0.1.",
    from: "Binance's margin tiers",
  },
];

/** The liquidation formula on Binance's ETH example, worked by this build at render. */
function worked() {
  const c = calculate(getPreset("eth-cross").scenario);
  if (!c.liq) return null;
  const t = c.liq.terms;
  return {
    rows: [
      ["WB", formatInput(t.wb)],
      ["TMM1", formatFixed(t.tmm)],
      ["UPNL1", formatFixed(t.upnl)],
      ["cumB", formatInput(t.cum)],
      ["Side", String(t.side)],
      ["Position", formatInput(t.size)],
      ["EP", formatInput(t.ep)],
      ["MMR", formatInput(t.mmr)],
    ],
    numerator: formatFixed(c.liq.numerator),
    denominator: formatFixed(c.liq.denominator),
    price: c.liq.kind === "price" ? formatFixed(c.liq.price) : "None",
  };
}

export default function SourcesPage() {
  const example = scenarioHref(getPreset("eth-cross").scenario);
  const w = worked();

  return (
    <main>
      {/* 1. Type only: the statement across the width, the sentence and the action on one baseline. */}
      <section className="type-hero" data-ink="#141414" data-ground="#ffffff" aria-labelledby="sources-title">
        <h1 id="sources-title" className="type-hero__title lines">
          <span className="line">
            <span data-line style={{ "--i": 0 } as React.CSSProperties}>
              Every term,
            </span>
          </span>
          <span className="line">
            <span data-line style={{ "--i": 1 } as React.CSSProperties}>
              sourced
            </span>
          </span>
        </h1>
        <div className="type-hero__foot" data-rise>
          <p className="type-hero__sub">
            The formulas Lydit computes, where each term comes from, and how a scenario link carries every input.
          </p>
          <a href={BINANCE_FAQ_URL} target="_blank" rel="noreferrer" className="page-button">
            Read Binance&apos;s FAQ
          </a>
        </div>
      </section>

      {/* 2. The two formulas, set large on the stone, beside this build's working. */}
      <section className="chapter formulas" data-ink="#f1f1ef" data-ground="#141414" aria-labelledby="formulas-title">
        <div className="grid">
          <div className="formulas__set">
            <h2 id="formulas-title" className="section-heading" data-reveal>
              Two formulas
            </h2>
            <figure className="formula" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <p className="formula__body">
                <span className="formula__lhs">MM</span> = Position × Mark × MMR {MINUS} cumB
              </p>
              <figcaption className="formula__name">Maintenance margin</figcaption>
            </figure>
            <figure className="formula" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <p className="formula__frac">
                <span className="formula__lhs">LP =</span>
                <span className="formula__stack">
                  <span>
                    WB {MINUS} TMM1 + UPNL1 + cumB {MINUS} Side × Position × EP
                  </span>
                  <span className="formula__bar" aria-hidden="true" />
                  <span>Position × MMR {MINUS} Side × Position</span>
                </span>
              </p>
              <figcaption className="formula__name">Liquidation price, one-way mode</figcaption>
            </figure>
          </div>
          <p className="formulas__note" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            Both from Binance&apos;s FAQ. Hedge-mode terms are zero in one-way mode, so they are left out. Lydit shows
            &ldquo;No liquidation price&rdquo; when the denominator is zero or the result is zero or below.
          </p>
          {w && (
            <div className="formulas__worked" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <div className="worked" data-ui>
                <p className="worked__title">Binance&apos;s ETH example, worked by this build</p>
                <dl className="worked__terms">
                  {w.rows.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd className="num">{v}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="worked__steps">
                  <div>
                    <dt>Numerator</dt>
                    <dd className="num">{w.numerator}</dd>
                  </div>
                  <div>
                    <dt>Denominator</dt>
                    <dd className="num">{w.denominator}</dd>
                  </div>
                  <div className="is-answer">
                    <dt>Liquidation price</dt>
                    <dd className="num">{w.price}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Every variable: the rows the calculator's breakdown links to. */}
      <section className="chapter variables" data-ink="#141414" data-ground="#ffffff" aria-labelledby="variables-title">
        <h2 id="variables-title" className="section-heading" data-reveal>
          Every variable
        </h2>
        <dl className="defs">
          {VARIABLES.map((v) => (
            <div key={v.id} id={`var-${v.id}`} className="defs__row" data-reveal>
              <dt className="defs__term">{v.name}</dt>
              <dd className="defs__meaning">{v.meaning}</dd>
              <dd className="defs__from">{v.from}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 4. Scenario links, with the page's live thing. */}
      <section className="chapter links" data-ink="#141414" data-ground="#e3e5e0" aria-labelledby="links-title">
        <div className="grid">
          <div className="links__text">
            <h2 id="links-title" className="section-heading">
              Scenario links
            </h2>
            <p className="links__lead" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              Every input is a query parameter. Opening the link restores the inputs and computes right away.
            </p>
            <p data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              A missing parameter leaves its field empty and shows no result. A malformed value shows that field&apos;s
              error. Rates travel as fractions; the form shows them as percentages. Up to five other positions travel as
              o1 to o5, or as totals in tmm and upnl.
            </p>
          </div>
          <div className="links__reader" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <LinkReader example={example} />
          </div>
        </div>
      </section>

      {/* 5. What Lydit does not cover. */}
      <section
        className="chapter not-covered"
        data-ink="#141414"
        data-ground="#ffffff"
        aria-labelledby="not-covered-title"
      >
        <div className="grid">
          <div className="not-covered__text">
            <h2 id="not-covered-title" className="section-heading" data-reveal>
              Not covered
            </h2>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              Hyperliquid publishes its formulas but no worked numbers, so there is nothing yet to hold a release to.
              Lydit adds a venue only when that venue publishes answers it can be checked against.
            </p>
          </div>
          <ul className="not-covered__list" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <li>Hedge mode</li>
            <li>Portfolio margin</li>
            <li>Fees and funding</li>
            <li>Other venues</li>
          </ul>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

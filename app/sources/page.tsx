import { ArrowSquareOut } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { CopyText } from "@/components/copy-text";
import { PageIntro, PageShell, SectionHeading } from "@/components/page-intro";
import { BINANCE_FAQ_URL, getPreset } from "@/lib/presets";
import { scenarioHref } from "@/lib/scenario";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Binance's maintenance margin and liquidation price formulas, every variable, and the scenario URL format.",
};

const MINUS = "−";

const CONTENTS = [
  { id: "maintenance-margin", label: "Maintenance margin" },
  { id: "liquidation-price", label: "Liquidation price" },
  { id: "variables", label: "Variables" },
  { id: "other-positions", label: "Other positions" },
  { id: "scenario-links", label: "Scenario links" },
  { id: "not-covered", label: "Not covered" },
];

const VARIABLES = [
  {
    id: "wb",
    name: "WB",
    meaning: "Wallet balance. In cross: the cross wallet balance. In isolated: the margin allocated to the position.",
  },
  { id: "tmm1", name: "TMM1", meaning: "Maintenance margin of all other contracts. 0 in isolated mode." },
  { id: "upnl1", name: "UPNL1", meaning: "Unrealized PnL of all other contracts. 0 in isolated mode." },
  { id: "cumb", name: "cumB", meaning: "Maintenance amount for the position's tier." },
  { id: "side", name: "Side", meaning: `1 for long, ${MINUS}1 for short.` },
  { id: "position", name: "Position", meaning: "Absolute position size in coins." },
  { id: "ep", name: "EP", meaning: "Entry price." },
  { id: "mmr", name: "MMR", meaning: "Maintenance margin rate for the position's tier, as a fraction (10% is 0.1)." },
];

const PARAM_GROUPS = [
  {
    title: "Position",
    params: [
      { name: "venue", meaning: "Always binance." },
      { name: "mode", meaning: "cross or isolated." },
      { name: "side", meaning: "long or short." },
      { name: "size", meaning: "Position size in coins." },
      { name: "ep", meaning: "Entry price." },
      { name: "mp", meaning: "Mark price." },
    ],
  },
  {
    title: "Margin",
    params: [
      { name: "wb", meaning: "Wallet balance." },
      { name: "mmr", meaning: "Maintenance margin rate as a fraction. The form shows it as a percent." },
      { name: "cum", meaning: "Maintenance amount." },
    ],
  },
  {
    title: "Other positions",
    params: [
      { name: "tmm, upnl", meaning: "TMM1 and UPNL1 entered directly as totals." },
      { name: "o1side to o5side", meaning: "Side of each other position, up to five." },
      { name: "o1size, o1ep, o1mp", meaning: "Size, entry price and mark price of position 1. Same pattern up to o5." },
      { name: "o1mmr, o1cum", meaning: "Rate (as a fraction) and maintenance amount of position 1." },
    ],
  },
];

function Formula({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <figure
      aria-label={label}
      className="num mt-6 overflow-x-auto rounded-md bg-raised px-5 py-6 text-[13px] leading-6 sm:px-6 sm:text-[15px] sm:leading-7"
    >
      {children}
    </figure>
  );
}

export default function SourcesPage() {
  const example = scenarioHref(getPreset("eth-cross").scenario);

  return (
    <PageShell>
      <PageIntro
        title="Formulas and sources"
        sub="Every term Lydit uses, where it comes from, and how a scenario link is built."
      >
        <a
          href={BINANCE_FAQ_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-accent-solid px-5 text-sm font-semibold text-on-accent transition-transform duration-150 hover:opacity-95 active:translate-y-px"
        >
          Read Binance&apos;s FAQ
          <ArrowSquareOut size={15} aria-hidden />
        </a>
      </PageIntro>

      <div className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-12 md:mt-20 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-6">
            <p className="text-[13px] font-medium text-muted">On this page</p>
            <ul className="mt-3 flex flex-col gap-1 border-l border-line">
              {CONTENTS.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-ink"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex min-w-0 max-w-[760px] flex-col gap-16 md:gap-20">
          <section id="maintenance-margin" aria-labelledby="maintenance-margin-h" className="scroll-mt-6">
            <SectionHeading
              id="maintenance-margin-h"
              title="Maintenance margin"
              intro="From Binance's FAQ, Example 1."
            />
            <Formula label="Maintenance margin formula">
              <p>MM = position notional × MMR {MINUS} maintenance amount</p>
              <p className="text-muted">position notional = size × mark price</p>
            </Formula>
          </section>

          <section id="liquidation-price" aria-labelledby="liquidation-price-h" className="scroll-mt-6">
            <SectionHeading
              id="liquidation-price-h"
              title="Liquidation price, one-way mode"
              intro="Hedge-mode terms are zero in one-way mode, so they're left out."
            />
            <Formula label="Liquidation price formula">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 sm:w-max sm:gap-x-4">
                <span>LP =</span>
                <div className="flex flex-col items-center text-center">
                  <span className="px-2">
                    WB {MINUS} TMM1 + UPNL1 + cumB {MINUS} Side × Position × EP
                  </span>
                  <span aria-hidden className="my-1.5 h-px w-full bg-ink" />
                  <span className="px-2">Position × MMR {MINUS} Side × Position</span>
                </div>
              </div>
            </Formula>
            <p className="mt-4 text-sm leading-6 text-muted">
              Lydit shows &ldquo;No liquidation price&rdquo; when the denominator is zero or the result is zero or
              below.
            </p>
          </section>

          <section id="variables" aria-labelledby="variables-h" className="scroll-mt-6">
            <SectionHeading id="variables-h" title="Variables" />
            <dl className="-mx-3 mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {VARIABLES.map((v) => (
                <div
                  key={v.id}
                  id={`var-${v.id}`}
                  className="scroll-mt-6 rounded-md px-3 py-3 transition-colors duration-300 target:bg-raised target:shadow-[inset_2px_0_0_var(--accent)]"
                >
                  <dt className="num text-[15px] font-medium text-accent">{v.name}</dt>
                  <dd className="mt-1 text-[15px] leading-6 text-muted">{v.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="other-positions" aria-labelledby="other-positions-h" className="scroll-mt-6">
            <SectionHeading
              id="other-positions-h"
              title="Other positions"
              intro="In cross margin, every other open position shares the wallet. Lydit derives TMM1 and UPNL1 from their details, or takes them as totals."
            />
            <Formula label="Other position formulas">
              <p>UPNL = Side × size × (mark {MINUS} entry)</p>
              <p>MM = size × mark × MMR {MINUS} maintenance amount</p>
              <p className="mt-3 text-muted">TMM1 = sum of MM, UPNL1 = sum of UPNL</p>
            </Formula>
          </section>

          <section id="scenario-links" aria-labelledby="scenario-links-h" className="scroll-mt-6">
            <SectionHeading
              id="scenario-links-h"
              title="Scenario links"
              intro="Every input is a query parameter. Opening the link restores the inputs and computes right away."
            />
            <div className="mt-6 rounded-md border border-line bg-surface">
              <code className="num block overflow-x-auto whitespace-nowrap px-5 py-4 text-[13px] leading-6 text-ink">
                {example}
              </code>
              <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3">
                <CopyText path={example} label="Copy example" />
                <Link href={example} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
                  Open it in the calculator
                </Link>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-10">
              {PARAM_GROUPS.map((g) => (
                <div key={g.title} className="grid gap-4 border-t border-line pt-6 md:grid-cols-[160px_1fr] md:gap-8">
                  <h3 className="text-sm font-semibold">{g.title}</h3>
                  <dl className="flex flex-col gap-3">
                    {g.params.map((p) => (
                      <div key={p.name} className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-6">
                        <dt className="num text-[14px] text-ink">{p.name}</dt>
                        <dd className="text-[15px] leading-6 text-muted">{p.meaning}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-6 text-muted">
              Missing parameters leave their field empty and show no result. A malformed value shows the field&apos;s
              error.
            </p>
          </section>

          <section id="not-covered" aria-labelledby="not-covered-h" className="scroll-mt-6">
            <SectionHeading id="not-covered-h" title="Not covered" />
            <p className="mt-3 max-w-[65ch] text-[15px] leading-7 text-muted">
              Hedge mode, portfolio margin, fees, funding and other venues. Hyperliquid publishes formulas but no worked
              numbers, so there is nothing to hold it to yet.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

import { CheckCircle, XCircle } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { HeldOut } from "@/components/how/held-out";
import { TwoAnswers } from "@/components/how/two-answers";
import { PageFooter } from "@/components/pages/page-footer";
import { TwoFieldHero } from "@/components/pages/two-field-hero";
import { calculate } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";
import { BINANCE_FAQ_URL, getPreset } from "@/lib/presets";
import { scenarioHref } from "@/lib/scenario";
import { getLinks } from "@/lib/site";

export const metadata: Metadata = {
  description:
    "A Binance futures liquidation gauge that counts your other cross positions. Every update must reproduce Binance's published answers before it goes live.",
};

// Both fragments in the call-and-response are this build's own answers, computed at render.
function answers() {
  const eth = getPreset("eth-cross").scenario;
  const show = (c: ReturnType<typeof calculate>) => (c.liq?.kind === "price" ? formatFixed(c.liq.price) : "None");
  return { withBtc: show(calculate(eth)), alone: show(calculate({ ...eth, others: [] })) };
}

function Fragment({ value, passed, label }: { value: string; passed: boolean; label: string }) {
  return (
    <div className="fragment" data-ui>
      <p className="fragment__label">{label}</p>
      <div className="fragment__row">
        <span className="fragment__figure num">{value}</span>
        <span className="fragment__unit">USDT</span>
      </div>
      <p className={`fragment__check ${passed ? "is-passed" : "is-failed"}`}>
        {passed ? <CheckCircle size={16} weight="fill" aria-hidden /> : <XCircle size={16} weight="fill" aria-hidden />}
        TestSprite check: {passed ? "passed" : "failed"}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const { withBtc, alone } = answers();
  const { demoPrUrl, suiteUrl, repoUrl } = getLinks();

  const trail = [
    { what: "Binance’s FAQ", where: "binance.com", see: "Example 2’s numbers", href: BINANCE_FAQ_URL, external: true },
    {
      what: "The ETH scenario",
      where: "this gauge",
      see: "the same inputs",
      href: scenarioHref(getPreset("eth-cross").scenario),
    },
    { what: "The caught mistake", where: "GitHub", see: "red, then green", href: demoPrUrl, external: true },
    { what: "The golden suite", where: "TestSprite", see: "the expected values", href: suiteUrl, external: true },
    { what: "The source", where: "GitHub", see: "no expected prices", href: repoUrl, external: true },
    { what: "This build’s check", where: "Lydit", see: "the commit’s result", href: "/proof" },
  ];

  return (
    <main>
      {/* 1. Hero: headline across two fields. Paper above, stone below; the type turns gold on the stone. */}
      <TwoFieldHero id="hero-title" lines={["No wrong", "number goes live"]} long>
        <p>
          A Binance futures liquidation gauge that counts your other cross positions. An update goes live only if it
          reproduces Binance&apos;s own worked examples.
        </p>
      </TwoFieldHero>

      {/* 2. Two giant figures compared, with the page's live thing. */}
      <section className="chapter specimens" data-ink="#141414" data-ground="#ffffff" aria-labelledby="two-answers">
        <div className="grid specimens__top">
          <h2 id="two-answers" className="specimens__heading" data-reveal>
            Same account, two answers
          </h2>
          <TwoAnswers />
        </div>
      </section>

      {/* 3. How it works: call and response, on pale stone. The nav's "How it works" lands here. */}
      <section
        id="how-it-works"
        className="chapter calls"
        data-ink="#141414"
        data-ground="#e3e5e0"
        aria-labelledby="calls-title"
      >
        <div className="calls__col">
          <h2 id="calls-title" className="calls__heading" data-reveal>
            How an update goes live
          </h2>
          <ol className="calls__list">
            <li data-reveal>
              <p className="calls__say">First, someone proposes a change to the math.</p>
              <p className="calls__call">
                The change: work out each position on its own. It gets a preview, a private copy of the site with the
                change in it.
              </p>
              <div className="calls__response">
                <Fragment label="The preview shows" value={alone} passed={false} />
              </div>
            </li>
            <li data-reveal>
              <p className="calls__say">Then TestSprite, an automated tester, tries Binance&apos;s example on the preview.</p>
              <p className="calls__call">
                Open Binance&apos;s ETH example. Check that the liquidation price matches the number Binance publishes.
              </p>
              <p className="calls__response calls__response--text">
                One number disagrees, so the check fails and the update is held back. The report names the example that
                failed and suggests a fix. The AI assistant writing the code never gets to see the answers.
              </p>
            </li>
            <li data-reveal className="calls__last">
              <p className="calls__say">Then the fix passes, and only then does the update go live.</p>
              <p className="calls__call">The fix: count the other positions again.</p>
              <div className="calls__response calls__response--wide">
                <Fragment label="The fixed preview shows" value={withBtc} passed />
                <p className="calls__aside">
                  The same number Binance publishes for this account. Once live, every page shows which version you are
                  using and whether it passed.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 4. The held-out answers, one lit at a time. */}
      <section className="chapter statement" data-ink="#141414" data-ground="#c9a54a" aria-labelledby="held-out">
        <div className="statement__text">
          <h2 id="held-out" className="statement__head">
            Kept out of the code’s reach:
          </h2>{" "}
          <HeldOut />
        </div>
      </section>

      {/* 5. Line-up at one type size, on the stone. */}
      <section className="chapter lineup" data-ink="#f1f1ef" data-ground="#141414" aria-labelledby="check-title">
        <h2 id="check-title" className="lineup__heading" data-reveal>
          Check it yourself
        </h2>
        <table className="lineup__table" data-reveal>
          <thead className="sr-only">
            <tr>
              <th scope="col">What</th>
              <th scope="col">Where</th>
              <th scope="col">What you will see</th>
              <th scope="col">Link</th>
            </tr>
          </thead>
          <tbody>
            {trail.map((t) => (
              <tr key={t.what}>
                <th scope="row">{t.what}</th>
                <td>{t.where}</td>
                <td>{t.see}</td>
                <td className="lineup__go">
                  {t.href ? (
                    t.external ? (
                      <a href={t.href} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      <Link href={t.href}>Open</Link>
                    )
                  ) : (
                    <span className="lineup__later">Not yet</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 6. Why Lydit: the technology, as two columns with highlighted facts. */}
      <section className="chapter story" data-ink="#141414" data-ground="#ffffff" aria-labelledby="story-title">
        <h2 id="story-title" className="story__heading" data-reveal>
          Why Lydit
        </h2>
        <div className="story__text" data-reveal>
          <p>
            <strong>Lydit</strong> works out Binance&apos;s one-way liquidation formula with{" "}
            <mark className="hl hl--gold">exact decimal math</mark>, never rounded floating point, so every figure is
            right to the cent before it is shown. It counts your{" "}
            <mark className="hl hl--gold">other cross positions</mark>: their unrealized PnL and maintenance margin feed
            into the formula the way Binance&apos;s own engine uses them. Every input travels{" "}
            <mark className="hl hl--gold">in the link</mark>, so a shared link reopens the exact scenario, and every
            result shows its working step by step.
          </p>
          <p>
            The answers it is checked against are{" "}
            <mark className="hl hl--gold">Binance&apos;s own worked examples</mark>, and they are kept out of the code
            entirely, in an <mark className="hl hl--gold">outside test suite</mark>. An update can change the formula
            but never the answers, so a wrong number fails the check instead of quietly passing. Every page then shows
            which version is serving you and whether it passed.{" "}
            <Link href="/proof" className="hl hl--stone">
              A number that does not match never goes live.
            </Link>
          </p>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

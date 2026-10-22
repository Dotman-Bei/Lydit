import { CheckCircle, XCircle } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeldOut } from "@/components/how/held-out";
import { TwoAnswers } from "@/components/how/two-answers";
import { PageFooter } from "@/components/pages/page-footer";
import { calculate } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";
import { BINANCE_FAQ_URL, getPreset } from "@/lib/presets";
import { scenarioHref } from "@/lib/scenario";
import { getLinks } from "@/lib/site";
import fourree from "@/public/archive/fourree-stater.jpg";
import stater from "@/public/archive/gold-stater.jpg";
import stater2 from "@/public/archive/gold-stater-2.jpg";
import touchstones from "@/public/archive/2-touchstones.jpg";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Every pull request preview must reproduce Binance's published answers, and those answers live outside the repo.",
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

export default function HowItWorksPage() {
  const { withBtc, alone } = answers();
  const { demoPrUrl, suiteUrl, repoUrl } = getLinks();

  const trail = [
    { what: "Binance’s FAQ", where: "binance.com", see: "Example 2’s numbers", href: BINANCE_FAQ_URL, external: true },
    {
      what: "The ETH scenario",
      where: "this calculator",
      see: "the same inputs",
      href: scenarioHref(getPreset("eth-cross").scenario),
    },
    { what: "The demo PR", where: "GitHub", see: "red, then green", href: demoPrUrl, external: true },
    { what: "The golden suite", where: "TestSprite", see: "the expected values", href: suiteUrl, external: true },
    { what: "The source", where: "GitHub", see: "no expected prices", href: repoUrl, external: true },
    { what: "This build’s check", where: "Lydit", see: "the commit’s result", href: "/proof" },
  ];

  return (
    <main>
      {/* 1. Hero: headline across two fields. Paper above, stone below; the type turns gold on the stone. */}
      <section className="hero" data-ink="#141414" data-ground="#ffffff" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero__title">
          <span className="hero__copy hero__copy--paper lines">
            <span className="line">
              <span data-line style={{ "--i": 0 } as React.CSSProperties}>
                Held to
              </span>
            </span>
            <span className="line">
              <span data-line style={{ "--i": 1 } as React.CSSProperties}>
                the answer
              </span>
            </span>
          </span>
          <span className="hero__copy hero__copy--stone lines" aria-hidden="true">
            <span className="line">
              <span data-line style={{ "--i": 0 } as React.CSSProperties}>
                Held to
              </span>
            </span>
            <span className="line">
              <span data-line style={{ "--i": 1 } as React.CSSProperties}>
                the answer
              </span>
            </span>
          </span>
        </h1>
        <p className="hero__sub" data-rise>
          A Binance futures liquidation calculator. No release merges unless it reproduces Binance&apos;s own worked
          examples.
        </p>
      </section>

      {/* 2. Two giant figures compared, with the page's live thing. */}
      <section className="chapter specimens" data-ink="#141414" data-ground="#ffffff" aria-labelledby="two-answers">
        <div className="grid specimens__top">
          <h2 id="two-answers" className="specimens__heading" data-reveal>
            Same account, two answers
          </h2>
          <TwoAnswers />
        </div>
      </section>

      {/* 3. Call and response, on pale stone. */}
      <section className="chapter calls" data-ink="#141414" data-ground="#e3e5e0" aria-labelledby="calls-title">
        <div className="calls__col">
          <h2 id="calls-title" className="calls__heading" data-reveal>
            From pull request to merge
          </h2>
          <ol className="calls__list">
            <li data-reveal>
              <p className="calls__say">First, a pull request changes the math.</p>
              <p className="calls__call">
                <code>simplify: compute liquidation per position</code>
              </p>
              <div className="calls__response">
                <Fragment label="The preview’s liquidation price" value={alone} passed={false} />
              </div>
            </li>
            <li data-reveal>
              <p className="calls__say">Then TestSprite opens Binance&apos;s example on the preview.</p>
              <p className="calls__call">
                Open the ETH cross scenario. Check that the liquidation price matches Binance&apos;s published value.
              </p>
              <p className="calls__response calls__response--text">
                One number disagrees, so the check fails and the merge is blocked. The report names the case and gives a
                fix prompt; the agent never holds a TestSprite key.
              </p>
            </li>
            <li data-reveal className="calls__last">
              <p className="calls__say">Then the fix goes green, and only then can it merge.</p>
              <p className="calls__call">
                <code>fix: restore other-position terms</code>
              </p>
              <div className="calls__response calls__response--wide">
                <Fragment label="The fixed preview’s liquidation price" value={withBtc} passed />
                <p className="calls__aside">
                  The same number Binance publishes for this account. The live site then shows the check for the commit
                  it serves, on every page.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 4. The page's one rest: the touchstone itself. */}
      <figure className="band" data-ink="#f1f1ef" data-ground="#141414">
        <div className="band__frame">
          <Image
            src={touchstones}
            alt="Two black touchstones on white; the square one on the left carries several streaks of gold"
            sizes="100vw"
            className="band__img"
          />
        </div>
        <figcaption className="band__caption">Two touchstones. The streaks on the left one are gold.</figcaption>
      </figure>

      {/* 5. The held-out answers, one lit at a time. */}
      <section className="chapter statement" data-ink="#141414" data-ground="#c9a54a" aria-labelledby="held-out">
        <div className="statement__text">
          <h2 id="held-out" className="statement__head">
            Held out of every pull request:
          </h2>{" "}
          <HeldOut />
        </div>
      </section>

      {/* 6. Line-up at one type size, on the stone. */}
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

      {/* 7. The name, as two columns with highlighted facts. */}
      <section className="chapter story" data-ink="#141414" data-ground="#ffffff" aria-labelledby="story-title">
        <h2 id="story-title" className="story__heading" data-reveal>
          Why Lydit
        </h2>
        <div className="story__text" data-reveal>
          <p>
            <strong>Lydit</strong> takes its name from <mark className="hl hl--gold">lydite</mark>, the black stone of
            ancient Lydia that assayers called the touchstone. Around 560 BCE, under{" "}
            <mark className="hl hl--gold">Croesus</mark>, Lydia struck some of the first coins of pure gold, and the
            stone was how a buyer told gold from a good imitation. The metal was drawn across the stone and its streak
            laid beside streaks from <mark className="hl hl--gold">reference needles</mark> of known purity, so the
            sample was never judged against itself.
          </p>
          <p>
            Lydit works the same way. <mark className="hl hl--gold">Binance&apos;s published examples</mark> are the
            needles. Every release is drawn against them on its{" "}
            <mark className="hl hl--gold">pull request preview</mark>, and the needles sit where the pull request cannot
            reach.{" "}
            <Link href="/proof" className="hl hl--stone">
              A number that does not match does not merge.
            </Link>
          </p>
        </div>
      </section>

      {/* 8. Gold, and gold-coloured. */}
      <section className="chapter coins" data-ink="#141414" data-ground="#e3e5e0" aria-labelledby="coins-title">
        <div className="coins__head">
          <h2 id="coins-title" className="coins__heading" data-reveal>
            Gold, and gold-coloured
          </h2>
          <p className="coins__text" data-reveal>
            Two Lydian staters of solid gold, and a stater from Kyzikos with a gold skin over a base-metal core. On
            sight they pass for one another; a reference tells them apart.
          </p>
        </div>
        <div className="coins__row">
          <figure className="coin" data-reveal style={{ "--i": 0 } as React.CSSProperties}>
            <div className="coin__frame">
              <Image
                src={stater}
                alt="Lumpy gold coin stamped with a lion and a bull facing each other"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <figcaption>Gold stater, Lydia, ca. 560–546 BCE</figcaption>
          </figure>
          <figure className="coin" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <div className="coin__frame">
              <Image
                src={stater2}
                alt="A second gold coin of the same type, the lion and bull struck more clearly"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <figcaption>Gold stater, Lydia, ca. 560–546 BCE</figcaption>
          </figure>
          <figure className="coin" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <div className="coin__frame">
              <Image
                src={fourree}
                alt="A worn round coin showing a seated figure, its gold surface rubbed through to darker metal at the rim"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <figcaption>Fourrée stater, Kyzikos, ca. 600–500 BC: gold over base metal</figcaption>
          </figure>
        </div>
      </section>

      <PageFooter pictures={["2-touchstones.jpg", "gold-stater.jpg", "gold-stater-2.jpg", "fourree-stater.jpg"]} />
    </main>
  );
}

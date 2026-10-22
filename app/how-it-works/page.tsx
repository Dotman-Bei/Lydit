import { ArrowRight, ArrowSquareOut, CheckCircle, XCircle } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { SameAccount } from "@/components/how/same-account";
import { PageIntro, PageShell, SectionHeading } from "@/components/page-intro";
import { BINANCE_FAQ_URL, getPreset } from "@/lib/presets";
import { scenarioHref } from "@/lib/scenario";
import { getLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Every pull request preview must reproduce Binance's published answers, and those answers live outside the repo.",
};

const FLOW = [
  {
    title: "Open a pull request",
    body: "A person or a coding agent changes the math. Vercel builds a preview for that PR.",
    tone: "neutral",
  },
  {
    title: "TestSprite tests the preview",
    body: "The GitHub App waits for the preview, then runs the golden suite against it in a browser.",
    tone: "neutral",
  },
  {
    title: "A wrong number blocks the merge",
    body: "Each step checks one displayed number against Binance's published value. One mismatch fails the check.",
    tone: "fail",
  },
  {
    title: "The report drives the fix",
    body: "TestSprite's PR comment names the failing case and gives a fix prompt. The agent never holds a TestSprite key.",
    tone: "neutral",
  },
  {
    title: "Green, then merge",
    body: "The check reruns on the fix commit. Once it passes, the PR can merge.",
    tone: "pass",
  },
  {
    title: "Production shows it",
    body: "The live app reads the check for the commit it serves and shows it on every page.",
    tone: "neutral",
  },
] as const;

const NODE = {
  neutral: "border-line-strong bg-bg",
  fail: "border-fail bg-fail",
  pass: "border-pass bg-pass",
} as const;

const buttonBase =
  "inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-semibold transition-transform duration-150 active:translate-y-px";

export default function HowItWorksPage() {
  const { demoPrUrl, suiteUrl, repoUrl } = getLinks();

  const trail = [
    {
      title: "Binance's FAQ",
      body: "Example 2 lists the ETH and BTC inputs and Binance's answers.",
      href: BINANCE_FAQ_URL,
      label: "Read Binance's FAQ",
      external: true,
    },
    {
      title: "The same inputs on Lydit",
      body: "Open the ETH scenario and compare it with the FAQ.",
      href: scenarioHref(getPreset("eth-cross").scenario),
      label: "Open the ETH scenario",
      external: false,
    },
    {
      title: "The demo pull request",
      body: "Red on a wrong number, green after the fix.",
      href: demoPrUrl,
      label: "Open the demo PR",
      external: true,
      missing: "Linked here once the PR is open.",
    },
    {
      title: "The TestSprite suite",
      body: "Where the expected values live, one number per step.",
      href: suiteUrl,
      label: "Open the suite",
      external: true,
      missing: "Linked here once the suite is shared.",
    },
    {
      title: "The source",
      body: "Search it for an expected liquidation price. You won't find one.",
      href: repoUrl,
      label: "Browse the repo",
      external: true,
      missing: "Linked here once the repo is public.",
    },
    {
      title: "This build's check",
      body: "The commit serving you and its TestSprite result.",
      href: "/proof",
      label: "See the proof",
      external: false,
    },
  ];

  return (
    <PageShell>
      <PageIntro
        title="The pull request can't grade itself"
        sub="Each PR preview must reproduce Binance's published answers. Those answers live in TestSprite, out of the PR's reach."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {demoPrUrl && (
            <a
              href={demoPrUrl}
              target="_blank"
              rel="noreferrer"
              className={`${buttonBase} bg-accent-solid text-on-accent hover:opacity-95`}
            >
              Open the demo PR
              <ArrowSquareOut size={15} aria-hidden />
            </a>
          )}
          <Link
            href="/proof"
            className={
              demoPrUrl
                ? `${buttonBase} border border-line text-ink hover:border-line-strong`
                : `${buttonBase} bg-accent-solid text-on-accent hover:opacity-95`
            }
          >
            See the proof
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="same-account" className="mt-20 md:mt-24">
        <SectionHeading
          id="same-account"
          title="Same account, two answers"
          intro="Binance's ETH example shares its cross wallet with a BTC position. Drop that position, as a per-position calculator does, and the price moves."
        />
        <SameAccount />
      </section>

      <section
        aria-labelledby="flow"
        className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SectionHeading
            id="flow"
            title="From pull request to production"
            intro="The gate runs on every PR. It adds nothing to the repo: the GitHub App holds the trigger, and the suite holds the answers."
          />
        </div>
        <ol className="relative flex flex-col gap-8 pl-8">
          <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
          {FLOW.map((step) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden
                className={`absolute -left-8 top-[7px] size-[11px] rounded-[3px] border-2 ${NODE[step.tone]}`}
              />
              <h3 className="text-base font-semibold leading-6">{step.title}</h3>
              <p className="mt-1 max-w-[56ch] text-[15px] leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="answer-key" className="mt-20 md:mt-28">
        <SectionHeading id="answer-key" title="Where the answer key lives" />
        <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
          <div className="flex flex-col gap-5 bg-surface p-6 sm:p-8">
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <XCircle size={18} weight="fill" className="text-fail" aria-hidden />
                Tests in the repo
              </h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">
                The PR can edit the formula and the expected value in one diff. The check stays green.
              </p>
            </div>
            <Reach
              rows={[
                { path: "lib/engine.ts", note: "the formula", inReach: true },
                { path: "tests/liquidation.test.ts", note: "the expected value", inReach: true },
              ]}
            />
          </div>
          <div className="flex flex-col gap-5 bg-surface p-6 sm:p-8">
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <CheckCircle size={18} weight="fill" className="text-pass" aria-hidden />
                Holdout in TestSprite
              </h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">
                The expected values sit in the suite. The PR can only change code, so a wrong formula meets the old
                answer.
              </p>
            </div>
            <Reach
              rows={[
                { path: "lib/engine.ts", note: "the formula", inReach: true },
                { path: "TestSprite suite", note: "the expected value", inReach: false },
              ]}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="check" className="mt-20 md:mt-28">
        <SectionHeading
          id="check"
          title="Check it yourself"
          intro="Follow the claim from Binance's page to the build you're using."
        />
        <ol className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {trail.map((t) => (
            <li key={t.title} className="flex flex-col gap-2 border-t-2 border-line pt-4">
              <h3 className="text-base font-semibold">{t.title}</h3>
              <p className="text-[15px] leading-6 text-muted">{t.body}</p>
              {t.href ? (
                t.external ? (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex w-max items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
                  >
                    {t.label}
                    <ArrowSquareOut size={13} aria-hidden />
                  </a>
                ) : (
                  <Link
                    href={t.href}
                    className="mt-1 inline-flex w-max items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
                  >
                    {t.label}
                    <ArrowRight size={13} aria-hidden />
                  </Link>
                )
              ) : (
                <p className="mt-1 text-sm text-muted">{t.missing}</p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="name" className="mt-20 max-w-[65ch] md:mt-28">
        <span aria-hidden className="block h-1 w-10 rounded-md bg-accent" />
        <h2 id="name" className="mt-5 text-[22px] font-semibold leading-7 tracking-tight">
          Why &ldquo;Lydit&rdquo;
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          Lydite is the touchstone. Assayers streaked gold on it next to reference needles of known purity, so the gold
          was judged against something it couldn&apos;t change.
        </p>
      </section>
    </PageShell>
  );
}

function Reach({ rows }: { rows: { path: string; note: string; inReach: boolean }[] }) {
  return (
    <ul className="flex flex-col gap-2 rounded-md bg-raised p-4">
      {rows.map((r) => (
        <li key={r.path} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[14px]">
          <span>
            <code className="num text-ink">{r.path}</code> <span className="text-muted">{r.note}</span>
          </span>
          <span className={`text-[13px] font-medium ${r.inReach ? "text-ink" : "text-pass"}`}>
            {r.inReach ? "in the PR's reach" : "out of reach"}
          </span>
        </li>
      ))}
    </ul>
  );
}

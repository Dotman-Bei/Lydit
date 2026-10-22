import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ExternalLink } from "@/components/external-link";
import { PageIntro, PageShell, SectionHeading } from "@/components/page-intro";
import { STATUS_TEXT, StatusGlyph, statusTone } from "@/components/proof-status";
import { getBuildInfo } from "@/lib/build";
import { BEHAVIOUR_CASES, DERIVED_CASES, PUBLISHED_SCENARIOS } from "@/lib/cases";
import { BINANCE_FAQ_URL } from "@/lib/presets";
import { getProof } from "@/lib/proof";

export const metadata: Metadata = {
  title: "Proof",
  description: "The commit serving this page, its TestSprite check, and the golden cases it must pass.",
};

const ENV_LABEL = { production: "Production", preview: "Preview", development: "Local development" } as const;

export default function ProofPage() {
  const build = getBuildInfo();

  return (
    <PageShell>
      <PageIntro
        title="The check behind this build"
        sub="Which commit is serving you, and whether it passed TestSprite's golden suite."
      />

      <section aria-label="Build status" className="mt-10 rounded-md border border-line bg-surface">
        <dl className="grid gap-px overflow-hidden rounded-md bg-line md:grid-cols-3">
          <Item label="Commit" className="md:col-span-2">
            {build.sha ? (
              <code className="num text-[15px] [overflow-wrap:anywhere]" data-testid="proof-page-sha">
                {build.sha}
              </code>
            ) : (
              <span data-testid="proof-page-sha">No commit. This is a local build.</span>
            )}
          </Item>
          <Item label="Environment">
            {ENV_LABEL[build.env]}
            {build.env === "preview" && build.pr && (
              <span className="text-muted">
                {" "}
                for <span className="num">PR #{build.pr}</span>
              </span>
            )}
          </Item>
          <Suspense fallback={<StatusSkeleton />}>
            <StatusItems />
          </Suspense>
        </dl>
      </section>

      <section aria-labelledby="published" className="mt-20 md:mt-24">
        <SectionHeading
          id="published"
          title="Binance's published examples"
          intro="Each case opens the inputs from Binance's FAQ. Open it, then compare the result with Binance's own page."
        />
        <ol className="mt-8 overflow-hidden rounded-md border border-line bg-surface">
          {PUBLISHED_SCENARIOS.map((c, i) => (
            <li
              key={c.title}
              className={`grid gap-4 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_240px_150px] md:items-center md:gap-8 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold">{c.title}</h3>
                <p className="max-w-[56ch] text-sm leading-6 text-muted">{c.summary}</p>
              </div>
              <ul className="flex flex-col gap-1.5" aria-label="Checks">
                {c.checks.map((check) => (
                  <li key={check.id} className="grid grid-cols-[40px_1fr] gap-2 text-sm leading-5">
                    <span className="num text-[13px] text-muted">{check.id}</span>
                    <span>{check.what}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:flex-col md:items-end">
                <Link
                  href={c.href}
                  prefetch={false}
                  data-testid={`case-${c.checks[0].id}`}
                  className="inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline"
                >
                  {c.hrefLabel}
                  <ArrowRight size={13} aria-hidden />
                </Link>
                {c.fromFaq && <ExternalLink href={BINANCE_FAQ_URL}>Binance FAQ</ExternalLink>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-20 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-16">
        <CaseGroup
          id="derived"
          title="Derived edge cases"
          intro="Computed from the formula and labelled as derived in the suite. Their inputs live in the suite with their answers."
          cases={DERIVED_CASES}
        />
        <CaseGroup
          id="behaviour"
          title="Behaviour checks"
          intro="What the app must do around the numbers, checked in the same run."
          cases={BEHAVIOUR_CASES}
        />
      </div>

      <section aria-labelledby="holdout" className="mt-20 border-l-2 border-accent pl-6 md:mt-24">
        <SectionHeading id="holdout" title="Why the expected numbers aren't here" />
        <p className="mt-3 max-w-[65ch] text-[15px] leading-7 text-muted">
          If the answers lived in this repo, one pull request could change the formula and the expected value together,
          and the check would stay green. They live in the TestSprite suite, which no pull request can edit. Search the
          repo: no source, test or fixture file holds an expected liquidation price.
        </p>
        <Link
          href="/how-it-works"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          How the gate works
          <ArrowRight size={13} aria-hidden />
        </Link>
      </section>
    </PageShell>
  );
}

function Item({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 bg-surface px-5 py-4 sm:px-6 ${className}`}>
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="text-[15px] leading-6">{children}</dd>
    </div>
  );
}

async function StatusItems() {
  await connection();
  const proof = await getProof();
  const checkedAt = new Date(proof.checkedAt).toUTCString().replace("GMT", "UTC");
  return (
    <>
      <Item label="TestSprite check">
        <span className="flex items-center gap-2">
          <StatusGlyph status={proof.status} size={18} />
          <span className={`font-medium ${statusTone(proof.status)}`} data-testid="proof-page-status">
            {STATUS_TEXT[proof.status]}
          </span>
        </span>
      </Item>
      <Item label="Checked at">
        <span className="num text-[14px]">{checkedAt}</span>
      </Item>
      <div className="flex items-center bg-surface px-5 py-4 sm:px-6">
        {proof.url ? (
          <a
            href={proof.url}
            target="_blank"
            rel="noreferrer"
            data-testid="proof-page-link"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-accent-solid px-5 text-sm font-semibold text-on-accent transition-transform duration-150 hover:opacity-95 active:translate-y-px"
          >
            Open the check
            <ArrowSquareOut size={15} aria-hidden />
          </a>
        ) : (
          <p className="text-sm leading-6 text-muted">
            {proof.status === "local"
              ? "Local builds have no check. Deployed builds link to theirs here."
              : "No check link yet for this commit."}
          </p>
        )}
      </div>
    </>
  );
}

function StatusSkeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} aria-busy="true" className="flex flex-col gap-2 bg-surface px-5 py-4 sm:px-6">
          <span className="h-3 w-24 rounded-md bg-raised" />
          <span className="h-4 w-32 animate-pulse rounded-md bg-raised" />
        </div>
      ))}
    </>
  );
}

function CaseGroup({
  id,
  title,
  intro,
  cases,
}: {
  id: string;
  title: string;
  intro: string;
  cases: { id: string; title: string }[];
}) {
  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id} title={title} intro={intro} />
      <ul className="mt-6 flex flex-col gap-3">
        {cases.map((c) => (
          <li key={c.id} className="grid grid-cols-[48px_1fr] gap-3 text-[15px] leading-6">
            <span className="num text-[13px] leading-6 text-muted">{c.id}</span>
            <span>{c.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { ArrowSquareOut } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { loadProof, StatusGlyph, statusClass, envText, STATUS_SHORT } from "@/components/proof/status";
import { GOLDEN_CASES, type GoldenCase } from "@/lib/cases";
import { BINANCE_FAQ_URL } from "@/lib/presets";
import type { ProofStatus } from "@/lib/proof";

export const metadata: Metadata = {
  title: "Proof",
  description: "The commit serving this page, its TestSprite check, and the golden cases it must pass.",
};

const WORD: Record<ProofStatus, string> = {
  passed: "Passed",
  failed: "Failed",
  pending: "Running",
  "not-found": "No check yet",
  unavailable: "Unknown",
  local: "Local build",
};

const MEANING: Record<ProofStatus, string> = {
  passed: "Every golden case passed on this commit, including Binance's published examples.",
  failed: "At least one golden case failed on this commit. Its numbers may not match Binance's.",
  pending: "The golden suite is running against this commit now.",
  "not-found": "TestSprite has not reported a check for this commit yet.",
  unavailable: "GitHub could not be reached, so the result is unknown. It is never shown as passed.",
  local: "A local build has no commit, so there is nothing to check.",
};

export default function ProofPage() {
  return (
    <Suspense fallback={<ProofLoading />}>
      <ProofScreen />
    </Suspense>
  );
}

async function ProofScreen() {
  const { build, proof } = await loadProof();
  const checkedAt = new Date(proof.checkedAt);
  const time = checkedAt.toISOString().slice(11, 16);
  const day = checkedAt.toISOString().slice(0, 10);

  return (
    <>
      <header className="title-row">
        <div>
          <h1 className="title">Proof</h1>
          <p className="subline">
            {build.sha ? (
              <>
                Commit <span className="num">{build.shortSha}</span> {envText(build)}.
              </>
            ) : (
              "This is a local build, so it has no commit to check."
            )}
          </p>
        </div>
      </header>

      {/* Row 1: 5 + 7 of the 12 columns. Row 2: the suite at full width. */}
      <div className="proof-grid">
        <section className="card status-card" aria-labelledby="status-title">
          <h2 id="status-title" className="answer__label">
            TestSprite check
          </h2>
          <p className="status-card__result">
            <StatusGlyph status={proof.status} size={28} />
            <span className={`status-card__word ${statusClass(proof.status)}`} data-testid="proof-page-status">
              {WORD[proof.status]}
            </span>
          </p>
          <p className="status-card__meaning">{MEANING[proof.status]}</p>
          <p className="status-card__checked num">
            Checked {day} at {time} UTC
          </p>
          <div className="status-card__foot">
            {proof.url ? (
              <a
                href={proof.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn--primary"
                data-testid="proof-page-link"
              >
                Open the check
                <ArrowSquareOut size={15} aria-hidden />
              </a>
            ) : (
              <Link href="/#how-it-works" className="btn btn--secondary">
                How the gate works
              </Link>
            )}
          </div>
        </section>

        <section className="card" aria-labelledby="build-title">
          <h2 id="build-title" className="card__title">
            Build serving this page
          </h2>
          <dl className="kv">
            <div>
              <dt>Commit</dt>
              <dd className="kv__id" data-testid="proof-page-sha">
                {build.sha ?? "-"}
              </dd>
            </div>
            <div>
              <dt>Environment</dt>
              <dd>
                {build.env === "development" ? "Local development" : build.env === "preview" ? "Preview" : "Production"}
              </dd>
            </div>
            <div>
              <dt>Pull request</dt>
              <dd className="num">{build.pr ? `#${build.pr}` : "-"}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{build.ref ?? "-"}</dd>
            </div>
          </dl>
        </section>

        <section className="card proof-grid__suite" aria-labelledby="suite-title">
          <div className="card__head">
            <h2 id="suite-title" className="card__title">
              Golden suite <span className="count num">{GOLDEN_CASES.length} cases</span>
            </h2>
          </div>
          <p className="suite__note">
            The expected values live in the TestSprite suite, not in this repo, so no pull request can change them along
            with the formula. Search the repo: no file holds an expected liquidation price.
          </p>
          <table className="table suite">
            <thead>
              <tr>
                <th scope="col">Case</th>
                <th scope="col">Name</th>
                <th scope="col">Checks</th>
                <th scope="col">Kind</th>
                <th scope="col">Source</th>
                <th scope="col">Starts from</th>
                <th scope="col" className="is-end suite__result">
                  This commit
                </th>
              </tr>
            </thead>
            <tbody>
              {GOLDEN_CASES.map((c) => (
                <tr key={c.id}>
                  <td className="suite__id num">{c.id}</td>
                  <th scope="row">{c.name}</th>
                  <td className="suite__checks">{c.checks}</td>
                  <td>
                    <span className="chip">{c.kind}</span>
                  </td>
                  <td className="suite__source">
                    <CaseSource kind={c.kind} />
                  </td>
                  <td className="suite__start">
                    {c.href ? (
                      <Link href={c.href} prefetch={false} className="row-link" data-testid={`case-${c.id}`}>
                        {c.id === "G-0" ? "/api/build" : "Binance's inputs"}
                      </Link>
                    ) : (
                      <span className="suite__held">Inputs held in the suite</span>
                    )}
                  </td>
                  <td className="is-end suite__result" data-testid={`case-${c.id}-status`}>
                    <span className="suite__result-in">
                      <StatusGlyph status={proof.status} size={14} />
                      {STATUS_SHORT[proof.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

// Where a case's expected answer comes from (PRD P-6). Links only; the answers themselves stay in the suite.
function CaseSource({ kind }: { kind: GoldenCase["kind"] }) {
  if (kind === "Published")
    return (
      <a href={BINANCE_FAQ_URL} target="_blank" rel="noreferrer" className="row-link">
        Binance FAQ
      </a>
    );
  if (kind === "Derived")
    return (
      <Link href="/sources" className="row-link">
        Binance&apos;s formula
      </Link>
    );
  return <span className="suite__held">Lydit&apos;s spec</span>;
}

function ProofLoading() {
  return (
    <div aria-busy="true">
      <header className="title-row">
        <div>
          <h1 className="title">Proof</h1>
          <span className="bar bar--short" style={{ marginTop: 10 }} />
        </div>
      </header>
      <div className="proof-grid">
        <section className="card status-card">
          <h2 className="answer__label">TestSprite check</h2>
          <span className="bar bar--figure" />
        </section>
        <section className="card">
          <h2 className="card__title">Build serving this page</h2>
          <span className="bar bar--field" style={{ marginTop: 12 }} />
        </section>
      </div>
    </div>
  );
}

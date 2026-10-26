import Link from "next/link";
import { Suspense } from "react";
import { Mark } from "../mark";
import { loadProof, STATUS_SHORT, STATUS_TEXT, StatusGlyph } from "../proof/status";
import { AppMenu, AppNavLinks } from "./nav";

// No-sidebar shell: a 48px bar on the page ground over the centred column (app sheet §4).
export function AppBar() {
  return (
    <header className="appbar">
      <div className="appbar__in">
        <Link href="/" className="brand" aria-label="Lydit, home">
          <Mark />
          <span>Lydit</span>
        </Link>
        <nav aria-label="Main" className="appbar__nav">
          <AppNavLinks />
        </nav>
        <div className="appbar__right">
          <Suspense fallback={<ProofChipLoading />}>
            <ProofChip />
          </Suspense>
          <AppMenu />
        </div>
      </div>
    </header>
  );
}

// One word in the bar, like the landing nav; the commit, environment and result stay available
// to screen readers and on hover, and in full on /proof.
async function ProofChip() {
  const { build, proof } = await loadProof();
  if (!build.sha) {
    return (
      <Link href="/proof" className="proof-chip" data-testid="proof-line" title="Local build">
        <StatusGlyph status="local" />
        Proof
        <span className="sr-only">
          : <span data-testid="proof-sha">Local build</span>
        </span>
      </Link>
    );
  }
  const env = build.env === "preview" ? "Preview" : build.env === "production" ? "Production" : "Development";
  const pr = build.env === "preview" && build.pr ? ` PR #${build.pr}` : "";
  return (
    <Link
      href="/proof"
      className="proof-chip"
      data-testid="proof-line"
      title={`Commit ${build.shortSha}, ${env}${pr}: ${STATUS_SHORT[proof.status]}`}
    >
      <StatusGlyph status={proof.status} />
      Proof
      <span className="sr-only">
        : commit <span data-testid="proof-sha">{build.shortSha}</span>,{" "}
        <span data-testid="proof-env">
          {env}
          {pr && <span data-testid="proof-pr">{pr}</span>}
        </span>
        , <span data-testid="proof-status">{STATUS_TEXT[proof.status]}</span>
      </span>
    </Link>
  );
}

function ProofChipLoading() {
  return (
    <span className="proof-chip" aria-busy="true">
      <span className="bar bar--glyph" />
      <span className="bar bar--short" />
    </span>
  );
}

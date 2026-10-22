import Link from "next/link";
import { Suspense } from "react";
import { Mark } from "../mark";
import { loadProof, STATUS_SHORT, STATUS_TEXT, StatusGlyph, statusClass } from "../proof/status";
import { AppMenu, AppNavLinks } from "./nav";

// No-sidebar shell: a 48px bar on the page ground over the centred column (app sheet §4).
export function AppBar() {
  return (
    <header className="appbar">
      <div className="appbar__in">
        <Link href="/" className="brand" aria-label="Lydit, calculator">
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

async function ProofChip() {
  const { build, proof } = await loadProof();
  if (!build.sha) {
    return (
      <Link href="/proof" className="proof-chip" data-testid="proof-line">
        <StatusGlyph status="local" />
        <span data-testid="proof-sha">Local build</span>
      </Link>
    );
  }
  const env = build.env === "preview" ? "Preview" : build.env === "production" ? "Production" : "Development";
  return (
    <Link href="/proof" className="proof-chip" data-testid="proof-line" title="The commit serving this page">
      <StatusGlyph status={proof.status} />
      <span className="proof-chip__sha num" data-testid="proof-sha">
        {build.shortSha}
      </span>
      <span className="proof-chip__env" data-testid="proof-env">
        {env}
        {build.env === "preview" && build.pr && (
          <span className="num" data-testid="proof-pr">
            {" "}
            PR #{build.pr}
          </span>
        )}
      </span>
      <span className={`proof-chip__status ${statusClass(proof.status)}`}>
        <span className="proof-chip__long" data-testid="proof-status">
          {STATUS_TEXT[proof.status]}
        </span>
        <span className="proof-chip__short" aria-hidden="true">
          {STATUS_SHORT[proof.status]}
        </span>
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

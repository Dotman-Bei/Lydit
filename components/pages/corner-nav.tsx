import Link from "next/link";
import { Suspense } from "react";
import { Mark } from "../mark";
import { loadProof, STATUS_SHORT, StatusGlyph } from "../proof/status";
import { PageMenu } from "./page-menu";

// The direction's navigation: no bar, the wordmark in one corner and a few links with the one action in
// the other. It is fixed, and its ink follows the chapter beneath it (colour by chapter).
export function CornerNav() {
  return (
    <header className="corner-nav">
      <Link href="/" className="corner-nav__brand" aria-label="Lydit, home">
        <Mark size={20} />
        <span>Lydit</span>
      </Link>
      <nav aria-label="Main" className="corner-nav__links">
        <Link href="/#how-it-works" className="corner-nav__link">
          How it works
        </Link>
        <Link href="/sources" className="corner-nav__link">
          Sources
        </Link>
        <Suspense fallback={<span className="corner-nav__link">Proof</span>}>
          <ProofLink />
        </Suspense>
      </nav>
      <Link href="/gauge" className="page-button">
        Open the gauge
      </Link>
      <PageMenu />
    </header>
  );
}

async function ProofLink() {
  const { build, proof } = await loadProof();
  return (
    <Link href="/proof" className="corner-nav__link corner-nav__proof" data-testid="proof-line">
      <StatusGlyph status={proof.status} size={15} />
      <span data-testid="proof-sha" className="num">
        {build.shortSha ?? "Local build"}
      </span>
      {build.shortSha && <span data-testid="proof-status">{STATUS_SHORT[proof.status]}</span>}
    </Link>
  );
}

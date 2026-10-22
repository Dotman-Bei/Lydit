import { ArrowSquareOut } from "@phosphor-icons/react/ssr";
import { connection } from "next/server";
import { Suspense } from "react";
import { getBuildInfo, type BuildInfo } from "@/lib/build";
import { getProof } from "@/lib/proof";
import { STATUS_TEXT, StatusGlyph, statusTone } from "./proof-status";

// PRD P-1, P-2: every page states which commit is serving it and that commit's TestSprite result.

export function envText(build: BuildInfo) {
  if (build.env === "production") return "in production";
  if (build.env === "preview") return build.pr ? "on a preview for" : "on a preview";
  return "in development";
}

export function ProofLine() {
  const build = getBuildInfo();
  return (
    <div className="border-b border-line bg-surface" data-testid="proof-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-2 text-[13px] leading-5 md:h-10 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-0">
        {build.sha ? (
          <>
            <p className="text-muted">
              Serving commit{" "}
              <code className="num text-ink" data-testid="proof-sha">
                {build.shortSha}
              </code>{" "}
              <span data-testid="proof-env">{envText(build)}</span>
              {build.env === "preview" && build.pr && (
                <>
                  {" "}
                  <span className="num text-ink" data-testid="proof-pr">
                    PR #{build.pr}
                  </span>
                </>
              )}
            </p>
            <Suspense fallback={<StatusSkeleton />}>
              <StatusLine />
            </Suspense>
          </>
        ) : (
          <p className="text-muted" data-testid="proof-sha">
            Local build. No commit to check.
          </p>
        )}
      </div>
    </div>
  );
}

async function StatusLine() {
  await connection();
  const proof = await getProof();
  return (
    <p className="flex items-center gap-1.5 text-muted">
      <StatusGlyph status={proof.status} />
      <span>TestSprite check:</span>
      <span className={`font-medium ${statusTone(proof.status)}`} data-testid="proof-status">
        {STATUS_TEXT[proof.status]}
      </span>
      {proof.url && (
        <a
          href={proof.url}
          target="_blank"
          rel="noreferrer"
          data-testid="proof-link"
          className="ml-2 inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline"
        >
          View check
          <ArrowSquareOut size={13} aria-hidden />
        </a>
      )}
    </p>
  );
}

function StatusSkeleton() {
  return (
    <p className="flex items-center gap-1.5 text-muted" aria-busy="true">
      <span className="size-4 rounded-md bg-raised" />
      <span>TestSprite check:</span>
      <span className="h-3 w-14 animate-pulse rounded-md bg-raised" />
    </p>
  );
}

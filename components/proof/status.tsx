import { CheckCircle, CircleDashed, Question, XCircle } from "@phosphor-icons/react/ssr";
import { connection } from "next/server";
import { getBuildInfo, type BuildInfo } from "@/lib/build";
import { getProof, type Proof, type ProofStatus } from "@/lib/proof";

// PRD P-1, P-2, P-5: the served commit and its TestSprite result. Never "passed" unless GitHub says so.

export const STATUS_TEXT: Record<ProofStatus, string> = {
  passed: "passed",
  failed: "failed",
  pending: "running",
  "not-found": "no check for this commit",
  unavailable: "status unavailable",
  local: "not checked on local builds",
};

/** One or two words, for the phone's top bar. */
export const STATUS_SHORT: Record<ProofStatus, string> = {
  passed: "passed",
  failed: "failed",
  pending: "running",
  "not-found": "no check",
  unavailable: "unknown",
  local: "local",
};

const GLYPH = {
  passed: CheckCircle,
  failed: XCircle,
  pending: CircleDashed,
  "not-found": Question,
  unavailable: Question,
  local: Question,
} as const;

export function statusClass(status: ProofStatus) {
  return status === "passed" ? "is-passed" : status === "failed" ? "is-failed" : "is-neutral";
}

export function StatusGlyph({ status, size = 16 }: { status: ProofStatus; size?: number }) {
  const Icon = GLYPH[status];
  return (
    <Icon
      size={size}
      weight={status === "passed" || status === "failed" ? "fill" : "regular"}
      className={`status-glyph ${statusClass(status)}`}
      aria-hidden
    />
  );
}

export function envText(build: BuildInfo) {
  if (build.env === "production") return "in production";
  if (build.env === "preview") return build.pr ? `on the preview for PR #${build.pr}` : "on a preview";
  return "in development";
}

/** Reads the check at request time; render it inside <Suspense>. */
export async function loadProof(): Promise<{ build: BuildInfo; proof: Proof }> {
  await connection();
  return { build: getBuildInfo(), proof: await getProof() };
}

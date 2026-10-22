import { CheckCircle, CircleDashed, Question, XCircle } from "@phosphor-icons/react/ssr";
import type { ProofStatus } from "@/lib/proof";

export const STATUS_TEXT: Record<ProofStatus, string> = {
  passed: "passed",
  failed: "failed",
  pending: "running",
  "not-found": "no check for this commit",
  unavailable: "status unavailable",
  local: "not checked on local builds",
};

const GLYPH = {
  passed: { Icon: CheckCircle, tone: "text-pass" },
  failed: { Icon: XCircle, tone: "text-fail" },
  pending: { Icon: CircleDashed, tone: "text-muted" },
  "not-found": { Icon: Question, tone: "text-muted" },
  unavailable: { Icon: Question, tone: "text-muted" },
  local: { Icon: Question, tone: "text-muted" },
} as const;

export function StatusGlyph({ status, size = 16 }: { status: ProofStatus; size?: number }) {
  const { Icon, tone } = GLYPH[status];
  return (
    <Icon
      size={size}
      weight={status === "passed" || status === "failed" ? "fill" : "regular"}
      className={`shrink-0 ${tone}`}
      aria-hidden
    />
  );
}

export function statusTone(status: ProofStatus) {
  return status === "passed" ? "text-pass" : status === "failed" ? "text-fail" : "text-muted";
}

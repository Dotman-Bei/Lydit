import { cacheLife } from "next/cache";
import { getBuildInfo, getRepo } from "./build";

// TestSprite check result for the served commit (PRD P-2 to P-5).
// Never reports "passed" unless GitHub says the TestSprite check concluded with success.

export type ProofStatus = "passed" | "failed" | "pending" | "not-found" | "unavailable" | "local";

export interface Proof {
  sha: string | null;
  status: ProofStatus;
  conclusion: string | null;
  url: string | null;
  checkedAt: string;
}

interface CheckRun {
  name: string;
  status: "queued" | "in_progress" | "completed" | string;
  conclusion: string | null;
  html_url: string | null;
  started_at: string | null;
  app?: { slug?: string; name?: string } | null;
}

const isTestSprite = (run: CheckRun) =>
  [run.name, run.app?.slug, run.app?.name].some((s) => s?.toLowerCase().includes("testsprite"));

function toStatus(run: CheckRun): ProofStatus {
  if (run.status !== "completed") return "pending";
  if (run.conclusion === "success") return "passed";
  if (["failure", "timed_out", "cancelled", "action_required"].includes(run.conclusion ?? "")) return "failed";
  return "unavailable";
}

async function fetchCheck(owner: string, repo: string, sha: string): Promise<Proof> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });

  const checkedAt = new Date().toISOString();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}/check-runs?per_page=100`, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { sha, status: "unavailable", conclusion: null, url: null, checkedAt };
    const body = (await res.json()) as { check_runs?: CheckRun[] };
    const runs = (body.check_runs ?? []).filter(isTestSprite);
    if (runs.length === 0) return { sha, status: "not-found", conclusion: null, url: null, checkedAt };
    const latest = runs.sort((a, b) => (b.started_at ?? "").localeCompare(a.started_at ?? ""))[0];
    return { sha, status: toStatus(latest), conclusion: latest.conclusion, url: latest.html_url, checkedAt };
  } catch {
    return { sha, status: "unavailable", conclusion: null, url: null, checkedAt };
  }
}

export async function getProof(): Promise<Proof> {
  const { sha } = getBuildInfo();
  const repo = getRepo();
  if (!sha) return { sha: null, status: "local", conclusion: null, url: null, checkedAt: new Date().toISOString() };
  if (!repo) return { sha, status: "unavailable", conclusion: null, url: null, checkedAt: new Date().toISOString() };
  return fetchCheck(repo.owner, repo.repo, sha);
}

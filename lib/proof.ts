import { cacheLife } from "next/cache";
import { getBuildInfo, getRepo } from "./build";

// TestSprite check result for the served commit (PRD P-2 to P-5).
// Never reports "passed" unless GitHub says TestSprite's check or status concluded with success.

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

interface CommitStatus {
  context: string;
  state: "success" | "failure" | "error" | "pending" | string;
  target_url: string | null;
}

function fromStatus(st: CommitStatus): ProofStatus {
  if (st.state === "success") return "passed";
  if (st.state === "failure" || st.state === "error") return "failed";
  if (st.state === "pending") return "pending";
  return "unavailable";
}

type Found = Pick<Proof, "status" | "conclusion" | "url">;

// TestSprite's GitHub App reports as a commit status ("TestSprite V3"); a check run is read too, in case it posts one.
async function resultFor(api: string, headers: Record<string, string>, sha: string): Promise<Found | null> {
  const get = (path: string) => fetch(`${api}${path}`, { headers, signal: AbortSignal.timeout(5000) });
  const [checks, statuses] = await Promise.all([
    get(`/commits/${sha}/check-runs?per_page=100`),
    get(`/commits/${sha}/status?per_page=100`),
  ]);
  if (!checks.ok || !statuses.ok) throw new Error("GitHub unavailable");

  const runs = (((await checks.json()) as { check_runs?: CheckRun[] }).check_runs ?? []).filter(isTestSprite);
  if (runs.length > 0) {
    const latest = runs.sort((a, b) => (b.started_at ?? "").localeCompare(a.started_at ?? ""))[0];
    return { status: toStatus(latest), conclusion: latest.conclusion, url: latest.html_url };
  }
  // The combined status already keeps only the latest state per context.
  const st = (((await statuses.json()) as { statuses?: CommitStatus[] }).statuses ?? []).find((x) =>
    x.context.toLowerCase().includes("testsprite"),
  );
  return st ? { status: fromStatus(st), conclusion: st.state, url: st.target_url } : null;
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
  const api = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const own = await resultFor(api, headers, sha);
    if (own) return { sha, ...own, checkedAt };

    // A merge commit on main is never tested itself: the suite ran on the pull request's last commit.
    const pulls = await fetch(`${api}/commits/${sha}/pulls`, { headers, signal: AbortSignal.timeout(5000) });
    if (!pulls.ok) return { sha, status: "unavailable", conclusion: null, url: null, checkedAt };
    const merged = ((await pulls.json()) as { merged_at: string | null; head: { sha: string } }[]).find(
      (pr) => pr.merged_at,
    );
    const viaPr = merged ? await resultFor(api, headers, merged.head.sha) : null;
    if (viaPr) return { sha, ...viaPr, checkedAt };
    return { sha, status: "not-found", conclusion: null, url: null, checkedAt };
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

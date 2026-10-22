// Build identity from Vercel system environment variables (PRD P-1, I-1).
// Requires "Automatically expose System Environment Variables" in the Vercel project.

export interface BuildInfo {
  sha: string | null;
  shortSha: string | null;
  pr: string | null;
  ref: string | null;
  env: "production" | "preview" | "development";
}

export function getBuildInfo(): BuildInfo {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || null;
  const vercelEnv = process.env.VERCEL_ENV;
  return {
    sha,
    shortSha: sha ? sha.slice(0, 7) : null,
    pr: process.env.VERCEL_GIT_PULL_REQUEST_ID || null,
    ref: process.env.VERCEL_GIT_COMMIT_REF || null,
    env: vercelEnv === "production" || vercelEnv === "preview" ? vercelEnv : "development",
  };
}

export function getRepo(): { owner: string; repo: string } | null {
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const repo = process.env.VERCEL_GIT_REPO_SLUG;
  if (owner && repo) return { owner, repo };
  const [o, r] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  return o && r ? { owner: o, repo: r } : null;
}

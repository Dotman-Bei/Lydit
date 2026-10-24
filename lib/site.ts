import { getRepo } from "./build";

// Outbound evidence links. Set these in Vercel once the demo PR and suite exist.
// Unset links render as plain text rather than dead anchors.

export const NAV = [
  { href: "/gauge", label: "Gauge" },
  { href: "/proof", label: "Proof" },
  { href: "/sources", label: "Sources" },
  { href: "/#how-it-works", label: "How it works" },
] as const;

export function getLinks() {
  const repo = getRepo();
  return {
    repoUrl: process.env.NEXT_PUBLIC_REPO_URL || (repo ? `https://github.com/${repo.owner}/${repo.repo}` : null),
    demoPrUrl: process.env.NEXT_PUBLIC_DEMO_PR_URL || null,
    suiteUrl: process.env.NEXT_PUBLIC_TESTSPRITE_SUITE_URL || null,
  };
}

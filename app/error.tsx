"use client";

import Link from "next/link";
import { FallbackPage, primaryButton, secondaryButton } from "@/components/fallback-page";

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <FallbackPage
      title="This page failed to render"
      sub="Lydit shows nothing rather than a wrong number. Try again, or start over from the calculator."
    >
      <button type="button" onClick={() => retry()} className={primaryButton}>
        Try again
      </button>
      <Link href="/" className={secondaryButton} data-testid="go-calculator">
        Go to the calculator
      </Link>
    </FallbackPage>
  );
}

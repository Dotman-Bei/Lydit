import type { Metadata } from "next";
import Link from "next/link";
import { FallbackPage, primaryButton } from "@/components/fallback-page";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <FallbackPage title="No page at this address" sub="The calculator is at the root.">
      <Link href="/" className={primaryButton} data-testid="go-calculator">
        Go to the calculator
      </Link>
    </FallbackPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CornerNav } from "@/components/pages/corner-nav";
import { PageMotion } from "@/components/pages/motion";
import { PageFooter } from "@/components/pages/page-footer";
import { SiteIndex } from "@/components/pages/site-index";
import { TwoFieldHero } from "@/components/pages/two-field-hero";
import "./(pages)/pages.css";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="page">
      <CornerNav />
      <main>
        <TwoFieldHero id="not-found-title" lines={["No page", "here"]}>
          <p>Nothing lives at this address. The calculator is at the root.</p>
          <p className="hero__actions">
            <Link href="/" className="page-button" data-testid="go-calculator">
              Open the calculator
            </Link>
          </p>
        </TwoFieldHero>
        <SiteIndex />
      </main>
      <PageFooter />
      <PageMotion />
    </div>
  );
}

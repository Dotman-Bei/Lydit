"use client";

import Link from "next/link";
import { Mark } from "@/components/mark";
import { PageMotion } from "@/components/pages/motion";
import { PageFooter } from "@/components/pages/page-footer";
import { SiteIndex } from "@/components/pages/site-index";
import { TwoFieldHero } from "@/components/pages/two-field-hero";
import "./(pages)/pages.css";

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="page">
      <header className="corner-nav">
        <Link href="/" className="corner-nav__brand" aria-label="Lydit, home">
          <Mark size={20} />
          <span>Lydit</span>
        </Link>
      </header>
      <main>
        <TwoFieldHero id="error-title" lines={["This page", "broke"]}>
          <p>Lydit shows nothing rather than a wrong number. Try again, or start over from the gauge.</p>
          <p className="hero__actions">
            <button type="button" className="page-button" onClick={() => retry()}>
              Try again
            </button>
            <Link href="/gauge" className="hero__link" data-testid="go-calculator">
              Open the gauge
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

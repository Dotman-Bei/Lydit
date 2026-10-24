import Link from "next/link";
import { calculate } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";
import { getPreset } from "@/lib/presets";

// Where to go from a dead end: the four destinations as an index, one row each.
// No hooks or server-only code, so the error boundary can use it too.

export function SiteIndex() {
  const eth = calculate(getPreset("eth-cross").scenario);
  const price = eth.liq?.kind === "price" ? formatFixed(eth.liq.price) : "None";

  const rows = [
    {
      href: "/gauge",
      title: "Gauge",
      text: (
        <>
          Enter a position, read where it liquidates, copy the link. Binance&apos;s ETH example computes to{" "}
          <span className="num">{price}</span> USDT here.
        </>
      ),
    },
    { href: "/#how-it-works", title: "How it works", text: "Why an update cannot grade itself." },
    { href: "/sources", title: "Sources", text: "Every formula and term, and the scenario link format." },
    { href: "/proof", title: "Proof", text: "The commit serving you, and whether it passed." },
  ];

  return (
    <section className="chapter site-index" data-ink="#141414" data-ground="#e3e5e0" aria-labelledby="index-title">
      <h2 id="index-title" className="section-heading" data-reveal>
        Where to go
      </h2>
      <ul className="site-index__list">
        {rows.map((r, i) => (
          <li key={r.href} data-reveal style={{ "--i": i } as React.CSSProperties}>
            <Link href={r.href} className="site-index__row">
              <span className="site-index__title">{r.title}</span>
              <span className="site-index__text">{r.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

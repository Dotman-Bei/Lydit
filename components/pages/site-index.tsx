import Image from "next/image";
import Link from "next/link";
import { calculate } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";
import { getPreset } from "@/lib/presets";
import stater from "@/public/archive/gold-stater.jpg";
import touchstones from "@/public/archive/2-touchstones.jpg";
import woodcut from "@/public/archive/de-re-metallica-1556-p-357aq20-3.jpg";

// Where to go from a dead end: the four destinations, each shown by something real.
// No hooks or server-only code, so the error boundary can use it too.

export function SiteIndex() {
  const eth = calculate(getPreset("eth-cross").scenario);
  const price = eth.liq?.kind === "price" ? formatFixed(eth.liq.price) : "None";

  return (
    <section className="chapter site-index" data-ink="#141414" data-ground="#e3e5e0" aria-labelledby="index-title">
      <h2 id="index-title" className="section-heading" data-reveal>
        Where to go
      </h2>
      <div className="site-index__grid">
        <Link href="/" className="tile tile--wide">
          <div className="tile__picture tile__picture--ui" data-ui data-reveal>
            <div className="fragment">
              <div className="fragment__label">Liquidation price, Binance&apos;s ETH example</div>
              <div className="fragment__row">
                <div className="fragment__figure num">{price}</div>
                <div className="fragment__unit">USDT</div>
              </div>
            </div>
          </div>
          <span className="tile__title" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            Calculator
          </span>
          <span className="tile__text" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            Enter a position, read where it liquidates, copy the link.
          </span>
        </Link>
        <Link href="/how-it-works" className="tile">
          <span className="tile__picture" data-reveal>
            <Image
              src={touchstones}
              alt="Two touchstones, one streaked with gold"
              sizes="(max-width: 1023px) 100vw, 40vw"
            />
          </span>
          <span className="tile__title" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            How it works
          </span>
          <span className="tile__text" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            Why a pull request cannot grade itself.
          </span>
        </Link>
        <Link href="/sources" className="tile">
          <span className="tile__picture tile__picture--paper" data-reveal>
            <Image
              src={woodcut}
              alt="Woodcut of a sixteenth-century assay workshop"
              sizes="(max-width: 1023px) 100vw, 40vw"
            />
          </span>
          <span className="tile__title" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            Sources
          </span>
          <span className="tile__text" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            Every formula and term, and the scenario link format.
          </span>
        </Link>
        <Link href="/proof" className="tile tile--wide">
          <span className="tile__picture" data-reveal>
            <Image
              src={stater}
              alt="A Lydian gold stater stamped with a lion and a bull"
              sizes="(max-width: 1023px) 100vw, 58vw"
            />
          </span>
          <span className="tile__title" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            Proof
          </span>
          <span className="tile__text" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            The commit serving you, and whether it passed.
          </span>
        </Link>
      </div>
    </section>
  );
}

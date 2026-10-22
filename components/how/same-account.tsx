import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { calculate } from "@/lib/calculate";
import { formatFixed } from "@/lib/format";
import { getPreset } from "@/lib/presets";
import { scenarioHref } from "@/lib/scenario";

// Runs Binance's ETH example through this build's engine twice: as Binance computes it,
// and as a per-position calculator would. Nothing here is a stored answer.

export function SameAccount() {
  const withOthers = getPreset("eth-cross").scenario;
  const alone = { ...withOthers, others: [] };
  const a = calculate(withOthers);
  const b = calculate(alone);
  if (a.liq?.kind !== "price" || b.liq?.kind !== "price") return null;

  // Use the displayed 2-decimal prices so the gap matches what a reader subtracts by hand.
  const shownA = a.liq.price.toDecimalPlaces(2);
  const shownB = b.liq.price.toDecimalPlaces(2);
  const gap = shownA.minus(shownB);
  const gapPct = gap.dividedBy(shownA).times(100);

  return (
    <div className="mt-8 overflow-hidden rounded-md border border-line bg-surface">
      <div className="grid md:grid-cols-2">
        <figure className="flex flex-col gap-3 px-5 py-6 sm:px-8 sm:py-8">
          <figcaption className="text-sm text-muted">With the BTC position, as Binance computes it</figcaption>
          <p className="flex items-baseline gap-2">
            <span className="num text-[36px] font-medium leading-none tracking-tight md:text-[44px]">
              {formatFixed(a.liq.price)}
            </span>
            <span className="text-sm text-muted">USDT</span>
          </p>
          <span aria-hidden className="h-1 w-16 rounded-md bg-accent" />
          <Link
            href={scenarioHref(withOthers)}
            className="mt-2 inline-flex w-max items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Open with BTC
            <ArrowRight size={13} aria-hidden />
          </Link>
        </figure>
        <figure className="flex flex-col gap-3 border-t border-line px-5 py-6 sm:px-8 sm:py-8 md:border-l md:border-t-0">
          <figcaption className="text-sm text-muted">ETH position alone</figcaption>
          <p className="flex items-baseline gap-2">
            <span className="num text-[36px] font-medium leading-none tracking-tight text-muted md:text-[44px]">
              {formatFixed(b.liq.price)}
            </span>
            <span className="text-sm text-muted">USDT</span>
          </p>
          <span aria-hidden className="h-1 w-16 rounded-md bg-line-strong" />
          <Link
            href={scenarioHref(alone)}
            className="mt-2 inline-flex w-max items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Open without BTC
            <ArrowRight size={13} aria-hidden />
          </Link>
        </figure>
      </div>
      <div className="border-t border-line bg-raised px-5 py-4 sm:px-8">
        <p className="text-[15px] leading-6">
          The single-position number sits <span className="num font-semibold text-fail">{formatFixed(gap)} USDT</span>{" "}
          lower, <span className="num font-semibold text-fail">{formatFixed(gapPct)}%</span> more room than the account
          has.
        </p>
        <p className="mt-1 text-[13px] leading-5 text-muted">
          Both numbers are computed live by this build from Binance&apos;s inputs.
        </p>
      </div>
    </div>
  );
}

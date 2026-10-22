import { Suspense } from "react";
import { Calculator } from "@/components/calculator/calculator";
import { scenarioFromParams } from "@/lib/scenario";

function Intro() {
  return (
    <>
      <h1 className="max-w-[22ch] text-[28px] font-semibold leading-[34px] tracking-[-0.02em] md:text-4xl md:leading-[42px]">
        Liquidation price, held to Binance&apos;s own answers
      </h1>
      <p className="mt-3 max-w-[60ch] text-base leading-[26px] text-muted">
        Binance USDⓈ-M futures in one-way mode. Every release must reproduce Binance&apos;s worked examples before it
        ships.
      </p>
    </>
  );
}

export default function CalculatorPage({ searchParams }: PageProps<"/">) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-10 md:px-8 md:pt-14 lg:pb-16">
      <Suspense fallback={<CalculatorSkeleton />}>
        <CalculatorFromUrl searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CalculatorFromUrl({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0] !== undefined) params.set(key, value[0]);
  }
  const query = params.toString();
  // Keyed by the query so opening a different scenario link resets the form instead of keeping old state.
  return <Calculator key={query} initial={scenarioFromParams(params)} intro={<Intro />} />;
}

function CalculatorSkeleton() {
  return (
    <div aria-busy="true" className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <Intro />
        <div className="mt-6 h-4 w-48 rounded-md bg-raised" />
        <div className="mt-3 flex gap-2">
          {[128, 128, 176].map((w, i) => (
            <div key={i} className="h-10 rounded-md bg-raised" style={{ width: w }} />
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-11 rounded-md bg-raised" />
          ))}
        </div>
      </div>
      <div className="h-72 rounded-md bg-raised lg:col-span-5" />
    </div>
  );
}

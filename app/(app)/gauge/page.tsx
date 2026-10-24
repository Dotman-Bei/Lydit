import { Suspense } from "react";
import { Calculator } from "@/components/calculator/calculator";
import { scenarioFromParams } from "@/lib/scenario";

export default function CalculatorPage({ searchParams }: PageProps<"/gauge">) {
  return (
    <Suspense fallback={<CalculatorLoading />}>
      <CalculatorFromUrl searchParams={searchParams} />
    </Suspense>
  );
}

async function CalculatorFromUrl({ searchParams }: Pick<PageProps<"/gauge">, "searchParams">) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0] !== undefined) params.set(key, value[0]);
  }
  const query = params.toString();
  // Keyed by the query so opening another scenario link resets the form rather than keeping old state.
  return <Calculator key={query} initial={scenarioFromParams(params)} />;
}

/** The final layout with grey bars at each value's size, labels shown, no shimmer (app chapter §11). */
function CalculatorLoading() {
  return (
    <div aria-busy="true">
      <header className="title-row">
        <div>
          <h1 className="title">Liquidation gauge</h1>
          <p className="subline">Binance USDⓈ-M, one-way mode. Computed at full precision, shown to 2 decimals.</p>
        </div>
      </header>
      <div className="calc-grid">
        <div className="calc-grid__side">
          <section className="card answer">
            <h2 className="answer__label">Liquidation price</h2>
            <span className="bar bar--figure" />
          </section>
        </div>
        <div className="card calc-grid__form">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="bar bar--field" />
          ))}
        </div>
      </div>
    </div>
  );
}

// The direction's hero: paper above, stone below, the headline across the seam, turning gold on the stone.
// No hooks or server-only code, so the error boundary (a client component) can use it too.

export function TwoFieldHero({
  id,
  lines,
  children,
}: {
  id: string;
  lines: [string, string];
  children: React.ReactNode;
}) {
  const copy = (
    <>
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span data-line style={{ "--i": i } as React.CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </>
  );
  return (
    <section className="hero" data-ink="#141414" data-ground="#ffffff" aria-labelledby={id}>
      <h1 id={id} className="hero__title">
        <span className="hero__copy hero__copy--paper lines">{copy}</span>
        <span className="hero__copy hero__copy--stone lines" aria-hidden="true">
          {copy}
        </span>
      </h1>
      <div className="hero__sub" data-rise>
        {children}
      </div>
    </section>
  );
}

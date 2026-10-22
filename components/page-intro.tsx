export function PageIntro({ title, sub, children }: { title: string; sub: string; children?: React.ReactNode }) {
  return (
    <header className="max-w-[760px]">
      <h1 className="text-[32px] font-semibold leading-[38px] tracking-[-0.02em] md:text-[44px] md:leading-[48px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-7 text-muted">{sub}</p>
      {children}
    </header>
  );
}

export function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="max-w-[65ch]">
      <h2 id={id} className="text-[22px] font-semibold leading-7 tracking-tight">
        {title}
      </h2>
      {intro && <p className="mt-2 text-[15px] leading-6 text-muted">{intro}</p>}
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-10 md:px-8 md:pt-14">{children}</div>;
}

export function FallbackPage({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col px-4 pb-24 pt-16 md:px-8 md:pt-24">
      <span aria-hidden className="block h-1 w-10 rounded-md bg-accent" />
      <h1 className="mt-6 max-w-[20ch] text-[32px] font-semibold leading-[38px] tracking-[-0.02em] md:text-[44px] md:leading-[48px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[52ch] text-[17px] leading-7 text-muted">{sub}</p>
      <div className="mt-8 flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

export const primaryButton =
  "inline-flex h-11 items-center gap-2 rounded-md bg-accent-solid px-5 text-sm font-semibold text-on-accent transition-transform duration-150 hover:opacity-95 active:translate-y-px";

export const secondaryButton =
  "inline-flex h-11 items-center gap-2 rounded-md border border-line px-5 text-sm font-semibold text-ink transition-transform duration-150 hover:border-line-strong active:translate-y-px";

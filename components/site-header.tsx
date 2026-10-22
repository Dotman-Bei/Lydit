import Link from "next/link";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex h-10 items-center gap-2.5 rounded-md text-[17px] font-semibold tracking-tight"
    >
      <span aria-hidden className="h-1 w-3.5 rounded-md bg-accent" />
      Lydit
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Main" className="hidden md:block">
            <NavLinks />
          </nav>
        </div>
        <ThemeToggle />
      </div>
      <nav aria-label="Main" className="scrollbar-none -mt-2 overflow-x-auto px-2 pb-1 md:hidden">
        <NavLinks />
      </nav>
    </header>
  );
}

import { ExternalLink } from "./external-link";
import { BINANCE_FAQ_URL } from "@/lib/presets";
import { getLinks } from "@/lib/site";

export function SiteFooter() {
  const { repoUrl } = getLinks();
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8 text-[13px] leading-5 text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p className="max-w-[65ch]">
          Lydit checks Binance USDⓈ-M liquidation prices in one-way mode. It is a calculator, not advice; Binance&apos;s
          engine has the final word.
        </p>
        <ul className="flex shrink-0 gap-5">
          <li>
            <ExternalLink href={BINANCE_FAQ_URL}>Binance FAQ</ExternalLink>
          </li>
          {repoUrl && (
            <li>
              <ExternalLink href={repoUrl}>Source on GitHub</ExternalLink>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}

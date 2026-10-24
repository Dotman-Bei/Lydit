import Link from "next/link";
import { BINANCE_FAQ_URL } from "@/lib/presets";
import { getLinks } from "@/lib/site";
import { FitText } from "./fit-text";

// "Name first, places under it": the wordmark opens the footer on the stone field.
export function PageFooter() {
  const { repoUrl, demoPrUrl } = getLinks();

  return (
    <footer className="page-footer" data-ink="#f1f1ef" data-ground="#141414">
      <FitText fallback="23vw" className="page-footer__name" max={900}>
        LYDIT
      </FitText>
      <div className="page-footer__row">
        <ul className="page-footer__places">
          <li>
            <Link href="/">Open the gauge</Link>
          </li>
          <li>
            <Link href="/proof">See the proof</Link>
          </li>
          <li>
            <Link href="/sources">Read the sources</Link>
          </li>
        </ul>
        <div className="page-footer__small">
          <ul>
            <li>
              <a href={BINANCE_FAQ_URL} target="_blank" rel="noreferrer">
                Binance FAQ
              </a>
            </li>
            <li>
              {repoUrl ? (
                <a href={repoUrl} target="_blank" rel="noreferrer">
                  Source on GitHub
                </a>
              ) : (
                <span>Source on GitHub, linked once public</span>
              )}
            </li>
            <li>
              {demoPrUrl ? (
                <a href={demoPrUrl} target="_blank" rel="noreferrer">
                  The caught mistake
                </a>
              ) : (
                <span>The caught mistake, linked once public</span>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="page-footer__legal">
        <p>A gauge, not advice. Binance&apos;s engine has the final word.</p>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

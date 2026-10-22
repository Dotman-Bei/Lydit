import Link from "next/link";
import credits from "@/public/archive/credits.json";
import { BINANCE_FAQ_URL } from "@/lib/presets";
import { getLinks } from "@/lib/site";
import { FitText } from "./fit-text";

interface Credit {
  file: string;
  title: string;
  creator?: string | null;
  date?: string | null;
  license: string;
  licenseUrl: string;
  page: string;
  via: string;
}

/** Credit lines for the pictures this page uses, as the archive describes them. */
function creditsFor(files: string[]) {
  return (credits as Credit[]).filter((c) => files.some((f) => c.file.endsWith(f)));
}

// "Name first, places under it": the wordmark opens the footer on the stone field.
export function PageFooter({ pictures }: { pictures: string[] }) {
  const { repoUrl, demoPrUrl } = getLinks();
  const used = creditsFor(pictures);

  return (
    <footer className="page-footer" data-ink="#f1f1ef" data-ground="#141414">
      <FitText fallback="23vw" className="page-footer__name" max={900}>
        LYDIT
      </FitText>
      <div className="page-footer__row">
        <ul className="page-footer__places">
          <li>
            <Link href="/">Open the calculator</Link>
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
                  The demo pull request
                </a>
              ) : (
                <span>The demo pull request, linked once open</span>
              )}
            </li>
          </ul>
          {used.length > 0 && (
            <p className="credits">
              Pictures:{" "}
              {used.map((c, i) => (
                <span key={c.file}>
                  <a href={c.page} target="_blank" rel="noreferrer">
                    “{c.title}”
                  </a>
                  {c.creator ? ` by ${c.creator}` : ""}
                  {c.date ? `, ${c.date}` : ""},{" "}
                  <a href={c.licenseUrl} target="_blank" rel="noreferrer">
                    {c.license}
                  </a>
                  , via {c.via}
                  {i < used.length - 1 ? "; " : "."}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
      <div className="page-footer__legal">
        <p>A calculator, not advice. Binance&apos;s engine has the final word.</p>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

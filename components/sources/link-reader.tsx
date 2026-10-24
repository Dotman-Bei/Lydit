"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { scenarioFromParams, scenarioHref } from "@/lib/scenario";

// The sources page's live thing: paste a scenario link and read every input it carries.

const MEANING: Record<string, string> = {
  venue: "Venue, always binance",
  mode: "Margin mode",
  side: "Side of this position",
  size: "Size, in coins",
  ep: "Entry price",
  mp: "Mark price",
  wb: "Wallet balance",
  mmr: "Maintenance margin rate, as a fraction",
  cum: "Maintenance amount",
  tmm: "Other positions' maintenance margin (TMM1)",
  upnl: "Other positions' unrealized PnL (UPNL1)",
};

function meaning(key: string) {
  if (MEANING[key]) return MEANING[key];
  const m = /^o(\d)(side|size|ep|mp|mmr|cum)$/.exec(key);
  if (!m) return "Not a Lydit parameter; ignored";
  const what = {
    side: "side",
    size: "size",
    ep: "entry price",
    mp: "mark price",
    mmr: "rate, as a fraction",
    cum: "maintenance amount",
  }[m[2]];
  return `Other position ${m[1]}: ${what}`;
}

export function LinkReader({ example }: { example: string }) {
  const id = useId();
  const [text, setText] = useState(example);

  const rows = useMemo(() => {
    const q = text.includes("?") ? text.slice(text.indexOf("?") + 1) : text;
    return [...new URLSearchParams(q.trim()).entries()].filter(([k]) => k !== "");
  }, [text]);
  const href = useMemo(() => {
    const q = text.includes("?") ? text.slice(text.indexOf("?") + 1) : text;
    return scenarioHref(scenarioFromParams(new URLSearchParams(q.trim())));
  }, [text]);

  return (
    <div className="reader" data-ui>
      <label htmlFor={id} className="reader__label">
        Paste a scenario link
      </label>
      <textarea
        id={id}
        className="reader__input"
        rows={3}
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {rows.length === 0 ? (
        <p className="reader__empty">This link carries no parameters, so the gauge would open empty.</p>
      ) : (
        <table className="reader__table">
          <thead>
            <tr>
              <th scope="col">Parameter</th>
              <th scope="col">What it sets</th>
              <th scope="col" className="is-num">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, v], i) => (
              <tr key={`${k}-${i}`}>
                <th scope="row">{k}</th>
                <td>{meaning(k)}</td>
                <td className="is-num num">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="reader__foot">
        <span>
          {rows.length} parameter{rows.length === 1 ? "" : "s"}
        </span>
        <Link href={href} className="reader__open">
          Open it in the gauge
        </Link>
      </div>
    </div>
  );
}

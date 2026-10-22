"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Dec } from "@/lib/engine";
import { formatFixed } from "@/lib/format";

// Lydit's own element: where liquidation sits against the mark and entry on one price axis,
// and, when other cross positions exist, where the same position would sit read alone.

interface Mark {
  key: string;
  value: number;
  label: string;
  kind: "liq" | "mark" | "entry" | "alone";
  side: "above" | "below";
}

const CHAR_PX = 6.6; // Jost 12px, average advance
const GAP_PX = 10;

function layoutRows(marks: (Mark & { x: number })[], width: number) {
  const rows: number[][] = [];
  const placed = new Map<string, { row: number; left: number }>();
  for (const m of [...marks].sort((a, b) => a.x - b.x)) {
    const w = m.label.length * CHAR_PX;
    const left = Math.min(Math.max(m.x * width - w / 2, 0), Math.max(width - w, 0));
    let row = rows.findIndex((r) => r.every((right) => left > right + GAP_PX));
    if (row === -1) {
      rows.push([]);
      row = rows.length - 1;
    }
    rows[row].push(left + w);
    placed.set(m.key, { row, left });
  }
  return { placed, rowCount: Math.max(rows.length, 1) };
}

export function PriceStrip({ liq, mark, entry, alone }: { liq: Dec; mark?: Dec; entry?: Dec; alone?: Dec }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const marks: Mark[] = [{ key: "liq", value: liq.toNumber(), label: "Liquidation", kind: "liq", side: "above" }];
  if (mark)
    marks.push({
      key: "mark",
      value: mark.toNumber(),
      label: `Mark ${formatFixed(mark)}`,
      kind: "mark",
      side: "above",
    });
  if (entry)
    marks.push({
      key: "entry",
      value: entry.toNumber(),
      label: `Entry ${formatFixed(entry)}`,
      kind: "entry",
      side: "below",
    });
  if (alone)
    marks.push({
      key: "alone",
      value: alone.toNumber(),
      label: `Alone ${formatFixed(alone)}`,
      kind: "alone",
      side: "below",
    });

  const values = marks.map((m) => m.value);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo || Math.abs(hi) * 0.1 || 1) * 0.08;
  const min = lo - pad;
  const max = hi + pad;
  const withX = marks.map((m) => ({ ...m, x: (m.value - min) / (max - min) }));

  const above = layoutRows(
    withX.filter((m) => m.side === "above"),
    width,
  );
  const below = layoutRows(
    withX.filter((m) => m.side === "below"),
    width,
  );
  const liqX = withX[0].x;
  const markX = withX.find((m) => m.kind === "mark")?.x;

  return (
    <figure className="strip" aria-label="Liquidation, mark and entry on one price axis">
      <div ref={ref} className="strip__plot">
        <div className="strip__labels" style={{ height: above.rowCount * 18 }}>
          {withX
            .filter((m) => m.side === "above")
            .map((m) => {
              const p = above.placed.get(m.key)!;
              return (
                <span
                  key={m.key}
                  className={`strip__label is-${m.kind} num`}
                  style={{ left: p.left, bottom: p.row * 18 }}
                >
                  {m.label}
                </span>
              );
            })}
        </div>
        <div className="strip__axis">
          {markX !== undefined && (
            <span
              className="strip__distance"
              style={{ left: `${Math.min(liqX, markX) * 100}%`, width: `${Math.abs(markX - liqX) * 100}%` }}
            />
          )}
          {withX.map((m) => (
            <span key={m.key} className={`strip__mark is-${m.kind}`} style={{ left: `${m.x * 100}%` }} />
          ))}
        </div>
        <div className="strip__labels is-below" style={{ height: below.rowCount * 18 }}>
          {withX
            .filter((m) => m.side === "below")
            .map((m) => {
              const p = below.placed.get(m.key)!;
              return (
                <span key={m.key} className={`strip__label is-${m.kind} num`} style={{ left: p.left, top: p.row * 18 }}>
                  {m.label}
                </span>
              );
            })}
        </div>
      </div>
    </figure>
  );
}

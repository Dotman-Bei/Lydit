"use client";

import { useEffect, useState } from "react";

// "Names as one sentence": the published answers the suite holds, set dimmed, one lit at a time.
const ANSWERS = [
  "Example 1’s margin",
  "ETHUSDT’s liquidation price and margin",
  "BTCUSDT’s liquidation price and margin",
];

export function HeldOut() {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setLit((i) => (i + 1) % ANSWERS.length), 2000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="statement__names">
      {ANSWERS.map((a, i) => (
        <span key={i} className={`statement__name${i === lit ? " is-lit" : ""}`}>
          {a}
          {i < ANSWERS.length - 2 ? ", " : i === ANSWERS.length - 2 ? " and " : "."}
        </span>
      ))}
    </p>
  );
}

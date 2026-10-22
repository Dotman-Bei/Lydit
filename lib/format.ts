import { D, type Dec } from "./engine";

/** Fixed decimals, half-up, with thousands separators. Uses an ASCII hyphen for negatives. */
export function formatFixed(value: Dec, places = 2): string {
  const fixed = value.toDecimalPlaces(places, D.ROUND_HALF_UP).toFixed(places);
  const negative = fixed.startsWith("-");
  const [int, frac] = (negative ? fixed.slice(1) : fixed).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const out = frac ? `${grouped}.${frac}` : grouped;
  return negative && out !== "0.00" ? `-${out}` : out;
}

/** An input as the engine read it: full precision, grouped, no trailing zeros added. */
export function formatInput(value: Dec): string {
  const plain = value.toFixed();
  const negative = plain.startsWith("-");
  const [int, frac] = (negative ? plain.slice(1) : plain).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}${grouped}${frac ? `.${frac}` : ""}`;
}

/** Wraps negatives in parentheses so substituted formulas read correctly. */
export function term(text: string): string {
  return text.startsWith("-") ? `(${text})` : text;
}

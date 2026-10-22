/** Lydit's mark: a black touchstone with one gold streak drawn across it. */
export function Mark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <rect x="1" y="3" width="16" height="12" rx="3" fill="#141414" />
      <path d="M4.2 11.6 L13.4 6.1 L14 7 L4.9 12.6 Z" fill="#d4b25a" />
    </svg>
  );
}

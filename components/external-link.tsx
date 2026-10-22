import { ArrowSquareOut } from "@phosphor-icons/react/ssr";

export function ExternalLink({
  href,
  children,
  className = "",
  testId,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-testid={testId}
      className={`inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline ${className}`}
    >
      {children}
      <ArrowSquareOut size={13} aria-hidden className="shrink-0" />
    </a>
  );
}
